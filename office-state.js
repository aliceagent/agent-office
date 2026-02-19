/**
 * 🐙 EPSILON'S OFFICE STATE MANAGEMENT SYSTEM
 * 
 * A tentacular state management system that orchestrates the complete flow:
 * Task Assignment → Agent Wake → Board Walk → Task Claim → Desk Work → Completion → Message Send
 * 
 * This system manages:
 * - Agent states and locations with smooth transitions
 * - Kanban board with real-time task flow
 * - Task assignment and completion workflows
 * - Event-driven animations and state changes
 * - Persistent state across browser sessions
 * - Complex interconnected behaviors (my specialty!)
 */

class OfficeStateManager {
    constructor() {
        this.state = this.initializeState();
        this.eventListeners = new Map();
        this.animationQueue = [];
        this.isProcessingAnimations = false;
        
        // Location coordinates for agent movement
        this.locations = {
            'cot-1': { x: 780, y: 180 },
            'cot-2': { x: 780, y: 195 },  
            'cot-3': { x: 780, y: 210 },
            'cot-4': { x: 780, y: 225 },
            'cot-5': { x: 780, y: 240 },
            'cot-6': { x: 780, y: 255 },
            'cot-7': { x: 780, y: 270 },
            'board': { x: 450, y: 200 }, // Kanban board area
            'desk-alice': { x: 50, y: 520 },
            'desk-alpha': { x: 120, y: 520 },
            'desk-beta': { x: 190, y: 520 },
            'desk-gamma': { x: 260, y: 520 },
            'desk-delta': { x: 330, y: 520 },
            'desk-epsilon': { x: 400, y: 520 },
            'desk-zeta': { x: 470, y: 520 },
            'desk-eta': { x: 540, y: 520 },
            'desk-theta': { x: 610, y: 520 }
        };
        
        this.loadState();
        this.bindEvents();
        this.syncUIWithState();
        
        console.log('🐙 Epsilon State Manager initialized - All tentacles deployed!');
    }
    
    /**
     * Initialize the core state structure
     */
    initializeState() {
        return {
            agents: {
                alice: { state: 'working', location: 'desk-alice', task: 'OFFICE-1-1', icon: '🦜' },
                alpha: { state: 'working', location: 'desk-alpha', task: 'OFFICE-1-2', icon: '🐺' },
                beta: { state: 'sleeping', location: 'cot-1', task: null, icon: '🦊' },
                gamma: { state: 'sleeping', location: 'cot-3', task: null, icon: '🦔' },
                delta: { state: 'sleeping', location: 'cot-5', task: null, icon: '🦉' },
                epsilon: { state: 'sleeping', location: 'cot-2', task: null, icon: '🐙' },
                zeta: { state: 'working', location: 'desk-zeta', task: 'OFFICE-1-4', icon: '🦄' },
                eta: { state: 'sleeping', location: 'cot-4', task: null, icon: '🐼' },
                theta: { state: 'sleeping', location: 'cot-6', task: null, icon: '🦝' }
            },
            kanban: {
                backlog: [
                    { id: 'OFFICE-2-1', title: 'Optimize Pool Table Physics', priority: 'medium', type: 'enhancement' },
                    { id: 'OFFICE-2-2', title: 'Add Bird AI to Cage', priority: 'low', type: 'feature' },
                    { id: 'OFFICE-2-3', title: 'Coffee Machine Integration', priority: 'high', type: 'integration' }
                ],
                inProgress: [
                    { id: 'OFFICE-1-1', title: 'State Management System', assignee: 'alice', priority: 'high', type: 'core' },
                    { id: 'OFFICE-1-2', title: 'Animation Pipeline', assignee: 'alpha', priority: 'high', type: 'core' },
                    { id: 'OFFICE-1-4', title: 'Notification System', assignee: 'zeta', priority: 'medium', type: 'feature' }
                ],
                review: [],
                done: [
                    { id: 'OFFICE-0-1', title: 'Initial Canvas Setup', priority: 'high', type: 'setup' }
                ]
            },
            tasks: {
                'OFFICE-1-1': { title: 'State Management System', assignee: 'alice', priority: 'high', type: 'core', status: 'in-progress' },
                'OFFICE-1-2': { title: 'Animation Pipeline', assignee: 'alpha', priority: 'high', type: 'core', status: 'in-progress' },
                'OFFICE-1-4': { title: 'Notification System', assignee: 'zeta', priority: 'medium', type: 'feature', status: 'in-progress' },
                'OFFICE-2-1': { title: 'Optimize Pool Table Physics', assignee: null, priority: 'medium', type: 'enhancement', status: 'backlog' },
                'OFFICE-2-2': { title: 'Add Bird AI to Cage', assignee: null, priority: 'low', type: 'feature', status: 'backlog' },
                'OFFICE-2-3': { title: 'Coffee Machine Integration', assignee: null, priority: 'high', type: 'integration', status: 'backlog' },
                'OFFICE-0-1': { title: 'Initial Canvas Setup', assignee: null, priority: 'high', type: 'setup', status: 'done' }
            },
            metadata: {
                lastUpdate: Date.now(),
                version: '1.0.0-epsilon',
                activeAnimations: 0,
                totalTasksCompleted: 1,
                agentsActive: 3
            }
        };
    }
    
