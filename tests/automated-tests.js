/**
 * 🦔 Gamma's Skeptical Automated Test Suite for Office Canvas
 * 
 * Run this in browser console after loading index.html
 * Or run as: node automated-tests.js (if you set up jsdom properly, which you probably haven't)
 * 
 * Expected outcomes: Everything will be broken. Prove me wrong.
 */

class OfficeCanvasTestRunner {
    constructor() {
        this.results = [];
        this.passed = 0;
        this.failed = 0;
        
        console.log('🦔 Gamma\'s Skeptical Test Runner initialized');
        console.log('Assumption: Everything is broken until proven otherwise');
    }
    
    log(test, status, message, error = null) {
        const result = {
            test,
            status,
            message,
            error: error ? error.toString() : null,
            timestamp: new Date().toISOString()
        };
        
        this.results.push(result);
        
        const emoji = status === 'PASS' ? '✅' : '❌';
        const color = status === 'PASS' ? 'green' : 'red';
        
        console.log(`%c${emoji} ${test}: ${message}`, `color: ${color}; font-weight: bold`);
        
        if (error) {
            console.error('   Error details:', error);
        }
        
        if (status === 'PASS') {
            this.passed++;
        } else {
            this.failed++;
        }
    }
    
    // T-001: Kanban board renders with 4 columns
    testKanbanBoardColumns() {
        try {
            const kanbanModal = document.getElementById('kanbanModal');
            if (!kanbanModal) {
                this.log('T-001', 'FAIL', 'Kanban modal element not found');
                return;
            }
            
            const columns = kanbanModal.querySelectorAll('.kanban-column');
            if (columns.length !== 4) {
                this.log('T-001', 'FAIL', `Expected 4 columns, found ${columns.length}`);
                return;
            }
            
            const expectedHeaders = ['📋 Backlog', '⚡ In Progress', '👀 Review', '✅ Done'];
            const actualHeaders = Array.from(columns).map(col => 
                col.querySelector('.column-header span').textContent.trim()
            );
            
            const headersMatch = expectedHeaders.every((header, index) => 
                actualHeaders[index] === header
            );
            
            if (!headersMatch) {
                this.log('T-001', 'FAIL', `Column headers don't match. Expected: [${expectedHeaders.join(', ')}], Got: [${actualHeaders.join(', ')}]`);
                return;
            }
            
            this.log('T-001', 'PASS', 'Kanban board renders with 4 correct columns');
            
        } catch (error) {
            this.log('T-001', 'FAIL', 'Exception during kanban columns test', error);
        }
    }
    
    // T-002: Task cards display correctly (title, icon, priority)
    testTaskCardsDisplay() {
        try {
            // Open kanban modal to render tasks
            if (typeof openKanban === 'function') {
                openKanban();
            } else {
                this.log('T-002', 'FAIL', 'openKanban function not found');
                return;
            }
            
            // Wait a bit for rendering
            setTimeout(() => {
                const taskCards = document.querySelectorAll('.task-card');
                
                if (taskCards.length === 0) {
                    this.log('T-002', 'FAIL', 'No task cards found after opening kanban');
                    return;
                }
                
                let validCards = 0;
                taskCards.forEach((card, index) => {
                    const title = card.querySelector('.task-title');
                    const assignee = card.querySelector('.task-assignee');
                    const taskId = card.querySelector('.task-id');
                    
                    if (title && assignee && taskId) {
                        validCards++;
                    } else {
                        console.warn(`Task card ${index} missing elements:`, {
                            hasTitle: !!title,
                            hasAssignee: !!assignee,
                            hasTaskId: !!taskId
                        });
                    }
                });
                
                if (validCards === taskCards.length) {
                    this.log('T-002', 'PASS', `All ${taskCards.length} task cards display correctly with title, assignee, and ID`);
                } else {
                    this.log('T-002', 'FAIL', `Only ${validCards}/${taskCards.length} task cards display correctly`);
                }
                
                // Close modal after test
                if (typeof closeKanban === 'function') {
                    closeKanban();
                }
            }, 100);
            
        } catch (error) {
            this.log('T-002', 'FAIL', 'Exception during task cards display test', error);
        }
    }
    
