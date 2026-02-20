/**
 * OFF-RT-5: Walk Animation Engine (curved, cancelable)
 * Real-time agent movement with smooth curved paths
 */

class WalkAnimationEngine {
    constructor() {
        this.activeAnimations = new Map();
        this.animationId = 0;
        this.defaultDuration = 2000; // 2 seconds
        this.curveIntensity = 0.3; // How curved the path should be
        this.frameRate = 60; // Target FPS
        this.frameInterval = 1000 / this.frameRate;
    }

    /**
     * Calculate a curved path between two points using quadratic Bézier curve
     */
    calculateCurvedPath(start, end, intensity = this.curveIntensity) {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        
        // Add curvature perpendicular to the direct path
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize perpendicular vector
        const perpX = -dy / length;
        const perpY = dx / length;
        
        // Control point for the curve (offset from midpoint)
        const curvature = length * intensity;
        const controlX = midX + perpX * curvature;
        const controlY = midY + perpY * curvature;
        
        return {
            start,
            control: { x: controlX, y: controlY },
            end
        };
    }

    /**
     * Calculate position along quadratic Bézier curve
     */
    calculateBezierPosition(path, t) {
        const { start, control, end } = path;
        
        // Quadratic Bézier formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
        const oneMinusT = 1 - t;
        const oneMinusTSquared = oneMinusT * oneMinusT;
        const tSquared = t * t;
        const twoOneMinusTt = 2 * oneMinusT * t;
        
        return {
            x: oneMinusTSquared * start.x + twoOneMinusTt * control.x + tSquared * end.x,
            y: oneMinusTSquared * start.y + twoOneMinusTt * control.y + tSquared * end.y
        };
    }

    /**
     * Start a walk animation for an agent
     */
    startWalkAnimation(agentId, fromLocation, toLocation, options = {}) {
        const animationId = ++this.animationId;
        const duration = options.duration || this.defaultDuration;
        const onComplete = options.onComplete || (() => {});
        const onUpdate = options.onUpdate || (() => {});
        const onCancel = options.onCancel || (() => {});
        
        // Cancel existing animation for this agent
        this.cancelAnimation(agentId);
        
        // Calculate curved path
        const path = this.calculateCurvedPath(fromLocation, toLocation, options.curveIntensity);
        
        const animation = {
            id: animationId,
            agentId,
            path,
            startTime: performance.now(),
            duration,
            isActive: true,
            callbacks: { onComplete, onUpdate, onCancel },
            lastFrameTime: 0
        };
        
        this.activeAnimations.set(agentId, animation);
        
        // Start animation loop
        this.runAnimation(animation);
        
        console.log(`🚶 Started walk animation for ${agentId}: ${fromLocation.x},${fromLocation.y} → ${toLocation.x},${toLocation.y}`);
        
        return animationId;
    }

    /**
     * Run the animation loop for a specific animation
     */
    runAnimation(animation) {
        if (!animation.isActive) return;
        
        const now = performance.now();
        const elapsed = now - animation.startTime;
        const progress = Math.min(elapsed / animation.duration, 1);
        
        // Easing function (ease-out cubic)
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);
        
        // Calculate current position
        const position = this.calculateBezierPosition(animation.path, easedProgress);
        
        // Update agent position
        const agentElement = document.querySelector(`[data-agent="${animation.agentId}"]`);
        if (agentElement) {
            agentElement.style.left = `${position.x}px`;
            agentElement.style.top = `${position.y}px`;
            
            // Add walking class for visual effects
            agentElement.classList.add('walking');
            
            // Calculate direction for sprite orientation
            const direction = this.calculateDirection(animation.path, easedProgress);
            agentElement.setAttribute('data-direction', direction);
        }
        
        // Call update callback
        animation.callbacks.onUpdate({
            agentId: animation.agentId,
            position,
            progress: easedProgress,
            direction: this.calculateDirection(animation.path, easedProgress)
        });
        
