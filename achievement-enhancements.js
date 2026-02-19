/**
 * 🦉 DELTA'S ACHIEVEMENT ENHANCEMENTS
 * 
 * Additional integrations and visual improvements for the achievement system:
 * - Enhanced kanban integration
 * - Better notification system
 * - Achievement sound effects (optional)
 * - Improved visual feedback
 */

(function() {
    'use strict';
    
    // Wait for the achievements system to load
    document.addEventListener('DOMContentLoaded', function() {
        if (!window.achievements) {
            setTimeout(initEnhancements, 500);
            return;
        }
        initEnhancements();
    });
    
    function initEnhancements() {
        console.log('🦉 Loading achievement enhancements...');
        
        // Enhance the kanban board integration
        enhanceKanbanIntegration();
        
        // Add achievement toast notifications
        addToastNotifications();
        
        // Enhance trophy case animations
        enhanceTrophyCaseAnimations();
        
        // Add celebration sounds (optional)
        setupSoundEffects();
        
        console.log('🦉 Achievement enhancements loaded!');
    }
    
    /**
     * Enhance integration with the kanban board
     */
    function enhanceKanbanIntegration() {
        // Monitor kanban task movements
        const originalRenderTasks = window.renderTasks;
        if (typeof originalRenderTasks === 'function') {
            window.renderTasks = function(...args) {
                const result = originalRenderTasks.apply(this, args);
                
                // Check if tasks moved to done column
                const doneColumn = document.getElementById('done');
                if (doneColumn) {
                    const doneTasks = doneColumn.querySelectorAll('.task-card');
                    doneTasks.forEach(task => {
                        if (!task.dataset.celebrationShown) {
                            // This is a newly completed task
                            task.dataset.celebrationShown = 'true';
                            
                            // Trigger mini confetti around the task
                            triggerTaskConfetti(task);
                        }
                    });
                }
                
                return result;
            };
        }
        
        // Add completion counter to kanban header
        addKanbanCompletionCounter();
    }
    
    /**
     * Add completion counter to kanban board header
     */
    function addKanbanCompletionCounter() {
        const kanbanTitle = document.querySelector('.kanban-title');
        if (kanbanTitle && window.achievements) {
            const data = window.achievements.getAchievementsData();
            const counter = document.createElement('span');
            counter.id = 'kanban-completion-counter';
            counter.style.cssText = `
                margin-left: 16px;
                font-size: 14px;
                color: #4fc3f7;
                font-weight: normal;
            `;
            counter.textContent = `(${data.totalCompletions} tasks completed)`;
            kanbanTitle.appendChild(counter);
            
            // Update counter when achievements change
            const originalSave = window.achievements.saveAchievementsData;
            window.achievements.saveAchievementsData = function() {
                originalSave.apply(this, arguments);
                const updatedData = this.getAchievementsData();
                const counter = document.getElementById('kanban-completion-counter');
                if (counter) {
                    counter.textContent = `(${updatedData.totalCompletions} tasks completed)`;
                }
            };
        }
    }
    
    /**
     * Add toast notification system for achievements
     */
    function addToastNotifications() {
        // Create toast container
        const toastContainer = document.createElement('div');
        toastContainer.id = 'achievement-toasts';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2000;
            pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
        
        // Override the achievement celebration method
        if (window.achievements && window.achievements.celebrateAchievements) {
            const originalCelebrate = window.achievements.celebrateAchievements;
            window.achievements.celebrateAchievements = function(achievements) {
                originalCelebrate.apply(this, arguments);
                
                // Show toast for each achievement
                achievements.forEach((achievement, index) => {
                    setTimeout(() => {
                        showAchievementToast(achievement);
                    }, index * 300);
                });
            };
        }
    }
    
    /**
     * Show achievement toast notification
     */
    function showAchievementToast(achievement) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
            color: #2c3e50;
            padding: 16px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            font-weight: bold;
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
            min-width: 280px;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 24px;">${achievement.icon}</div>
                <div>
                    <div style="font-size: 14px; margin-bottom: 2px;">Achievement Unlocked!</div>
                    <div style="font-size: 16px; font-weight: bold;">${achievement.title}</div>
                    <div style="font-size: 12px; opacity: 0.8;">${achievement.description}</div>
                </div>
            </div>
        `;
        
        const container = document.getElementById('achievement-toasts');
        container.appendChild(toast);
        
        // Slide in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 50);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        });
    }
    
    /**
     * Trigger confetti around a specific task card
     */
    function triggerTaskConfetti(taskElement) {
        if (!window.achievements) return;
        
        const rect = taskElement.getBoundingClientRect();
        const particles = [];
        
        for (let i = 0; i < 15; i++) {
            particles.push({
                x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 100,
                y: rect.top + rect.height / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: Math.random() * -4 - 2,
                color: window.achievements.confettiColors[Math.floor(Math.random() * window.achievements.confettiColors.length)],
                size: Math.random() * 4 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 15,
                life: 100
            });
        }
        
        animateTaskConfetti(particles);
    }
    
    /**
     * Animate task-specific confetti
     */
    function animateTaskConfetti(particles) {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        function animate() {
            particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.2; // Gravity
                particle.rotation += particle.rotationSpeed;
                particle.life--;
                
                ctx.save();
                ctx.translate(particle.x - rect.left, particle.y - rect.top);
                ctx.rotate(particle.rotation * Math.PI / 180);
                ctx.globalAlpha = particle.life / 100;
                ctx.fillStyle = particle.color;
                ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
                ctx.restore();
                
                // Remove dead particles
                if (particle.life <= 0 || particle.y > window.innerHeight + 50) {
                    particles.splice(index, 1);
                }
            });
            
            if (particles.length > 0) {
                requestAnimationFrame(animate);
            }
        }
        
        animate();
    }
    
    /**
     * Enhance trophy case animations
     */
    function enhanceTrophyCaseAnimations() {
        // Add hover effects to achievement items
        const style = document.createElement('style');
        style.textContent = `
            .achievement-item.unlocked:hover {
                background: rgba(76, 175, 80, 0.3) !important;
                transform: translateY(-1px);
                transition: all 0.2s ease;
            }
            
            .achievement-item.locked:hover {
                background: rgba(255, 255, 255, 0.1) !important;
            }
            
            .trophy-icon.new-achievement {
                animation: trophyBounce 1s ease-in-out 3;
            }
            
            @keyframes trophyBounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            
            .achievement-item.newly-unlocked {
                animation: achievementGlow 2s ease-in-out;
                border-color: #ffd700 !important;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            }
            
            @keyframes achievementGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
                50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.8); }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Setup optional sound effects
     */
    function setupSoundEffects() {
        // Create audio context for sound effects (optional)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Simple achievement sound using Web Audio API
            window.playAchievementSound = function() {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            };
            
            // Hook into achievement unlocks
            if (window.achievements) {
                const originalCelebrate = window.achievements.celebrateAchievements;
                window.achievements.celebrateAchievements = function(achievements) {
                    originalCelebrate.apply(this, arguments);
                    if (achievements.length > 0) {
                        window.playAchievementSound?.();
                    }
                };
            }
        } catch (error) {
            console.log('🦉 Audio context not available, skipping sound effects');
        }
    }
    
    /**
     * Add progress indicators for achievements
     */
    function addProgressIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .achievement-progress-bar {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                margin-top: 4px;
                overflow: hidden;
            }
            
            .achievement-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4fc3f7 0%, #29b6f6 100%);
                border-radius: 2px;
                transition: width 0.3s ease;
            }
            
            .achievement-progress-fill.complete {
                background: linear-gradient(90deg, #4caf50 0%, #66bb6a 100%);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize progress indicators
    addProgressIndicators();
})();