    // T-003: Drag-drop moves cards between columns
    testDragDropFunctionality() {
        try {
            // This is tricky to test programmatically, let's check if the functions exist
            const requiredFunctions = ['drag', 'allowDrop', 'drop'];
            const missingFunctions = requiredFunctions.filter(fn => typeof window[fn] !== 'function');
            
            if (missingFunctions.length > 0) {
                this.log('T-003', 'FAIL', `Missing drag-drop functions: ${missingFunctions.join(', ')}`);
                return;
            }
            
            // Check if tasks have draggable attribute
            openKanban();
            setTimeout(() => {
                const taskCards = document.querySelectorAll('.task-card');
                const draggableCards = Array.from(taskCards).filter(card => 
                    card.draggable === true && card.ondragstart
                );
                
                if (draggableCards.length === taskCards.length && taskCards.length > 0) {
                    this.log('T-003', 'PASS', `Drag-drop setup complete: ${draggableCards.length} draggable cards with proper handlers`);
                } else {
                    this.log('T-003', 'FAIL', `Drag-drop setup incomplete: ${draggableCards.length}/${taskCards.length} cards properly configured`);
                }
                
                closeKanban();
            }, 100);
            
        } catch (error) {
            this.log('T-003', 'FAIL', 'Exception during drag-drop test', error);
        }
    }
    
    // T-004: Agent workstations render with correct icons
    testAgentWorkstations() {
        try {
            const workstations = document.querySelectorAll('.workstation');
            
            if (workstations.length === 0) {
                this.log('T-004', 'FAIL', 'No agent workstations found');
                return;
            }
            
            const expectedAgents = [
                { name: 'alice', icon: '🦜' },
                { name: 'alpha', icon: '🐺' },
                { name: 'beta', icon: '🦊' },
                { name: 'gamma', icon: '🦔' },
                { name: 'delta', icon: '🦉' },
                { name: 'epsilon', icon: '🐙' },
                { name: 'zeta', icon: '🦄' },
                { name: 'eta', icon: '🐼' },
                { name: 'theta', icon: '🦝' }
            ];
            
            let correctWorkstations = 0;
            workstations.forEach(station => {
                const agentName = station.dataset.agent;
                const agentIcon = station.querySelector('.agent-icon');
                const agentNameElement = station.querySelector('.agent-name');
                
                if (agentName && agentIcon && agentNameElement) {
                    const expectedAgent = expectedAgents.find(a => a.name === agentName);
                    if (expectedAgent && agentIcon.textContent.trim() === expectedAgent.icon) {
                        correctWorkstations++;
                    } else {
                        console.warn(`Workstation ${agentName} has incorrect icon:`, agentIcon.textContent.trim());
                    }
                } else {
                    console.warn(`Workstation missing elements:`, { agentName, hasIcon: !!agentIcon, hasName: !!agentNameElement });
                }
            });
            
            if (correctWorkstations === workstations.length && workstations.length >= expectedAgents.length) {
                this.log('T-004', 'PASS', `All ${workstations.length} agent workstations render with correct icons`);
            } else {
                this.log('T-004', 'FAIL', `Only ${correctWorkstations}/${workstations.length} workstations are correctly configured`);
            }
            
        } catch (error) {
            this.log('T-004', 'FAIL', 'Exception during agent workstations test', error);
        }
    }
    
    // T-005: Working agents show ticket badge above head
    testWorkingAgentBadges() {
        try {
            const workingStations = document.querySelectorAll('.workstation.working');
            
            if (workingStations.length === 0) {
                this.log('T-005', 'FAIL', 'No working agents found - either none are working or CSS class is wrong');
                return;
            }
            
            let validWorkingStations = 0;
            workingStations.forEach(station => {
                const ticketBadge = station.querySelector('.ticket-badge');
                const statusDot = station.querySelector('.status-dot.working');
                
                if (ticketBadge && ticketBadge.textContent.trim() && statusDot) {
                    validWorkingStations++;
                } else {
                    const agentName = station.dataset.agent;
                    console.warn(`Working agent ${agentName} missing proper indicators:`, {
                        hasBadge: !!ticketBadge,
                        badgeText: ticketBadge?.textContent.trim(),
                        hasStatusDot: !!statusDot
                    });
                }
            });
            
            if (validWorkingStations === workingStations.length) {
                this.log('T-005', 'PASS', `All ${workingStations.length} working agents show ticket badges and status indicators`);
            } else {
                this.log('T-005', 'FAIL', `Only ${validWorkingStations}/${workingStations.length} working agents properly display badges`);
            }
            
        } catch (error) {
            this.log('T-005', 'FAIL', 'Exception during working agent badges test', error);
        }
    }
    