    /**
     * THE MAIN EVENT FLOW ORCHESTRATOR
     * This is where the magic happens - the complete sequence from task assignment to completion!
     */
    async assignTaskToAgent(taskId, agentName) {
        console.log(`🐙 Epsilon: Initiating task assignment flow for ${taskId} → ${agentName}`);
        
        const task = this.state.tasks[taskId];
        const agent = this.state.agents[agentName];
        
        if (!task || !agent) {
            console.error('🐙 Task or agent not found!', { taskId, agentName });
            return false;
        }
        
        if (agent.state !== 'sleeping') {
            console.warn(`🐙 Agent ${agentName} is not sleeping (current: ${agent.state})`);
            return false;
        }
        
        // PHASE 1: Wake the agent
        console.log(`🐙 Phase 1: Waking agent ${agentName}`);
        await this.wakeAgent(agentName);
        
        // PHASE 2: Walk to kanban board
        console.log(`🐙 Phase 2: Agent walking to board`);
        await this.moveAgentToBoard(agentName);
        
        // PHASE 3: Claim the task
        console.log(`🐙 Phase 3: Claiming task ${taskId}`);
        await this.claimTask(taskId, agentName);
        
        // PHASE 4: Walk to workstation
        console.log(`🐙 Phase 4: Moving to workstation`);
        await this.moveAgentToDesk(agentName);
        
        // PHASE 5: Start working
        console.log(`🐙 Phase 5: Beginning work on ${taskId}`);
        await this.startWorking(agentName, taskId);
        
        this.emit('taskAssigned', { taskId, agentName, timestamp: Date.now() });
        this.saveState();
        
        // Schedule completion (for demo purposes)
        setTimeout(() => {
            this.completeTask(taskId, agentName);
        }, Math.random() * 30000 + 15000); // 15-45 seconds
        
        return true;
    }
    
