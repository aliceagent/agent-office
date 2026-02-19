/**
 * 🦉 DELTA'S ACHIEVEMENTS & CELEBRATIONS SYSTEM
 * 
 * Integrates with Epsilon's state management to add:
 * - Achievement tracking and milestone celebrations
 * - Trophy case with expandable UI
 * - Confetti animations on task completion
 * - Daily/weekly completion counters
 * - Streak tracking with persistence
 */

class AchievementsManager {
    constructor() {
        this.achievements = this.defineAchievements();
        this.data = this.loadAchievementsData();
        this.confettiColors = ['#ff6b35', '#f7931e', '#ffd23f', '#06d6a0', '#118ab2', '#073b4c'];
        
        this.initializeUI();
        this.bindToOfficeState();
        this.updateCounters();
        
        console.log('🦉 Delta Achievement System initialized!');
    }
    
    /**
     * Define all available achievements
     */
    defineAchievements() {
        return {
            'first-task': {
                id: 'first-task',
                title: 'First Task',
                description: 'Complete your very first task',
                icon: '🎯',
                requirement: 1,
                type: 'completion'
            },
            'getting-started': {
                id: 'getting-started',
                title: 'Getting Started',
                description: 'Complete 10 tasks',
                icon: '🚀',
                requirement: 10,
                type: 'completion'
            },
            'productive': {
                id: 'productive',
                title: 'Productive',
                description: 'Complete 50 tasks',
                icon: '💪',
                requirement: 50,
                type: 'completion'
            },
            'machine': {
                id: 'machine',
                title: 'Machine',
                description: 'Complete 100 tasks',
                icon: '🤖',
                requirement: 100,
                type: 'completion'
            },
            'legend': {
                id: 'legend',
                title: 'Legend',
                description: 'Complete 500 tasks',
                icon: '👑',
                requirement: 500,
                type: 'completion'
            },
            'daily-warrior': {
                id: 'daily-warrior',
                title: 'Daily Warrior',
                description: 'Complete 10 tasks in one day',
                icon: '⚔️',
                requirement: 10,
                type: 'daily'
            },
            'streak-master': {
                id: 'streak-master',
                title: 'Streak Master',
                description: 'Maintain a 7-day completion streak',
                icon: '🔥',
                requirement: 7,
                type: 'streak'
            }
        };
    }
    
    /**
     * Load achievements data from localStorage
     */
    loadAchievementsData() {
        try {
            const saved = localStorage.getItem('office-achievements');
            if (saved) {
                const data = JSON.parse(saved);
                console.log('🦉 Achievement data loaded:', data);
                return this.migrateData(data);
            }
        } catch (error) {
            console.error('🦉 Failed to load achievement data:', error);
        }
        
        return this.getDefaultData();
    }
    
    /**
     * Get default achievement data structure
     */
    getDefaultData() {
        return {
            totalCompletions: 0,
            unlockedAchievements: [],
            dailyCompletions: {},
            weeklyCompletions: {},
            currentStreak: 0,
            longestStreak: 0,
            lastCompletionDate: null,
            streakData: {},
            version: '1.0.0'
        };
    }
    
    /**
     * Migrate data for version compatibility
     */
    migrateData(data) {
        const defaultData = this.getDefaultData();
        return { ...defaultData, ...data, version: '1.0.0' };
    }
    
    /**
     * Save achievements data to localStorage
     */
    saveAchievementsData() {
        try {
            localStorage.setItem('office-achievements', JSON.stringify(this.data));
            console.log('🦉 Achievement data saved');
        } catch (error) {
            console.error('🦉 Failed to save achievement data:', error);
        }
    }
    
    /**
     * Initialize the trophy case UI
     */
    initializeUI() {
        this.createTrophyCase();
        this.createConfettiCanvas();
        this.updateTrophyCase();
        this.updateStatusCounters();
    }
    
    /**
     * Create the trophy case HTML structure
     */
    createTrophyCase() {
        const trophyCase = document.createElement('div');
        trophyCase.id = 'trophy-case';
        trophyCase.innerHTML = `
            <div class="trophy-icon" onclick="achievements.toggleTrophyCase()">
                🏆
                <div class="achievement-notification" id="achievement-notification" style="display: none;">
                    +1
                </div>
            </div>
            <div class="trophy-panel" id="trophy-panel" style="display: none;">
                <div class="trophy-header">
                    <h3>🏆 Achievements</h3>
                    <span class="close-trophy" onclick="achievements.toggleTrophyCase()">✕</span>
                </div>
                <div class="achievement-grid" id="achievement-grid">
                    <!-- Achievements will be populated here -->
                </div>
                <div class="trophy-stats">
                    <div class="stat-item">
                        <span class="stat-label">Total Tasks:</span>
                        <span class="stat-value" id="total-tasks-stat">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Achievements:</span>
                        <span class="stat-value" id="unlocked-achievements-stat">0/7</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add CSS styles
        const styles = document.createElement('style');
        styles.textContent = `
            #trophy-case {
                position: absolute;
                top: 60px;
                right: 10px;
                z-index: 100;
            }
            
