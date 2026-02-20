/**
 * Agent Events System for Real-time Office Canvas
 * Manages WebSocket connections and agent state broadcasting
 */

export class AgentEventsManager {
  constructor(env) {
    this.env = env;
    this.connections = new Map();
    this.agentStates = new Map();
    this.eventHistory = [];
    this.maxHistorySize = 100;
  }

  /**
   * Handle WebSocket upgrade and connection management
   */
  async handleWebSocket(request) {
    const [client, server] = Object.values(new WebSocketPair());
    const connectionId = crypto.randomUUID();
    
    server.accept();
    
    // Store connection
    this.connections.set(connectionId, {
      socket: server,
      connectedAt: Date.now(),
      lastPing: Date.now()
    });

    console.log(`WebSocket connected: ${connectionId}, total: ${this.connections.size}`);

    // Send current agent states to new connection
    server.send(JSON.stringify({
      type: 'sync',
      data: {
        agents: Object.fromEntries(this.agentStates),
        timestamp: Date.now(),
        eventId: crypto.randomUUID()
      }
    }));

    // Handle connection events
    server.addEventListener('message', (event) => {
      this.handleMessage(connectionId, event.data);
    });

    server.addEventListener('close', () => {
      this.connections.delete(connectionId);
      console.log(`WebSocket disconnected: ${connectionId}, remaining: ${this.connections.size}`);
    });

    server.addEventListener('error', (event) => {
      console.error(`WebSocket error for ${connectionId}:`, event);
      this.connections.delete(connectionId);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleMessage(connectionId, message) {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'ping':
          this.handlePing(connectionId);
          break;
        case 'agent-update':
          this.handleAgentUpdate(data);
          break;
        default:
          console.log(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  /**
   * Handle ping messages
   */
  handlePing(connectionId) {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.lastPing = Date.now();
      connection.socket.send(JSON.stringify({ type: 'pong' }));
    }
  }

  /**
   * Handle agent state updates
   */
  async handleAgentUpdate(data) {
    const { agentId, newState, timestamp } = data.data;
    
    // Validate agent update
    if (!agentId || !newState) {
      console.error('Invalid agent update:', data);
      return;
    }

    // Update agent state
    const previousState = this.agentStates.get(agentId);
    this.agentStates.set(agentId, {
      ...newState,
      lastUpdated: timestamp || Date.now()
    });

    // Create event
    const event = {
      eventId: crypto.randomUUID(),
      type: 'agent-state-change',
      agentId,
      previousState,
      newState,
      timestamp: timestamp || Date.now()
    };

    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Broadcast to all connections
    this.broadcast(event);

    console.log(`Agent update: ${agentId} → ${newState.state} at ${newState.location}`);
  }

  /**
   * Broadcast event to all connected clients
   */
  broadcast(event) {
    const message = JSON.stringify({
      type: 'agent-event',
      data: event
    });

    // Clean up dead connections and send to active ones
    const deadConnections = [];
    
    for (const [connectionId, connection] of this.connections) {
      try {
        connection.socket.send(message);
      } catch (error) {
        console.error(`Failed to send to ${connectionId}:`, error);
        deadConnections.push(connectionId);
      }
    }

    // Remove dead connections
    deadConnections.forEach(id => this.connections.delete(id));
    
    if (deadConnections.length > 0) {
      console.log(`Cleaned up ${deadConnections.length} dead connections`);
    }
  }

  /**
   * Simulate agent state change (for testing/Mission Control integration)
   */
  async simulateAgentEvent(agentId, fromState, toState) {
    const event = {
      agentId,
      newState: {
        state: toState.state,
        location: toState.location,
        task: toState.task || null,
        animationState: toState.animationState || 'idle'
      },
      timestamp: Date.now()
    };

    await this.handleAgentUpdate({ type: 'agent-update', data: event });
  }

  /**
   * Get current connection count
   */
  getConnectionCount() {
    return this.connections.size;
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit = 10) {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Get agent states for REST API
   */
  getAgentStates() {
    return Object.fromEntries(this.agentStates);
  }
}