        // Check if animation is complete
        if (progress >= 1) {
            this.completeAnimation(animation);
        } else if (animation.isActive) {
            // Continue animation
            requestAnimationFrame(() => this.runAnimation(animation));
        }
    }

    /**
     * Calculate movement direction for sprite orientation
     */
    calculateDirection(path, t) {
        // Sample two points close to current position to get direction
        const t1 = Math.max(0, t - 0.01);
        const t2 = Math.min(1, t + 0.01);
        
        const pos1 = this.calculateBezierPosition(path, t1);
        const pos2 = this.calculateBezierPosition(path, t2);
        
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        
        // Convert to cardinal direction
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        if (angle >= -45 && angle < 45) return 'right';
        if (angle >= 45 && angle < 135) return 'down';
        if (angle >= 135 || angle < -135) return 'left';
        return 'up';
    }

    /**
     * Complete an animation
     */
    completeAnimation(animation) {
        if (!animation.isActive) return;
        
        animation.isActive = false;
        this.activeAnimations.delete(animation.agentId);
        
        // Remove walking class
        const agentElement = document.querySelector(`[data-agent="${animation.agentId}"]`);
        if (agentElement) {
            agentElement.classList.remove('walking');
            agentElement.removeAttribute('data-direction');
            
            // Ensure final position is exact
            agentElement.style.left = `${animation.path.end.x}px`;
            agentElement.style.top = `${animation.path.end.y}px`;
        }
        
        // Call completion callback
        animation.callbacks.onComplete({
            agentId: animation.agentId,
            finalPosition: animation.path.end
        });
        
        console.log(`✅ Completed walk animation for ${animation.agentId}`);
    }

    /**
     * Cancel an animation for a specific agent
     */
    cancelAnimation(agentId) {
        const animation = this.activeAnimations.get(agentId);
        if (animation && animation.isActive) {
            animation.isActive = false;
            this.activeAnimations.delete(agentId);
            
            // Remove walking class immediately
            const agentElement = document.querySelector(`[data-agent="${agentId}"]`);
            if (agentElement) {
                agentElement.classList.remove('walking');
                agentElement.removeAttribute('data-direction');
            }
            
            // Call cancel callback
            animation.callbacks.onCancel({
                agentId: agentId,
                canceledAt: performance.now() - animation.startTime
            });
            
            console.log(`❌ Canceled walk animation for ${agentId}`);
            return true;
        }
        return false;
    }

    /**
     * Cancel all active animations
     */
    cancelAllAnimations() {
        const canceledAgents = Array.from(this.activeAnimations.keys());
        canceledAgents.forEach(agentId => this.cancelAnimation(agentId));
        console.log(`❌ Canceled all animations (${canceledAgents.length} agents)`);
        return canceledAgents;
    }

    /**
     * Check if an agent is currently animating
     */
    isAnimating(agentId) {
        return this.activeAnimations.has(agentId);
    }

    /**
     * Get all currently animating agents
     */
    getActiveAnimations() {
        return Array.from(this.activeAnimations.keys());
    }

    /**
     * Get animation progress for a specific agent
     */
    getAnimationProgress(agentId) {
        const animation = this.activeAnimations.get(agentId);
        if (!animation || !animation.isActive) return null;
        
        const elapsed = performance.now() - animation.startTime;
        const progress = Math.min(elapsed / animation.duration, 1);
        
        return {
            progress,
            startTime: animation.startTime,
            duration: animation.duration,
            elapsed
        };
    }

    /**
     * Update animation settings
     */
    updateSettings(settings) {
        if (settings.defaultDuration !== undefined) {
            this.defaultDuration = settings.defaultDuration;
        }
        if (settings.curveIntensity !== undefined) {
            this.curveIntensity = settings.curveIntensity;
        }
        if (settings.frameRate !== undefined) {
            this.frameRate = settings.frameRate;
            this.frameInterval = 1000 / this.frameRate;
        }
        
        console.log('🎛️ Updated walk animation settings:', settings);
    }
}

// Export for use in office canvas
window.WalkAnimationEngine = WalkAnimationEngine;