            .trophy-icon {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
                transition: all 0.3s ease;
                position: relative;
                border: 2px solid #f39c12;
            }
            
            .trophy-icon:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
            }
            
            .achievement-notification {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #e74c3c;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .trophy-panel {
                position: absolute;
                top: 60px;
                right: 0;
                width: 320px;
                max-height: 400px;
                background: rgba(0, 0, 0, 0.95);
                color: white;
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
                border: 1px solid #333;
                overflow-y: auto;
            }
            
            .trophy-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                padding-bottom: 8px;
                border-bottom: 1px solid #444;
            }
            
            .trophy-header h3 {
                margin: 0;
                font-size: 16px;
                color: #ffd700;
            }
            
            .close-trophy {
                cursor: pointer;
                font-size: 16px;
                color: #999;
                transition: color 0.2s;
            }
            
            .close-trophy:hover {
                color: #fff;
            }
            
            .achievement-grid {
                display: grid;
                gap: 8px;
                margin-bottom: 16px;
            }
            
            .achievement-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px;
                border-radius: 8px;
                transition: all 0.2s;
                position: relative;
            }
            
            .achievement-item.unlocked {
                background: rgba(76, 175, 80, 0.2);
                border: 1px solid #4caf50;
            }
            
            .achievement-item.locked {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid #444;
                opacity: 0.6;
            }
            
            .achievement-icon {
                font-size: 20px;
                width: 32px;
                text-align: center;
            }
            
            .achievement-info {
                flex: 1;
            }
            
            .achievement-title {
                font-weight: bold;
                font-size: 13px;
                margin-bottom: 2px;
            }
            
            .achievement-description {
                font-size: 11px;
                color: #ccc;
                line-height: 1.3;
            }
            
            .achievement-progress {
                font-size: 10px;
                color: #999;
                margin-top: 2px;
            }
            
            .achievement-item.unlocked .achievement-progress {
                color: #4caf50;
            }
            
            .trophy-stats {
                border-top: 1px solid #444;
                padding-top: 12px;
                display: flex;
                justify-content: space-between;
            }
            
            .stat-item {
                text-align: center;
            }
            
            .stat-label {
                display: block;
                font-size: 10px;
                color: #999;
                margin-bottom: 2px;
            }
            
            .stat-value {
                font-size: 14px;
                font-weight: bold;
                color: #ffd700;
            }
            
            /* Confetti Canvas */
            #confetti-canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1000;
            }
            
            /* Status panel counters */
            .completion-counters {
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid #333;
            }
            
            .counter-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                margin: 2px 0;
            }
            
            .counter-value {
                color: #4fc3f7;
                font-weight: bold;
            }
            
            .streak-value {
                color: #ff6b35 !important;
            }
        `;
        
        document.head.appendChild(styles);
        document.querySelector('.office-container').appendChild(trophyCase);
    }
    
    /**
     * Create confetti canvas for celebrations
     */
    createConfettiCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.width = 900;
        canvas.height = 600;
        
        document.querySelector('.office-container').appendChild(canvas);
        this.confettiCanvas = canvas;
        this.confettiCtx = canvas.getContext('2d');
    }
    
    /**
     * Bind to Epsilon's office state events
     */
    bindToOfficeState() {
        if (window.officeState) {
            window.officeState.on('taskCompleted', (data) => {
                this.onTaskCompleted(data);
            });
        } else {
            console.warn('🦉 Office state not found - achievements will not track automatically');
        }
    }
    
    /**
     * Handle task completion event
     */
    onTaskCompleted(data) {
        console.log('🦉 Processing task completion for achievements:', data);
        
        this.incrementCompletions();
        this.updateStreakData();
        this.checkAndUnlockAchievements();
        this.triggerConfetti();
        this.updateCounters();
        this.saveAchievementsData();
    }
    
    /**
     * Increment total and daily completion counts
     */
    incrementCompletions() {
        this.data.totalCompletions++;
        
        const today = this.getTodayKey();
        const thisWeek = this.getWeekKey();
        
        if (!this.data.dailyCompletions[today]) {
            this.data.dailyCompletions[today] = 0;
        }
        
        if (!this.data.weeklyCompletions[thisWeek]) {
            this.data.weeklyCompletions[thisWeek] = 0;
        }
        
        this.data.dailyCompletions[today]++;
        this.data.weeklyCompletions[thisWeek]++;
        
        // Clean old data (keep last 30 days and 12 weeks)
        this.cleanOldData();
    }
    
    /**
     * Update streak tracking data
     */
    updateStreakData() {
        const today = this.getTodayKey();
        const yesterday = this.getYesterdayKey();
        
        if (!this.data.lastCompletionDate) {
            // First completion ever
            this.data.currentStreak = 1;
            this.data.streakData[today] = true;
        } else if (this.data.lastCompletionDate === today) {
            // Already completed today, streak continues
            return;
        } else if (this.data.lastCompletionDate === yesterday) {
            // Completed yesterday, extend streak
            this.data.currentStreak++;
            this.data.streakData[today] = true;
        } else {
            // Streak broken, start new one
            this.data.currentStreak = 1;
            this.data.streakData = { [today]: true };
        }
        
        this.data.lastCompletionDate = today;
        
        if (this.data.currentStreak > this.data.longestStreak) {
            this.data.longestStreak = this.data.currentStreak;
        }
    }
    
    /**
     * Check and unlock new achievements
     */
    checkAndUnlockAchievements() {
        const newAchievements = [];
        
        Object.values(this.achievements).forEach(achievement => {
            if (this.data.unlockedAchievements.includes(achievement.id)) {
                return; // Already unlocked
            }
            
            let unlocked = false;
            
            switch (achievement.type) {
                case 'completion':
                    unlocked = this.data.totalCompletions >= achievement.requirement;
                    break;
                case 'daily':
                    const today = this.getTodayKey();
                    unlocked = (this.data.dailyCompletions[today] || 0) >= achievement.requirement;
                    break;
                case 'streak':
                    unlocked = this.data.currentStreak >= achievement.requirement;
                    break;
            }
            
            if (unlocked) {
                this.data.unlockedAchievements.push(achievement.id);
                newAchievements.push(achievement);
                console.log(`🦉 Achievement unlocked: ${achievement.title}`);
            }
        });
        
        if (newAchievements.length > 0) {
            this.celebrateAchievements(newAchievements);
        }
        
        this.updateTrophyCase();
    }
    
    /**
     * Celebrate newly unlocked achievements
     */
    celebrateAchievements(achievements) {
        // Show notification badge
        const notification = document.getElementById('achievement-notification');
        if (notification) {
            notification.textContent = `+${achievements.length}`;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        }
        
        // Trigger special confetti for achievements
        this.triggerAchievementConfetti();
        
        // Flash trophy case
        const trophyIcon = document.querySelector('.trophy-icon');
        if (trophyIcon) {
            trophyIcon.style.animation = 'pulse 0.5s 3';
        }
    }
    
    /**
     * Trigger confetti animation
     */
    triggerConfetti() {
        this.createConfettiParticles(30);
    }
    
    /**
     * Trigger special confetti for achievements
     */
    triggerAchievementConfetti() {
        this.createConfettiParticles(50, true);
    }
    
    /**
     * Create confetti particles
     */
    createConfettiParticles(count, special = false) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * 900,
                y: special ? -50 : Math.random() * 100,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                color: this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)],
                size: Math.random() * 6 + 3,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }
        
        this.animateConfetti(particles);
    }
    
    /**
     * Animate confetti particles
     */
    animateConfetti(particles) {
        const animate = () => {
            this.confettiCtx.clearRect(0, 0, 900, 600);
            
            particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // Gravity
                particle.rotation += particle.rotationSpeed;
                
                this.confettiCtx.save();
                this.confettiCtx.translate(particle.x, particle.y);
                this.confettiCtx.rotate(particle.rotation * Math.PI / 180);
                this.confettiCtx.fillStyle = particle.color;
                this.confettiCtx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
                this.confettiCtx.restore();
                
                // Remove particles that are off screen
                if (particle.y > 650 || particle.x < -50 || particle.x > 950) {
                    particles.splice(index, 1);
                }
            });
            
            if (particles.length > 0) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    /**
     * Toggle trophy case visibility
     */
    toggleTrophyCase() {
        const panel = document.getElementById('trophy-panel');
        if (panel) {
            const isVisible = panel.style.display !== 'none';
            panel.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                this.updateTrophyCase();
            }
        }
    }
    
    /**
     * Update trophy case display
     */
    updateTrophyCase() {
        const grid = document.getElementById('achievement-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        Object.values(this.achievements).forEach(achievement => {
            const isUnlocked = this.data.unlockedAchievements.includes(achievement.id);
            const progress = this.getAchievementProgress(achievement);
            
            const item = document.createElement('div');
            item.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            item.innerHTML = `
                <div class="achievement-icon">${isUnlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-progress">${isUnlocked ? 'Unlocked!' : `${progress}/${achievement.requirement}`}</div>
                </div>
            `;
            
            grid.appendChild(item);
        });
        
        // Update stats
        const totalTasksStat = document.getElementById('total-tasks-stat');
        const unlockedStat = document.getElementById('unlocked-achievements-stat');
        
        if (totalTasksStat) totalTasksStat.textContent = this.data.totalCompletions;
        if (unlockedStat) unlockedStat.textContent = `${this.data.unlockedAchievements.length}/${Object.keys(this.achievements).length}`;
    }
    
    /**
     * Get current progress for an achievement
     */
    getAchievementProgress(achievement) {
        switch (achievement.type) {
            case 'completion':
                return Math.min(this.data.totalCompletions, achievement.requirement);
            case 'daily':
                const today = this.getTodayKey();
                return Math.min(this.data.dailyCompletions[today] || 0, achievement.requirement);
            case 'streak':
                return Math.min(this.data.currentStreak, achievement.requirement);
            default:
                return 0;
        }
    }
    
    /**
     * Update completion counters in status panel
     */
    updateCounters() {
        this.updateStatusCounters();
    }
    
    /**
     * Add completion counters to status panel
     */
    updateStatusCounters() {
        const statusPanel = document.querySelector('.status-panel');
        if (!statusPanel) return;
        
        let countersDiv = statusPanel.querySelector('.completion-counters');
        if (!countersDiv) {
            countersDiv = document.createElement('div');
            countersDiv.className = 'completion-counters';
            statusPanel.appendChild(countersDiv);
        }
        
        const today = this.getTodayKey();
        const thisWeek = this.getWeekKey();
        
        const todayCount = this.data.dailyCompletions[today] || 0;
        const weekCount = this.data.weeklyCompletions[thisWeek] || 0;
        const streak = this.data.currentStreak;
        
        countersDiv.innerHTML = `
            <div class="counter-item">
                <span>Today:</span>
                <span class="counter-value">${todayCount} tasks</span>
            </div>
            <div class="counter-item">
                <span>This week:</span>
                <span class="counter-value">${weekCount} tasks</span>
            </div>
            <div class="counter-item">
                <span>Streak:</span>
                <span class="counter-value streak-value">${streak} days ${streak > 0 ? '🔥' : ''}</span>
            </div>
        `;
    }
    
    /**
     * Utility functions for date handling
     */
    getTodayKey() {
        return new Date().toISOString().split('T')[0];
    }
    
    getYesterdayKey() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }
    
    getWeekKey() {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1);
        return monday.toISOString().split('T')[0];
    }
    
    /**
     * Clean old tracking data
     */
    cleanOldData() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        const cutoffKey = cutoffDate.toISOString().split('T')[0];
        
        // Clean daily data older than 30 days
        Object.keys(this.data.dailyCompletions).forEach(date => {
            if (date < cutoffKey) {
                delete this.data.dailyCompletions[date];
            }
        });
        
        // Clean weekly data older than 12 weeks
        const weekCutoff = new Date();
        weekCutoff.setDate(weekCutoff.getDate() - 84);
        const weekCutoffKey = weekCutoff.toISOString().split('T')[0];
        
        Object.keys(this.data.weeklyCompletions).forEach(week => {
            if (week < weekCutoffKey) {
                delete this.data.weeklyCompletions[week];
            }
        });
        
        // Clean streak data older than 30 days
        Object.keys(this.data.streakData).forEach(date => {
            if (date < cutoffKey) {
                delete this.data.streakData[date];
            }
        });
    }
    
    /**
     * Debug and API methods
     */
    getAchievementsData() {
        return JSON.parse(JSON.stringify(this.data));
    }
    
    resetAchievements() {
        this.data = this.getDefaultData();
        this.saveAchievementsData();
        this.updateTrophyCase();
        this.updateCounters();
        console.log('🦉 Achievements reset');
    }
    
    // For testing - simulate task completion
    simulateCompletion() {
        this.onTaskCompleted({ taskId: 'TEST-' + Date.now(), agentName: 'test', timestamp: Date.now() });
    }
}

// Global achievements manager instance
window.achievements = new AchievementsManager();

// Debug interface
window.delta = {
    getAchievements: () => window.achievements.getAchievementsData(),
    simulate: () => window.achievements.simulateCompletion(),
    reset: () => window.achievements.resetAchievements(),
    confetti: () => window.achievements.triggerConfetti(),
    toggle: () => window.achievements.toggleTrophyCase(),
    achievements: Object.keys(window.achievements.achievements)
};

console.log('🦉 Delta Achievement System loaded! Try delta.simulate() to test achievements!');