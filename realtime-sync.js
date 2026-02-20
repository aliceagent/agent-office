/**
 * Real-time Sync Manager for Office Canvas
 * Handles WebSocket connections with REST fallback polling
 */

class RealTimeSyncManager {
    constructor(options = {}) {
        this.wsUrl = options.wsUrl || 'wss://office-agent-events.agentcaras.workers.dev/ws';
        this.restUrl = options.restUrl || 'https://office-agent-events.agentcaras.workers.dev/api/agent-status';
        this.maxRetries = options.maxRetries || 5;
        this.retryDelay = options.retryDelay || 1000;
        this.pollInterval = options.pollInterval || 1000; // 1 second fallback polling
        this.pingInterval = options.pingInterval || 30000; // 30 seconds
        
        this.websocket = null;
        this.isConnected = false;
        this.retryCount = 0;
        this.usingFallback = false;
        this.pollTimer = null;
        this.pingTimer = null;
        this.reconnectTimer = null;
        
        this.eventHandlers = new Map();
        this.lastEventTime = 0;
        this.processedEventIds = new Set();
        this.maxProcessedEvents = 100; // Keep track of recent events to avoid duplicates
        
        // Integration with walk animation engine
        this.walkEngine = null;
        
        // Integration with office state manager
        this.officeState = null;
        
        console.log('🔄 Real-time Sync Manager initialized');
    }

    /**
     * Initialize connection (try WebSocket first, fallback to REST)
     */
    async connect() {
        console.log('🚀 Attempting WebSocket connection...');
        
        try {
            await this.connectWebSocket();
        } catch (error) {
            console.warn('⚠️ WebSocket connection failed, falling back to REST polling:', error);
            this.startRestFallback();
        }
    }