    /**
     * Wake an agent from sleeping state
     */
    async wakeAgent(agentName) {
        const agent = this.state.agents[agentName];
        agent.state = 'walking';
        
        // Remove sleeping visual indicators
        const cotElement = document.querySelector(`#${agent.location.replace('-', '')}`);
        if (cotElement) {
            const sleepingAgent = cotElement.querySelector('.sleeping-agent');
            const zzz = cotElement.querySelector('.zzz');
            if (sleepingAgent) sleepingAgent.remove();
            if (zzz) zzz.remove();
        }
        
        // Create floating agent for movement
        this.createFloatingAgent(agentName);
        
        this.emit('agentWoke', { agentName, timestamp: Date.now() });
        this.updateAgentVisuals(agentName);
        
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    /**
     * Move agent to the kanban board
     */
    async moveAgentToBoard(agentName) {
        const agent = this.state.agents[agentName];
        agent.location = 'board';
        
        await this.animateAgentMovement(agentName, this.locations.board);
        
        this.emit('agentAtBoard', { agentName, timestamp: Date.now() });
        
        return new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    /**
     * Claim a task (move from backlog to in-progress)
     */
    async claimTask(taskId, agentName) {
        const task = this.state.tasks[taskId];
        const agent = this.state.agents[agentName];
        
        // Move task from backlog to in-progress
        const backlogIndex = this.state.kanban.backlog.findIndex(t => t.id === taskId);
        if (backlogIndex !== -1) {
            const taskData = this.state.kanban.backlog.splice(backlogIndex, 1)[0];
            taskData.assignee = agentName;
            this.state.kanban.inProgress.push(taskData);
        }
        
        // Update task and agent
        task.assignee = agentName;
        task.status = 'in-progress';
        agent.task = taskId;
        
        this.emit('taskClaimed', { taskId, agentName, timestamp: Date.now() });
        this.updateKanbanVisuals();
        
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    /**
     * Move agent to their desk
     */
    async moveAgentToDesk(agentName) {
        const agent = this.state.agents[agentName];
        const deskLocation = `desk-${agentName}`;
        agent.location = deskLocation;
        
        await this.animateAgentMovement(agentName, this.locations[deskLocation]);
        
        this.emit('agentAtDesk', { agentName, timestamp: Date.now() });
        
        return new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    /**
     * Start working on a task
     */
    async startWorking(agentName, taskId) {
        const agent = this.state.agents[agentName];
        agent.state = 'working';
        
        // Remove floating agent, update workstation
        this.removeFloatingAgent(agentName);
        this.updateWorkstationVisuals(agentName, taskId);
        
        this.emit('workStarted', { agentName, taskId, timestamp: Date.now() });
        
        return new Promise(resolve => setTimeout(resolve, 500));
    }
    
    /**
     * Complete a task and send notification
     */
    async completeTask(taskId, agentName) {
        console.log(`🐙 Epsilon: Completing task ${taskId} for ${agentName}`);
        
        const task = this.state.tasks[taskId];
        const agent = this.state.agents[agentName];
        
        // Move task to review
        const inProgressIndex = this.state.kanban.inProgress.findIndex(t => t.id === taskId);
        if (inProgressIndex !== -1) {
            const taskData = this.state.kanban.inProgress.splice(inProgressIndex, 1)[0];
            this.state.kanban.review.push(taskData);
        }
        
        // Update task and agent
        task.status = 'review';
        agent.state = 'idle';
        agent.task = null;
        
        // Update visuals
        this.updateWorkstationVisuals(agentName, null);
        this.updateKanbanVisuals();
        
        // Send message through mail chute
        await this.sendCompletionMessage(taskId, agentName);
        
        // After a bit, move task to done and return agent to sleep
        setTimeout(() => {
            this.finalizeTaskCompletion(taskId, agentName);
        }, 5000);
        
        this.state.metadata.totalTasksCompleted++;
        this.emit('taskCompleted', { taskId, agentName, timestamp: Date.now() });
        this.saveState();
    }
    
    /**
     * Send completion message through the mail chute
     */
    async sendCompletionMessage(taskId, agentName) {
        const mailChute = document.getElementById('mailChute');
        if (mailChute) {
            // Create custom message animation
            const message = document.createElement('div');
            message.className = 'message-flying';
            message.innerHTML = `📋 ${taskId}`;
            message.style.fontSize = '8px';
            message.style.color = '#1976d2';
            message.style.fontWeight = 'bold';
            mailChute.appendChild(message);
            
            setTimeout(() => message.remove(), 800);
        }
        
        this.emit('messageSent', { taskId, agentName, timestamp: Date.now() });
        
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    /**
     * Finalize task completion and return agent to rest
     */
    async finalizeTaskCompletion(taskId, agentName) {
        // Move task to done
        const reviewIndex = this.state.kanban.review.findIndex(t => t.id === taskId);
        if (reviewIndex !== -1) {
            const taskData = this.state.kanban.review.splice(reviewIndex, 1)[0];
            this.state.kanban.done.push(taskData);
        }
        
        this.state.tasks[taskId].status = 'done';
        
        // Return agent to available cot
        const availableCot = this.findAvailableCot();
        if (availableCot) {
            await this.returnAgentToSleep(agentName, availableCot);
        }
        
        this.updateKanbanVisuals();
        this.emit('taskFinalized', { taskId, agentName, timestamp: Date.now() });
        this.saveState();
    }
    
    /**
     * Return agent to sleeping state
     */
    async returnAgentToSleep(agentName, cotLocation) {
        const agent = this.state.agents[agentName];
        agent.state = 'sleeping';
        agent.location = cotLocation;
        
        // Create floating agent for movement
        this.createFloatingAgent(agentName);
        await this.animateAgentMovement(agentName, this.locations[cotLocation]);
        
        // Remove floating agent and add to cot
        this.removeFloatingAgent(agentName);
        this.addAgentToCot(agentName, cotLocation);
        
        this.emit('agentResting', { agentName, cotLocation, timestamp: Date.now() });
    }
    
    /**
     * ANIMATION SYSTEM
     */
    createFloatingAgent(agentName) {
        const agent = this.state.agents[agentName];
        let floatingAgent = document.getElementById(`floating-${agentName}`);
        
        if (!floatingAgent) {
            floatingAgent = document.createElement('div');
            floatingAgent.id = `floating-${agentName}`;
            floatingAgent.className = 'floating-agent';
            floatingAgent.innerHTML = agent.icon;
            floatingAgent.setAttribute('data-name', agentName);
            const officeContainer = document.querySelector('.office-container');
            if (officeContainer) {
                officeContainer.appendChild(floatingAgent);
            } else {
                console.error('🐙 Office container not found!');
                return;
            }
        }
        
        const currentLocation = this.locations[agent.location];
        floatingAgent.style.left = currentLocation.x + 'px';
        floatingAgent.style.top = currentLocation.y + 'px';
        floatingAgent.style.display = 'block';
    }
    
    removeFloatingAgent(agentName) {
        const floatingAgent = document.getElementById(`floating-${agentName}`);
        if (floatingAgent) {
            floatingAgent.remove();
        }
    }
    
    async animateAgentMovement(agentName, targetLocation) {
        const floatingAgent = document.getElementById(`floating-${agentName}`);
        if (!floatingAgent) return;
        
        floatingAgent.style.left = targetLocation.x + 'px';
        floatingAgent.style.top = targetLocation.y + 'px';
        
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    /**
     * UI SYNCHRONIZATION METHODS
     */
    updateWorkstationVisuals(agentName, taskId) {
        const workstation = document.querySelector(`[data-agent="${agentName}"]`);
        if (!workstation) return;
        
        const badge = workstation.querySelector('.ticket-badge');
        const statusDot = workstation.querySelector('.status-dot');
        
        if (taskId) {
            workstation.classList.add('working');
            badge.textContent = taskId;
            badge.style.display = 'block';
            statusDot.classList.add('working');
        } else {
            workstation.classList.remove('working');
            badge.textContent = '';
            badge.style.display = 'none';
            statusDot.classList.remove('working');
        }
    }
    
    updateAgentVisuals(agentName) {
        // Update status panel
        this.updateStatusPanel();
    }
    
    updateStatusPanel() {
        const statusPanel = document.querySelector('.status-panel');
        if (!statusPanel) return;
        
        let html = '<h3>📊 Office Status</h3>';
        
        Object.entries(this.state.agents).forEach(([name, agent]) => {
            let status = agent.state;
            if (status === 'sleeping') status = 'Off';
            else if (status === 'working') status = 'Working';
            else if (status === 'walking') status = 'Moving';
            else status = 'Idle';
            
            html += `<div class="status-item"><span class="icon">${agent.icon}</span> ${name} — ${status}</div>`;
        });
        
        statusPanel.innerHTML = html;
    }
    
    updateKanbanVisuals() {
        console.log('🐙 Updating Kanban visuals:', this.state.kanban);
        // In a full implementation, this would update a visual kanban board
        // For now, we log the state
    }
    
    addAgentToCot(agentName, cotLocation) {
        const agent = this.state.agents[agentName];
        const cotElement = document.getElementById(cotLocation.replace('-', ''));
        
        if (cotElement) {
            // Add sleeping agent
            const sleepingAgent = document.createElement('span');
            sleepingAgent.className = 'sleeping-agent';
            sleepingAgent.innerHTML = agent.icon;
            cotElement.appendChild(sleepingAgent);
            
            // Add ZZZ animation
            const zzz = document.createElement('span');
            zzz.className = 'zzz';
            zzz.innerHTML = '💤';
            cotElement.appendChild(zzz);
        }
    }
    
    findAvailableCot() {
        const cotLocations = ['cot-1', 'cot-2', 'cot-3', 'cot-4', 'cot-5', 'cot-6', 'cot-7'];
        const occupiedCots = Object.values(this.state.agents)
            .filter(agent => agent.state === 'sleeping')
            .map(agent => agent.location);
        
        return cotLocations.find(cot => !occupiedCots.includes(cot)) || 'cot-1';
    }
    
    /**
     * STATE PERSISTENCE
     */
    saveState() {
        this.state.metadata.lastUpdate = Date.now();
        try {
            localStorage.setItem('office-state', JSON.stringify(this.state));
            console.log('🐙 State saved to localStorage');
        } catch (error) {
            console.error('🐙 Failed to save state:', error);
        }
    }
    
    loadState() {
        try {
            const saved = localStorage.getItem('office-state');
            if (saved) {
                const loadedState = JSON.parse(saved);
                // Merge with default state to handle version upgrades
                this.state = { ...this.state, ...loadedState };
                console.log('🐙 State loaded from localStorage');
            }
        } catch (error) {
            console.error('🐙 Failed to load state:', error);
        }
    }
    
    /**
     * EVENT SYSTEM
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }
    
    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => callback(data));
        }
        console.log(`🐙 Event emitted: ${event}`, data);
    }
    
    /**
     * UTILITY METHODS
     */
    bindEvents() {
        // Bind UI events for manual task assignment
        document.addEventListener('click', (e) => {
            if (e.target.matches('.workstation:not(.working)')) {
                const agentName = e.target.getAttribute('data-agent');
                if (this.state.agents[agentName].state === 'sleeping') {
                    this.assignNextTask(agentName);
                }
            }
        });
    }
    
    assignNextTask(agentName) {
        const availableTask = this.state.kanban.backlog[0];
        if (availableTask) {
            this.assignTaskToAgent(availableTask.id, agentName);
        } else {
            console.log(`🐙 No available tasks for ${agentName}`);
        }
    }
    
    syncUIWithState() {
        // Sync initial state with UI
        this.updateStatusPanel();
        Object.keys(this.state.agents).forEach(agentName => {
            const agent = this.state.agents[agentName];
            if (agent.state === 'working' && agent.task) {
                this.updateWorkstationVisuals(agentName, agent.task);
            }
        });
    }
    
    /**
     * DEBUG AND API METHODS
     */
    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }
    
    getAgentStatus(agentName) {
        return this.state.agents[agentName];
    }
    
    getKanbanStatus() {
        return this.state.kanban;
    }
    
    // For testing - simulate task assignment
    simulateTaskAssignment() {
        const sleepingAgents = Object.keys(this.state.agents).filter(
            name => this.state.agents[name].state === 'sleeping'
        );
        const availableTasks = this.state.kanban.backlog;
        
        if (sleepingAgents.length > 0 && availableTasks.length > 0) {
            const randomAgent = sleepingAgents[Math.floor(Math.random() * sleepingAgents.length)];
            const randomTask = availableTasks[Math.floor(Math.random() * availableTasks.length)];
            
            console.log(`🐙 Simulating assignment: ${randomTask.id} → ${randomAgent}`);
            this.assignTaskToAgent(randomTask.id, randomAgent);
        }
    }
}

// Global state manager instance
window.officeState = new OfficeStateManager();

// 🐙 Epsilon's debugging interface
window.epsilon = {
    getState: () => window.officeState.getState(),
    assignTask: (taskId, agentName) => window.officeState.assignTaskToAgent(taskId, agentName),
    simulate: () => window.officeState.simulateTaskAssignment(),
    agents: () => Object.keys(window.officeState.state.agents),
    tasks: () => window.officeState.state.kanban,
    tentacles: '🐙🐙🐙🐙🐙🐙🐙🐙'
};

console.log('🐙 Epsilon State System loaded! Try epsilon.simulate() to test the flow!');