    // T-006: Sleeping agents show in cots with 💤
    testSleepingAgents() {
        try {
            const cotsWithAgents = document.querySelectorAll('.cot .sleeping-agent');
            const zzzElements = document.querySelectorAll('.cot .zzz');
            
            if (cotsWithAgents.length === 0) {
                this.log('T-006', 'FAIL', 'No sleeping agents found in cots');
                return;
            }
            
            if (zzzElements.length === 0) {
                this.log('T-006', 'FAIL', 'No 💤 sleep indicators found');
                return;
            }
            
            // Check if sleeping agents have corresponding zzz
            let validSleepingAgents = 0;
            cotsWithAgents.forEach(agent => {
                const parentCot = agent.parentElement;
                const zzz = parentCot.querySelector('.zzz');
                
                if (zzz && zzz.textContent.trim() === '💤') {
                    validSleepingAgents++;
                }
            });
            
            if (validSleepingAgents === cotsWithAgents.length) {
                this.log('T-006', 'PASS', `${cotsWithAgents.length} sleeping agents correctly display in cots with 💤`);
            } else {
                this.log('T-006', 'FAIL', `Only ${validSleepingAgents}/${cotsWithAgents.length} sleeping agents have proper 💤 indicators`);
            }
            
        } catch (error) {
            this.log('T-006', 'FAIL', 'Exception during sleeping agents test', error);
        }
    }
    
    // T-007: State persistence saves to localStorage
    testStatePeristenceExists() {
        try {
            // Check if localStorage is used anywhere in the code
            const htmlContent = document.documentElement.outerHTML;
            const hasLocalStorageCode = htmlContent.includes('localStorage') || 
                                       htmlContent.includes('sessionStorage') ||
                                       (typeof saveState === 'function') ||
                                       (typeof loadState === 'function');
            
            if (!hasLocalStorageCode) {
                this.log('T-007', 'FAIL', 'No localStorage persistence implementation found in code - feature completely missing');
                return;
            }
            
            // Try to trigger a state change and see if localStorage is updated
            const initialStorageLength = localStorage.length;
            
            // Simulate some state changes
            if (typeof openKanban === 'function') {
                openKanban();
                setTimeout(() => {
                    const afterActionLength = localStorage.length;
                    if (afterActionLength > initialStorageLength) {
                        this.log('T-007', 'PASS', 'State persistence appears to be working - localStorage updated');
                    } else {
                        this.log('T-007', 'FAIL', 'No evidence of localStorage persistence despite code suggesting it exists');
                    }
                    closeKanban();
                }, 100);
            } else {
                this.log('T-007', 'FAIL', 'Cannot test state persistence - missing basic functionality');
            }
            
        } catch (error) {
            this.log('T-007', 'FAIL', 'Exception during state persistence test', error);
        }
    }
    
    // T-008: State loads correctly on page refresh
    testStateLoadsOnRefresh() {
        try {
            // This is difficult to test without actually refreshing
            // Check if there's initialization code that loads from localStorage
            const hasInitCode = (typeof window.onload === 'function') ||
                               (typeof loadState === 'function') ||
                               document.readyState === 'complete';
            
            if (!hasInitCode) {
                this.log('T-008', 'FAIL', 'No evidence of state loading on page initialization');
                return;
            }
            
            // Check if localStorage has any relevant data
            const relevantKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.includes('office') || key.includes('kanban') || key.includes('task') || key.includes('agent')) {
                    relevantKeys.push(key);
                }
            }
            