    /**
     * Establish WebSocket connection
     */
    async connectWebSocket() {
        return new Promise((resolve, reject) => {
            try {
                this.websocket = new WebSocket(this.wsUrl);
                
                this.websocket.onopen = () => {
                    console.log('✅ WebSocket connected');
                    this.isConnected = true;
                    this.retryCount = 0;
                    this.usingFallback = false;
                    this.stopRestFallback();
                    this.startPingTimer();
                    resolve();
                };
                
                this.websocket.onmessage = (event) => {
                    this.handleWebSocketMessage(event.data);
                };
                
                this.websocket.onclose = (event) => {
                    console.log('🔌 WebSocket disconnected:', event.code, event.reason);
                    this.isConnected = false;
                    this.stopPingTimer();
                    
                    if (!event.wasClean && this.retryCount < this.maxRetries) {
                        this.scheduleReconnect();
                    } else {
                        console.warn('🔄 WebSocket retries exhausted, switching to REST fallback');
                        this.startRestFallback();
                    }
                };
                
                this.websocket.onerror = (error) => {
                    console.error('❌ WebSocket error:', error);
                    reject(error);
                };
                
                // Connection timeout
                setTimeout(() => {
                    if (!this.isConnected) {
                        reject(new Error('WebSocket connection timeout'));
                    }
                }, 10000);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Handle incoming WebSocket messages
     */
    handleWebSocketMessage(data) {
        try {
            const message = JSON.parse(data);
            
            switch (message.type) {
                case 'sync':
                    this.handleSyncMessage(message.data);
                    break;
                case 'agent-event':
                    this.handleAgentEvent(message.data);
                    break;
                case 'pong':
                    // Heartbeat response
                    break;
                default:
                    console.log('Unknown WebSocket message:', message);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }

    /**
     * Handle sync message (initial state)
     */
    handleSyncMessage(data) {
        console.log('📥 Received sync data:', data);
        
        if (data.agents) {
            this.emit('agents-sync', {
                agents: data.agents,
                timestamp: data.timestamp
            });
        }
    }

    /**
     * Handle agent event
     */
    handleAgentEvent(event) {
        // Prevent duplicate processing
        if (this.processedEventIds.has(event.eventId)) {
            return;
        }
        
        this.processedEventIds.add(event.eventId);
        
        // Clean up old processed events
        if (this.processedEventIds.size > this.maxProcessedEvents) {
            const toDelete = Array.from(this.processedEventIds).slice(0, 50);
            toDelete.forEach(id => this.processedEventIds.delete(id));
        }
        
        console.log('🎯 Agent event:', event);
        
        // If this is a movement event, trigger animation
        if (event.type === 'agent-state-change' && this.shouldAnimateTransition(event)) {
            this.handleMovementAnimation(event);
        }
        
        this.emit('agent-state-change', event);
        this.lastEventTime = event.timestamp;
    }

    /**
     * Determine if a state change should trigger animation
     */
    shouldAnimateTransition(event) {
        const { previousState, newState } = event;
        
        // Animate if location changed and agent is moving or transitioning to work
        return previousState && 
               previousState.location !== newState.location &&
               (newState.animationState === 'walking' || 
                newState.state === 'moving' ||
                (previousState.state === 'sleeping' && newState.state === 'working'));
    }

    /**
     * Handle movement animation
     */
    handleMovementAnimation(event) {
        if (!this.walkEngine || !this.officeState) {
            console.warn('Walk engine or office state not available for animation');
            return;
        }
        
        const { agentId, previousState, newState } = event;
        const locations = this.officeState.locations;
        
        if (!locations[previousState.location] || !locations[newState.location]) {
            console.warn('Location coordinates not found for animation');
            return;
        }
        
        const fromPos = locations[previousState.location];
        const toPos = locations[newState.location];
        
        this.walkEngine.startWalkAnimation(agentId, fromPos, toPos, {
            duration: 2500,
            curveIntensity: 0.2,
            onComplete: () => {
                console.log(`🚶‍♂️ Animation complete for ${agentId}`);
                this.emit('animation-complete', { agentId, event });
            },
            onUpdate: (data) => {
                this.emit('animation-update', data);
            }
        });
    }

    /**
     * Start REST polling fallback
     */
    startRestFallback() {
        if (this.usingFallback) return;
        
        console.log('🔄 Starting REST polling fallback');
        this.usingFallback = true;
        
        this.pollTimer = setInterval(() => {
            this.pollAgentStatus();
        }, this.pollInterval);
        
        // Initial poll
        this.pollAgentStatus();
    }

    /**
     * Stop REST polling fallback
     */
    stopRestFallback() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
        this.usingFallback = false;
        console.log('⏹️ Stopped REST polling fallback');
    }

    /**
     * Poll agent status via REST API
     */
    async pollAgentStatus() {
        try {
            const response = await fetch(this.restUrl, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Process recent events
                if (data.data.recentEvents) {
                    data.data.recentEvents.forEach(event => {
                        if (event.timestamp > this.lastEventTime) {
                            this.handleAgentEvent(event);
                        }
                    });
                }
                
                // Emit agent states
                this.emit('agents-sync', {
                    agents: data.data.agents,
                    timestamp: data.data.timestamp,
                    source: 'rest-poll'
                });
            }
        } catch (error) {
            console.error('❌ REST polling error:', error);
        }
    }

    /**
     * Schedule WebSocket reconnection
     */
    scheduleReconnect() {
        const delay = this.retryDelay * Math.pow(2, this.retryCount); // Exponential backoff
        this.retryCount++;
        
        console.log(`🔄 Scheduling reconnect in ${delay}ms (attempt ${this.retryCount})`);
        
        this.reconnectTimer = setTimeout(async () => {
            try {
                await this.connectWebSocket();
            } catch (error) {
                console.error('Reconnection failed:', error);
                if (this.retryCount < this.maxRetries) {
                    this.scheduleReconnect();
                } else {
                    this.startRestFallback();
                }
            }
        }, delay);
    }

    /**
     * Start ping timer for WebSocket keepalive
     */
    startPingTimer() {
        this.pingTimer = setInterval(() => {
            if (this.isConnected && this.websocket) {
                this.websocket.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
            }
        }, this.pingInterval);
    }

    /**
     * Stop ping timer
     */
    stopPingTimer() {
        if (this.pingTimer) {
            clearInterval(this.pingTimer);
            this.pingTimer = null;
        }
    }

    /**
     * Disconnect from all services
     */
    disconnect() {
        console.log('🔌 Disconnecting real-time sync...');
        
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        
        this.stopRestFallback();
        this.stopPingTimer();
        
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        
        this.isConnected = false;
    }

    /**
     * Set integration references
     */
    setIntegrations(walkEngine, officeState) {
        this.walkEngine = walkEngine;
        this.officeState = officeState;
        console.log('🔗 Integrations set: Walk Engine + Office State');
    }

    /**
     * Event emitter functionality
     */
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }

    emit(event, data) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    /**
     * Get connection status
     */
    getStatus() {
        return {
            connected: this.isConnected,
            usingFallback: this.usingFallback,
            retryCount: this.retryCount,
            lastEventTime: this.lastEventTime,
            activeAnimations: this.walkEngine ? this.walkEngine.getActiveAnimations() : []
        };
    }
}

// Export for use in office canvas
window.RealTimeSyncManager = RealTimeSyncManager;