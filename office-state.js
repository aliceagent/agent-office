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
        this.agentPersonalities = this.initializePersonalities();
        
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
            'pool-table': { x: 400, y: 280 }, // Pool table area
            'water-cooler': { x: 200, y: 300 }, // Water cooler chat area
            'kitchen': { x: 100, y: 300 }, // Kitchen for coffee runs
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
        
        // Track agent interactions and proximity
        this.agentInteractions = {
            lastSpeechBubble: 0,
            activeInteractions: new Map(),
            proximityThreshold: 80 // pixels for proximity detection
        };
        
        // Office events system
        this.officeEvents = {
            lastEventTime: 0,
            minEventInterval: 20 * 60 * 1000, // 20 minutes
            maxEventInterval: 40 * 60 * 1000, // 40 minutes
            activeEvents: new Set(),
            eventTypes: ['coffee-run', 'water-cooler-chat', 'celebration']
        };
        
        this.loadState();
        this.bindEvents();
        this.syncUIWithState();
        
        // Start personality-based idle animations
        this.startIdleAnimationLoops();
        
        // Start agent interaction system
        this.startInteractionSystem();
        
        // Start office events system
        this.startOfficeEventsSystem();
        
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
     * Initialize personality configurations for each agent
     */
    initializePersonalities() {
        return {
            alice: {
                traits: ['cheerful', 'organized', 'tidy'],
                description: 'Cheerful, organized, tidies desk',
                animationSpeed: 1.0, // normal speed
                idleAnimations: ['tidy-desk', 'organize-papers', 'smile-wave'],
                workStyle: 'methodical',
                speechPatterns: ['Great! Let me organize this task...', 'Everything in its place!', 'Perfect! ✨'],
                favoriteActivities: ['desk-organizing', 'task-planning']
            },
            alpha: {
                traits: ['competitive', 'fast', 'rushing'],
                description: 'Competitive, fast, rushes to tasks',
                animationSpeed: 1.5, // 50% faster
                idleAnimations: ['pace-around', 'quick-stretches', 'impatient-tap'],
                workStyle: 'sprint',
                speechPatterns: ['Let\'s go! Time to move!', 'I\'ll get this done first!', 'Speed is key! 🏃‍♂️'],
                favoriteActivities: ['pool-table', 'racing-tasks']
            },
            beta: {
                traits: ['skeptical', 'analytical', 'rubber-duck-debugging'],
                description: 'Skeptical, talks to rubber duck',
                animationSpeed: 0.8, // 20% slower, more deliberate
                idleAnimations: ['talk-to-duck', 'suspicious-glance', 'analyze-code'],
                workStyle: 'analytical',
                speechPatterns: ['Hmm, this seems suspicious...', 'Let me debug this properly...', 'Rubber duck, what do you think? 🦆'],
                favoriteActivities: ['debugging', 'code-review']
            },
            gamma: {
                traits: ['cautious', 'methodical', 'validator'],
                description: 'Cautious, methodical, validates',
                animationSpeed: 0.7, // slower and careful
                idleAnimations: ['check-twice', 'validate-work', 'careful-review'],
                workStyle: 'validator',
                speechPatterns: ['Let me double-check this...', 'Better safe than sorry!', 'Validation complete! ✅'],
                favoriteActivities: ['quality-assurance', 'testing']
            },
            delta: {
                traits: ['wise', 'nocturnal', 'night-owl'],
                description: 'Wise, nocturnal, most active at night',
                animationSpeed: 0.6, // very slow and deliberate during day
                idleAnimations: ['wise-nod', 'owl-look', 'night-stretch'],
                workStyle: 'contemplative',
                speechPatterns: ['Wisdom comes with patience...', 'The night brings clarity...', 'Hoot hoot, let me think... 🦉'],
                favoriteActivities: ['night-work', 'mentoring'],
                activeHours: [20, 21, 22, 23, 0, 1, 2, 3, 4, 5] // 8 PM to 5 AM
            },
            epsilon: {
                traits: ['complex', 'multi-tasking', 'tentacular'],
                description: 'Complex, manages multiple things',
                animationSpeed: 1.2, // variable speed
                idleAnimations: ['tentacle-organize', 'multi-task', 'complex-juggle'],
                workStyle: 'parallel',
                speechPatterns: ['Managing 8 things at once!', 'Complexity is my specialty!', 'All tentacles deployed! 🐙'],
                favoriteActivities: ['multi-tasking', 'orchestration']
            },
            zeta: {
                traits: ['creative', 'colorful', 'rainbow-magic'],
                description: 'Creative, rainbow effects',
                animationSpeed: 1.1, // slightly faster with flair
                idleAnimations: ['rainbow-sparkle', 'creative-gesture', 'unicorn-prance'],
                workStyle: 'artistic',
                speechPatterns: ['Let\'s add some magic!', 'Rainbow time! 🌈', 'Creativity flowing! ✨'],
                favoriteActivities: ['creative-work', 'design']
            },
            eta: {
                traits: ['chill', 'relaxed', 'snack-lover'],
                description: 'Chill, takes snack breaks',
                animationSpeed: 0.5, // very relaxed
                idleAnimations: ['snack-break', 'lazy-stretch', 'chill-wave'],
                workStyle: 'relaxed',
                speechPatterns: ['Time for a snack break!', 'Let\'s keep it chill...', 'No rush, no worry! 🐼'],
                favoriteActivities: ['snacking', 'relaxing'],
                snackBreakChance: 0.3 // 30% chance of snack break during idle
            },
            theta: {
                traits: ['curious', 'explorer', 'tester'],
                description: 'Curious, tests everything',
                animationSpeed: 1.3, // quick and darting
                idleAnimations: ['investigate', 'poke-things', 'curious-sniff'],
                workStyle: 'experimental',
                speechPatterns: ['What happens if I...?', 'Let me test this!', 'Curiosity drives discovery! 🦝'],
                favoriteActivities: ['testing', 'exploration']
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
        
        // Trigger celebration event for task completion
        this.onTaskCompleted(taskId, agentName);
        
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
        
        // Get personality-based animation speed
        const personality = this.agentPersonalities[agentName];
        const baseAnimationTime = 1000;
        const personalizedTime = Math.round(baseAnimationTime / personality.animationSpeed);
        
        // Add personality-based movement style
        floatingAgent.style.transition = `all ${personalizedTime}ms ease-in-out`;
        floatingAgent.style.left = targetLocation.x + 'px';
        floatingAgent.style.top = targetLocation.y + 'px';
        
        // Add personality flair to movement
        if (personality.traits.includes('fast') || personality.traits.includes('rushing')) {
            floatingAgent.classList.add('rushing-movement');
        } else if (personality.traits.includes('cautious') || personality.traits.includes('methodical')) {
            floatingAgent.classList.add('careful-movement');
        } else if (personality.traits.includes('chill') || personality.traits.includes('relaxed')) {
            floatingAgent.classList.add('relaxed-movement');
        }
        
        return new Promise(resolve => setTimeout(resolve, personalizedTime));
    }
    
    /**
     * Trigger personality-based idle animations for agents
     */
    triggerIdleAnimation(agentName) {
        const agent = this.state.agents[agentName];
        const personality = this.agentPersonalities[agentName];
        
        if (agent.state !== 'idle' && agent.state !== 'working') return;
        
        // Choose random idle animation based on personality
        const animations = personality.idleAnimations;
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        
        // Check for special conditions (like Delta's night preference)
        if (agentName === 'delta' && personality.activeHours) {
            const currentHour = new Date().getHours();
            const isActiveTime = personality.activeHours.includes(currentHour);
            if (!isActiveTime) {
                // Delta is less active during day hours
                if (Math.random() < 0.3) return; // 70% chance to skip animation during day
            }
        }
        
        // Check for Eta's snack break chance
        if (agentName === 'eta' && personality.snackBreakChance) {
            if (Math.random() < personality.snackBreakChance) {
                randomAnimation = 'snack-break';
            }
        }
        
        this.executeIdleAnimation(agentName, randomAnimation, personality);
    }
    
    /**
     * Execute the specific idle animation
     */
    executeIdleAnimation(agentName, animationType, personality) {
        const workstation = document.querySelector(`[data-agent="${agentName}"]`);
        const floatingAgent = document.getElementById(`floating-${agentName}`);
        const targetElement = floatingAgent || workstation;
        
        if (!targetElement) return;
        
        // Create animation bubble
        const animationBubble = document.createElement('div');
        animationBubble.className = 'idle-animation-bubble';
        animationBubble.style.position = 'absolute';
        animationBubble.style.zIndex = '1000';
        animationBubble.style.pointerEvents = 'none';
        
        // Set animation content based on type and personality
        const animationContent = this.getAnimationContent(animationType, personality);
        animationBubble.innerHTML = animationContent;
        
        // Position the bubble
        const rect = targetElement.getBoundingClientRect();
        const container = document.querySelector('.office-container');
        if (container) {
            const containerRect = container.getBoundingClientRect();
            animationBubble.style.left = (rect.left - containerRect.left) + 'px';
            animationBubble.style.top = (rect.top - containerRect.top - 30) + 'px';
            container.appendChild(animationBubble);
        }
        
        // Animate and remove
        const animationDuration = Math.round(2000 / personality.animationSpeed);
        setTimeout(() => {
            if (animationBubble.parentNode) {
                animationBubble.remove();
            }
        }, animationDuration);
        
        console.log(`🎭 ${agentName} performing: ${animationType}`);
    }
    
    /**
     * Get animation content based on animation type and personality
     */
    getAnimationContent(animationType, personality) {
        const animationMap = {
            'tidy-desk': '🧹✨',
            'organize-papers': '📄📋',
            'smile-wave': '😊👋',
            'pace-around': '🏃‍♂️💨',
            'quick-stretches': '🤸‍♂️',
            'impatient-tap': '⏰👆',
            'talk-to-duck': '🦆💭',
            'suspicious-glance': '🤨👁️',
            'analyze-code': '🔍💻',
            'check-twice': '✅✅',
            'validate-work': '🔍✓',
            'careful-review': '📋👀',
            'wise-nod': '🦉💭',
            'owl-look': '👁️🦉',
            'night-stretch': '🌙💪',
            'tentacle-organize': '🐙📚',
            'multi-task': '🔄🎯',
            'complex-juggle': '🤹‍♂️💫',
            'rainbow-sparkle': '🌈✨',
            'creative-gesture': '🎨🖌️',
            'unicorn-prance': '🦄💖',
            'snack-break': '🥨☕',
            'lazy-stretch': '😌🤗',
            'chill-wave': '🐼👋',
            'investigate': '🔍🕵️',
            'poke-things': '👆🤔',
            'curious-sniff': '👃🦝'
        };
        
        return animationMap[animationType] || '✨';
    }
    
    /**
     * Start personality-based idle animation loops for all agents
     */
    startIdleAnimationLoops() {
        setInterval(() => {
            Object.keys(this.state.agents).forEach(agentName => {
                if (Math.random() < 0.3) { // 30% chance per agent per interval
                    this.triggerIdleAnimation(agentName);
                }
            });
        }, 5000); // Check every 5 seconds
    }
    
    /**
     * AGENT INTERACTION SYSTEM
     */
    
    /**
     * Check proximity between agents and trigger interactions
     */
    checkAgentProximity() {
        const agents = Object.entries(this.state.agents);
        const idleAgents = agents.filter(([name, agent]) => agent.state === 'idle');
        
        // Check for pool table interactions
        this.checkPoolTableInteraction(idleAgents);
        
        // Check for general proximity interactions
        this.checkGeneralProximity(idleAgents);
        
        // Trigger random speech bubbles
        if (Math.random() < 0.2) { // 20% chance per check
            this.triggerRandomSpeechBubble();
        }
    }
    
    /**
     * Check if multiple idle agents are near the pool table
     */
    checkPoolTableInteraction(idleAgents) {
        const poolTableLocation = this.locations['pool-table'];
        const agentsNearPool = [];
        
        idleAgents.forEach(([agentName, agent]) => {
            const agentLocation = this.locations[agent.location] || poolTableLocation;
            const distance = this.calculateDistance(agentLocation, poolTableLocation);
            
            if (distance < this.agentInteractions.proximityThreshold) {
                agentsNearPool.push(agentName);
            }
        });
        
        // If 2+ agents are near the pool table, start pool game
        if (agentsNearPool.length >= 2 && !this.agentInteractions.activeInteractions.has('pool-game')) {
            this.startPoolGameInteraction(agentsNearPool);
        }
    }
    
    /**
     * Start pool game interaction between agents
     */
    startPoolGameInteraction(agentNames) {
        const interactionId = 'pool-game-' + Date.now();
        this.agentInteractions.activeInteractions.set('pool-game', {
            id: interactionId,
            participants: agentNames,
            startTime: Date.now(),
            type: 'pool-game'
        });
        
        // Create visual indication of pool game
        this.createPoolGameVisual(agentNames);
        
        // Schedule end of interaction
        setTimeout(() => {
            this.endInteraction('pool-game');
        }, 15000 + Math.random() * 10000); // 15-25 seconds
        
        console.log(`🎱 Pool game started with: ${agentNames.join(', ')}`);
    }
    
    /**
     * Create visual representation of pool game
     */
    createPoolGameVisual(agentNames) {
        const poolTable = document.querySelector('.pool-table');
        if (!poolTable) return;
        
        // Create interaction bubble
        const gameIndicator = document.createElement('div');
        gameIndicator.className = 'pool-game-indicator';
        gameIndicator.style.position = 'absolute';
        gameIndicator.style.top = '-40px';
        gameIndicator.style.left = '50%';
        gameIndicator.style.transform = 'translateX(-50%)';
        gameIndicator.style.zIndex = '1000';
        gameIndicator.style.background = 'rgba(0,0,0,0.8)';
        gameIndicator.style.color = 'white';
        gameIndicator.style.padding = '5px 10px';
        gameIndicator.style.borderRadius = '15px';
        gameIndicator.style.fontSize = '12px';
        gameIndicator.style.whiteSpace = 'nowrap';
        
        // Add participant icons and game text
        const participantIcons = agentNames.map(name => this.state.agents[name].icon).join(' ');
        gameIndicator.innerHTML = `${participantIcons} 🎱 Pool Game!`;
        
        poolTable.appendChild(gameIndicator);
        
        // Add slight animation to pool balls
        const poolBalls = poolTable.querySelector('.pool-balls');
        if (poolBalls) {
            poolBalls.style.animation = 'pool-game-shake 0.5s ease-in-out infinite alternate';
        }
    }
    
    /**
     * Check for general proximity interactions between agents
     */
    checkGeneralProximity(idleAgents) {
        for (let i = 0; i < idleAgents.length; i++) {
            for (let j = i + 1; j < idleAgents.length; j++) {
                const [agent1Name, agent1] = idleAgents[i];
                const [agent2Name, agent2] = idleAgents[j];
                
                const location1 = this.locations[agent1.location];
                const location2 = this.locations[agent2.location];
                
                if (location1 && location2) {
                    const distance = this.calculateDistance(location1, location2);
                    
                    if (distance < this.agentInteractions.proximityThreshold) {
                        // Chance for casual interaction
                        if (Math.random() < 0.1) { // 10% chance when in proximity
                            this.triggerProximityInteraction(agent1Name, agent2Name);
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Trigger interaction between two nearby agents
     */
    triggerProximityInteraction(agent1Name, agent2Name) {
        const personality1 = this.agentPersonalities[agent1Name];
        const personality2 = this.agentPersonalities[agent2Name];
        
        // Create conversation bubble
        const conversations = [
            `${agent1Name}: ${personality1.speechPatterns[0]}`,
            `${agent2Name}: ${personality2.speechPatterns[0]}`,
            `${agent1Name}: How's your task going?`,
            `${agent2Name}: Making good progress!`,
            `${agent1Name}: Want to grab coffee later?`,
            `${agent2Name}: Sounds great!`
        ];
        
        const randomConversation = conversations[Math.floor(Math.random() * conversations.length)];
        this.createSpeechBubble(agent1Name, randomConversation);
        
        console.log(`💬 Proximity interaction: ${agent1Name} and ${agent2Name}`);
    }
    
    /**
     * Create speech bubble for work banter
     */
    createSpeechBubble(agentName, message) {
        const now = Date.now();
        if (now - this.agentInteractions.lastSpeechBubble < 3000) return; // Cooldown
        this.agentInteractions.lastSpeechBubble = now;
        
        const agent = this.state.agents[agentName];
        const agentLocation = this.locations[agent.location];
        if (!agentLocation) return;
        
        const bubble = document.createElement('div');
        bubble.className = 'speech-bubble';
        bubble.style.position = 'absolute';
        bubble.style.left = (agentLocation.x + 20) + 'px';
        bubble.style.top = (agentLocation.y - 40) + 'px';
        bubble.style.background = 'white';
        bubble.style.border = '2px solid #333';
        bubble.style.borderRadius = '15px';
        bubble.style.padding = '8px 12px';
        bubble.style.fontSize = '12px';
        bubble.style.maxWidth = '200px';
        bubble.style.zIndex = '1000';
        bubble.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        bubble.textContent = message;
        
        // Add tail to bubble
        bubble.style.position = 'relative';
        bubble.innerHTML += '<div style="position: absolute; bottom: -8px; left: 20px; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid white;"></div>';
        
        const container = document.querySelector('.office-container');
        if (container) {
            container.appendChild(bubble);
            
            // Remove bubble after delay
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.remove();
                }
            }, 4000);
        }
    }
    
    /**
     * Trigger random work banter speech bubbles
     */
    triggerRandomSpeechBubble() {
        const workingAgents = Object.entries(this.state.agents)
            .filter(([name, agent]) => agent.state === 'working')
            .map(([name]) => name);
            
        if (workingAgents.length === 0) return;
        
        const randomAgent = workingAgents[Math.floor(Math.random() * workingAgents.length)];
        const personality = this.agentPersonalities[randomAgent];
        
        const workBanter = [
            ...personality.speechPatterns,
            'This code is looking good!',
            'Almost done with this task...',
            'Need more coffee!',
            'Great teamwork everyone!',
            'Anyone else hear that?',
            'Time for a quick break?'
        ];
        
        const randomBanter = workBanter[Math.floor(Math.random() * workBanter.length)];
        this.createSpeechBubble(randomAgent, randomBanter);
    }
    
    /**
     * Calculate distance between two points
     */
    calculateDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * End an active interaction
     */
    endInteraction(interactionType) {
        const interaction = this.agentInteractions.activeInteractions.get(interactionType);
        if (!interaction) return;
        
        // Clean up visual elements
        if (interactionType === 'pool-game') {
            const poolTable = document.querySelector('.pool-table');
            if (poolTable) {
                const indicator = poolTable.querySelector('.pool-game-indicator');
                const poolBalls = poolTable.querySelector('.pool-balls');
                
                if (indicator) indicator.remove();
                if (poolBalls) poolBalls.style.animation = '';
            }
        }
        
        this.agentInteractions.activeInteractions.delete(interactionType);
        console.log(`🔚 Interaction ended: ${interactionType}`);
    }
    
    /**
     * Start proximity checking loops
     */
    startInteractionSystem() {
        setInterval(() => {
            this.checkAgentProximity();
        }, 3000); // Check every 3 seconds
    }
    
    /**
     * OFFICE EVENTS SYSTEM
     */
    
    /**
     * Check if it's time for a random office event
     */
    checkForOfficeEvents() {
        const now = Date.now();
        const timeSinceLastEvent = now - this.officeEvents.lastEventTime;
        
        if (timeSinceLastEvent < this.officeEvents.minEventInterval) {
            return; // Too soon for next event
        }
        
        // Calculate probability based on time elapsed
        const maxWaitTime = this.officeEvents.maxEventInterval;
        const probability = Math.min((timeSinceLastEvent - this.officeEvents.minEventInterval) / (maxWaitTime - this.officeEvents.minEventInterval), 1.0);
        
        if (Math.random() < probability * 0.1) { // Scale down probability for more realistic timing
            this.triggerRandomOfficeEvent();
        }
    }
    
    /**
     * Trigger a random office event
     */
    triggerRandomOfficeEvent() {
        const availableEvents = this.officeEvents.eventTypes.filter(event => 
            !this.officeEvents.activeEvents.has(event)
        );
        
        if (availableEvents.length === 0) return;
        
        const eventType = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        this.officeEvents.lastEventTime = Date.now();
        this.officeEvents.activeEvents.add(eventType);
        
        console.log(`🎉 Office event triggered: ${eventType}`);
        
        switch (eventType) {
            case 'coffee-run':
                this.triggerCoffeeRun();
                break;
            case 'water-cooler-chat':
                this.triggerWaterCoolerChat();
                break;
            case 'celebration':
                this.triggerCelebration();
                break;
        }
    }
    
    /**
     * Coffee run event: agent walks to kitchen and returns
     */
    async triggerCoffeeRun() {
        // Select a random agent who isn't actively working on a critical task
        const eligibleAgents = Object.entries(this.state.agents)
            .filter(([name, agent]) => agent.state === 'working' || agent.state === 'idle')
            .map(([name]) => name);
            
        if (eligibleAgents.length === 0) {
            this.officeEvents.activeEvents.delete('coffee-run');
            return;
        }
        
        const selectedAgent = eligibleAgents[Math.floor(Math.random() * eligibleAgents.length)];
        const agent = this.state.agents[selectedAgent];
        const originalLocation = agent.location;
        const originalState = agent.state;
        
        // Create coffee run announcement
        this.createEventAnnouncement('☕ Coffee Run!', `${this.state.agents[selectedAgent].icon} ${selectedAgent} is getting coffee for everyone!`);
        
        try {
            // Move agent to kitchen
            agent.state = 'coffee-run';
            agent.location = 'kitchen';
            this.createFloatingAgent(selectedAgent);
            await this.animateAgentMovement(selectedAgent, this.locations.kitchen);
            
            // Show coffee activity
            this.createCoffeeActivity(selectedAgent);
            
            // Wait at kitchen
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Return to original location
            agent.location = originalLocation;
            await this.animateAgentMovement(selectedAgent, this.locations[originalLocation]);
            this.removeFloatingAgent(selectedAgent);
            agent.state = originalState;
            
            // Update visuals
            this.updateAgentVisuals(selectedAgent);
            
        } catch (error) {
            console.error('Coffee run error:', error);
        } finally {
            this.officeEvents.activeEvents.delete('coffee-run');
        }
        
        console.log(`☕ Coffee run completed by ${selectedAgent}`);
    }
    
    /**
     * Water cooler chat event: 2-3 agents gather briefly
     */
    async triggerWaterCoolerChat() {
        // Select 2-3 random agents
        const eligibleAgents = Object.entries(this.state.agents)
            .filter(([name, agent]) => agent.state === 'working' || agent.state === 'idle')
            .map(([name]) => name);
            
        if (eligibleAgents.length < 2) {
            this.officeEvents.activeEvents.delete('water-cooler-chat');
            return;
        }
        
        const participantCount = Math.min(3, Math.max(2, Math.floor(Math.random() * 3) + 2));
        const participants = eligibleAgents.slice(0, participantCount);
        const originalStates = {};
        const originalLocations = {};
        
        // Create water cooler chat announcement
        const participantIcons = participants.map(name => this.state.agents[name].icon).join(' ');
        this.createEventAnnouncement('💬 Water Cooler Chat', `${participantIcons} gathering for some office gossip!`);
        
        try {
            // Move agents to water cooler
            for (const agentName of participants) {
                const agent = this.state.agents[agentName];
                originalStates[agentName] = agent.state;
                originalLocations[agentName] = agent.location;
                
                agent.state = 'chatting';
                agent.location = 'water-cooler';
                this.createFloatingAgent(agentName);
                await this.animateAgentMovement(agentName, this.locations['water-cooler']);
            }
            
            // Show chat activity
            this.createWaterCoolerChatActivity(participants);
            
            // Chat duration
            await new Promise(resolve => setTimeout(resolve, 8000));
            
            // Return agents to original locations
            for (const agentName of participants) {
                const agent = this.state.agents[agentName];
                agent.location = originalLocations[agentName];
                await this.animateAgentMovement(agentName, this.locations[originalLocations[agentName]]);
                this.removeFloatingAgent(agentName);
                agent.state = originalStates[agentName];
                this.updateAgentVisuals(agentName);
            }
            
        } catch (error) {
            console.error('Water cooler chat error:', error);
        } finally {
            this.officeEvents.activeEvents.delete('water-cooler-chat');
        }
        
        console.log(`💬 Water cooler chat completed with: ${participants.join(', ')}`);
    }
    
    /**
     * Celebration event: confetti when task completes
     */
    triggerCelebration(taskId = null, agentName = null) {
        const celebrationId = `celebration-${Date.now()}`;
        
        // If no specific task completion, create a general celebration
        if (!taskId && !agentName) {
            const workingAgents = Object.entries(this.state.agents)
                .filter(([name, agent]) => agent.state === 'working')
                .map(([name]) => name);
                
            if (workingAgents.length > 0) {
                agentName = workingAgents[Math.floor(Math.random() * workingAgents.length)];
                taskId = this.state.agents[agentName].task || 'Mystery Task';
            }
        }
        
        if (!agentName) {
            this.officeEvents.activeEvents.delete('celebration');
            return;
        }
        
        // Create celebration announcement
        this.createEventAnnouncement('🎉 Celebration!', `${this.state.agents[agentName].icon} ${agentName} just completed ${taskId}!`);
        
        // Create confetti effect
        this.createConfettiEffect(agentName);
        
        // Schedule cleanup
        setTimeout(() => {
            this.officeEvents.activeEvents.delete('celebration');
            this.cleanupConfetti();
        }, 6000);
        
        console.log(`🎉 Celebration for ${agentName} completing ${taskId}`);
    }
    
    /**
     * Create event announcement banner
     */
    createEventAnnouncement(title, message) {
        const banner = document.createElement('div');
        banner.className = 'event-announcement';
        banner.style.position = 'fixed';
        banner.style.top = '20px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        banner.style.color = 'white';
        banner.style.padding = '15px 25px';
        banner.style.borderRadius = '25px';
        banner.style.fontSize = '16px';
        banner.style.fontWeight = 'bold';
        banner.style.zIndex = '10000';
        banner.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        banner.style.animation = 'slideInFromTop 0.5s ease-out';
        banner.innerHTML = `<div style="font-size: 18px; margin-bottom: 5px;">${title}</div><div style="font-size: 14px; opacity: 0.9;">${message}</div>`;
        
        document.body.appendChild(banner);
        
        // Remove banner after delay
        setTimeout(() => {
            if (banner.parentNode) {
                banner.style.animation = 'slideOutToTop 0.5s ease-in forwards';
                setTimeout(() => banner.remove(), 500);
            }
        }, 4000);
    }
    
    /**
     * Create coffee activity visual
     */
    createCoffeeActivity(agentName) {
        const kitchen = document.querySelector('.kitchen') || document.createElement('div');
        const coffeeIcon = document.createElement('div');
        coffeeIcon.className = 'coffee-activity';
        coffeeIcon.style.position = 'absolute';
        coffeeIcon.style.top = '-30px';
        coffeeIcon.style.left = '50%';
        coffeeIcon.style.transform = 'translateX(-50%)';
        coffeeIcon.style.fontSize = '20px';
        coffeeIcon.style.animation = 'bobbing 1s ease-in-out infinite';
        coffeeIcon.innerHTML = '☕💨';
        
        const container = document.querySelector('.office-container');
        if (container) {
            coffeeIcon.style.position = 'absolute';
            coffeeIcon.style.left = this.locations.kitchen.x + 'px';
            coffeeIcon.style.top = (this.locations.kitchen.y - 30) + 'px';
            container.appendChild(coffeeIcon);
            
            setTimeout(() => coffeeIcon.remove(), 5000);
        }
    }
    
    /**
     * Create water cooler chat activity visual
     */
    createWaterCoolerChatActivity(participants) {
        const chatBubbles = ['💬', '😄', '🗣️', '👥'];
        
        participants.forEach((agentName, index) => {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.className = 'chat-bubble';
                bubble.style.position = 'absolute';
                bubble.style.left = (this.locations['water-cooler'].x + (index * 20)) + 'px';
                bubble.style.top = (this.locations['water-cooler'].y - 40) + 'px';
                bubble.style.fontSize = '16px';
                bubble.style.animation = 'float 1s ease-in-out infinite';
                bubble.innerHTML = chatBubbles[index % chatBubbles.length];
                
                const container = document.querySelector('.office-container');
                if (container) {
                    container.appendChild(bubble);
                    setTimeout(() => bubble.remove(), 6000);
                }
            }, index * 1000);
        });
    }
    
    /**
     * Create confetti effect
     */
    createConfettiEffect(agentName) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
        const confettiCount = 20;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.position = 'absolute';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.zIndex = '9999';
                
                // Position around the agent
                const agentLocation = this.locations[this.state.agents[agentName].location];
                if (agentLocation) {
                    confetti.style.left = (agentLocation.x + (Math.random() - 0.5) * 100) + 'px';
                    confetti.style.top = (agentLocation.y + (Math.random() - 0.5) * 100) + 'px';
                    confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s ease-out forwards`;
                    
                    const container = document.querySelector('.office-container');
                    if (container) {
                        container.appendChild(confetti);
                        setTimeout(() => confetti.remove(), 4000);
                    }
                }
            }, i * 100);
        }
    }
    
    /**
     * Clean up confetti elements
     */
    cleanupConfetti() {
        const confettiElements = document.querySelectorAll('.confetti');
        confettiElements.forEach(confetti => confetti.remove());
    }
    
    /**
     * Start office events system
     */
    startOfficeEventsSystem() {
        // Check for events every 2 minutes
        setInterval(() => {
            this.checkForOfficeEvents();
        }, 2 * 60 * 1000);
        
        // Set initial last event time to now to prevent immediate event
        this.officeEvents.lastEventTime = Date.now();
    }
    
    /**
     * Trigger celebration on task completion (integration hook)
     */
    onTaskCompleted(taskId, agentName) {
        // Call existing task completion logic first
        this.triggerCelebration(taskId, agentName);
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