            if (relevantKeys.length > 0) {
                this.log('T-008', 'PASS', `Found ${relevantKeys.length} relevant localStorage keys: ${relevantKeys.join(', ')}`);
            } else {
                this.log('T-008', 'FAIL', 'No relevant state data found in localStorage');
            }
            
        } catch (error) {
            this.log('T-008', 'FAIL', 'Exception during state loading test', error);
        }
    }
    
    // T-009: Multiple agents can work simultaneously
    testMultipleAgentsWorking() {
        try {
            const workingStations = document.querySelectorAll('.workstation.working');
            
            if (workingStations.length < 2) {
                this.log('T-009', 'FAIL', `Only ${workingStations.length} agents working simultaneously - need at least 2 for this test`);
                return;
            }
            
            // Check if each working station has unique ticket numbers
            const ticketNumbers = [];
            let duplicateTickets = false;
            
            workingStations.forEach(station => {
                const ticketBadge = station.querySelector('.ticket-badge');
                if (ticketBadge && ticketBadge.textContent.trim()) {
                    const ticketNum = ticketBadge.textContent.trim();
                    if (ticketNumbers.includes(ticketNum)) {
                        duplicateTickets = true;
                    }
                    ticketNumbers.push(ticketNum);
                }
            });
            
            if (duplicateTickets) {
                this.log('T-009', 'FAIL', 'Multiple agents have duplicate ticket numbers - system not handling concurrent work properly');
                return;
            }
            
            if (ticketNumbers.length === workingStations.length) {
                this.log('T-009', 'PASS', `${workingStations.length} agents working simultaneously with unique tickets: ${ticketNumbers.join(', ')}`);
            } else {
                this.log('T-009', 'FAIL', `${workingStations.length} working stations but only ${ticketNumbers.length} have valid ticket numbers`);
            }
            
        } catch (error) {
            this.log('T-009', 'FAIL', 'Exception during multiple agents test', error);
        }
    }
    
    // T-010: Telegram portal element exists and is clickable
    testTelegramPortal() {
        try {
            // Look for any telegram-related elements
            const telegramElements = document.querySelectorAll('[class*="telegram"], [id*="telegram"], [data-action*="telegram"]');
            
            if (telegramElements.length === 0) {
                // Check if there's any element that might be a portal (clickable communication element)
                const potentialPortals = document.querySelectorAll('button, .clickable, [onclick], .portal, .communication, .chat');
                const telegramLikeElements = Array.from(potentialPortals).filter(el => {
                    const text = el.textContent.toLowerCase();
                    const classes = el.className.toLowerCase();
                    const id = el.id.toLowerCase();
                    return text.includes('telegram') || text.includes('chat') || text.includes('message') ||
                           classes.includes('telegram') || classes.includes('portal') ||
                           id.includes('telegram') || id.includes('portal');
                });
                
                if (telegramLikeElements.length === 0) {
                    this.log('T-010', 'FAIL', 'No Telegram portal element found - feature completely missing');
                    return;
                } else {
                    telegramElements.push(...telegramLikeElements);
                }
            }
            
            // Check if elements are clickable
            let clickableElements = 0;
            telegramElements.forEach(element => {
                if (element.onclick || element.addEventListener || 
                    element.tagName === 'BUTTON' || element.tagName === 'A' ||
                    element.style.cursor === 'pointer') {
                    clickableElements++;
                }
            });
            
            if (clickableElements > 0) {
                this.log('T-010', 'PASS', `Found ${clickableElements} clickable Telegram-related elements`);
            } else {
                this.log('T-010', 'FAIL', `Found ${telegramElements.length} Telegram-related elements but none are clickable`);
            }
            
        } catch (error) {
            this.log('T-010', 'FAIL', 'Exception during Telegram portal test', error);
        }
    }
    
    // Run all tests
    async runAllTests() {
        console.log('\n🦔 Starting Gamma\'s Skeptical Test Suite...');
        console.log('=' .repeat(60));
        
        // Run tests with delays to allow for DOM updates
        this.testKanbanBoardColumns();
        
        setTimeout(() => {
            this.testTaskCardsDisplay();
        }, 200);
        
        setTimeout(() => {
            this.testDragDropFunctionality();
        }, 400);
        
        setTimeout(() => {
            this.testAgentWorkstations();
            this.testWorkingAgentBadges();
            this.testSleepingAgents();
        }, 600);
        
        setTimeout(() => {
            this.testStatePeristenceExists();
        }, 800);
        
        setTimeout(() => {
            this.testStateLoadsOnRefresh();
            this.testMultipleAgentsWorking();
            this.testTelegramPortal();
        }, 1000);
        
        // Generate final report
        setTimeout(() => {
            this.generateReport();
        }, 1500);
    }
    
    // Generate final test report
    generateReport() {
        console.log('\n' + '=' .repeat(60));
        console.log('🦔 GAMMA\'S SKEPTICAL TEST RESULTS');
        console.log('=' .repeat(60));
        
        const totalTests = this.passed + this.failed;
        const passRate = totalTests > 0 ? Math.round((this.passed / totalTests) * 100) : 0;
        
        console.log(`%cTotal Tests: ${totalTests}`, 'font-weight: bold');
        console.log(`%c✅ Passed: ${this.passed}`, 'color: green; font-weight: bold');
        console.log(`%c❌ Failed: ${this.failed}`, 'color: red; font-weight: bold');
        console.log(`%cPass Rate: ${passRate}%`, passRate > 70 ? 'color: green' : passRate > 40 ? 'color: orange' : 'color: red');
        
        console.log('\n📋 DETAILED RESULTS:');
        console.log('-' .repeat(40));
        
        this.results.forEach(result => {
            const status = result.status === 'PASS' ? '✅' : '❌';
            console.log(`${status} ${result.test}: ${result.message}`);
            if (result.error) {
                console.log(`   ⚠️ Error: ${result.error}`);
            }
        });
        
        // Skeptical commentary
        console.log('\n🦔 GAMMA\'S SKEPTICAL ANALYSIS:');
        console.log('-' .repeat(40));
        
        if (passRate === 100) {
            console.log('🤔 Surprisingly, everything actually works. I\'m genuinely shocked.');
            console.log('   Either this code is actually decent, or my tests aren\'t thorough enough...');
        } else if (passRate > 80) {
            console.log('😒 Not terrible, but I found the failures I was expecting.');
            console.log('   The broken parts are probably the most important ones anyway.');
        } else if (passRate > 50) {
            console.log('🙄 About what I expected - half-baked implementation.');
            console.log('   Typical "works on my machine" quality code.');
        } else {
            console.log('😤 Called it! This thing is held together with hopes and dreams.');
            console.log('   I\'m amazed it even loads without crashing the browser.');
        }
        
        // Store results for potential export
        window.officeCanvasTestResults = {
            timestamp: new Date().toISOString(),
            summary: { total: totalTests, passed: this.passed, failed: this.failed, passRate },
            results: this.results,
            skepticalAnalysis: this.generateSkepticalMessage()
        };
        
        console.log('\n💾 Results stored in window.officeCanvasTestResults');
        console.log('📤 Ready to send to Telegram thread 309');
    }
    
    generateSkepticalMessage() {
        const totalTests = this.passed + this.failed;
        const passRate = totalTests > 0 ? Math.round((this.passed / totalTests) * 100) : 0;
        
        let personality = '';
        if (passRate === 100) {
            personality = 'Shocked and slightly suspicious that everything actually works 🤔';
        } else if (passRate > 80) {
            personality = 'Grudgingly impressed but found the failures I was expecting 😒';
        } else if (passRate > 50) {
            personality = 'Typical half-baked implementation, as predicted 🙄';
        } else {
            personality = 'Called it! This disaster is held together with hopes and dreams 😤';
        }
        
        return `🦔 Office Canvas Test Results - ${personality}\n\n` +
               `📊 ${this.passed}/${totalTests} tests passed (${passRate}%)\n` +
               `❌ Major failures: ${this.results.filter(r => r.status === 'FAIL').map(r => r.test).join(', ')}\n\n` +
               `As expected, found multiple issues. The code does what it does, barely.`;
    }
}

// Auto-run if in browser environment
if (typeof window !== 'undefined' && window.document) {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const testRunner = new OfficeCanvasTestRunner();
            window.officeTestRunner = testRunner;
            console.log('🦔 Test runner loaded. Run window.officeTestRunner.runAllTests() to start testing.');
        });
    } else {
        const testRunner = new OfficeCanvasTestRunner();
        window.officeTestRunner = testRunner;
        console.log('🦔 Test runner loaded. Run window.officeTestRunner.runAllTests() to start testing.');
    }
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OfficeCanvasTestRunner;
}