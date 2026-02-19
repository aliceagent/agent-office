# UAT Test Scripts - Agent Office Canvas

**Site Under Test:** https://aliceagent.github.io/agent-office/  
**Test Date:** {{ DATE }}  
**Tester:** {{ TESTER_NAME }}  

## Test Environment Requirements
- **Desktop:** 1920x1080, 1366x768
- **Mobile:** 375x667 (iPhone SE)
- **Browsers:** Chrome, Firefox, Safari
- **Network:** Stable internet connection

---

## UAT-001: Full Task Lifecycle

### Objective
Verify the complete agent task workflow from task creation to completion.

### Pre-conditions
- Site loads successfully
- All agents are in sleep state (on cots)
- Kanban board is visible

### Test Steps

#### Step 1: Task Appears on Board
1. **Action:** Observe the Kanban board "To Do" column
2. **Expected:** Tasks should be visible in the leftmost column
3. **Verify:** 
   - [ ] Tasks have clear titles
   - [ ] Tasks are visually distinct cards
   - [ ] Tasks remain stationary when no agent is assigned
4. **Pass/Fail:** ___

#### Step 2: Agent Wakes Up
1. **Action:** Wait and observe agent behavior (should happen automatically)
2. **Expected:** One agent should wake up and stand on their cot
3. **Verify:**
   - [ ] Agent animation shows movement from lying to standing
   - [ ] Agent is clearly distinguishable from sleeping agents
   - [ ] No other agents wake simultaneously
4. **Pass/Fail:** ___

#### Step 3: Agent Walks to Board
1. **Action:** Continue observing the awakened agent
2. **Expected:** Agent should move toward the Kanban board
3. **Verify:**
   - [ ] Agent follows a logical path to the board
   - [ ] Movement is smooth and visually clear
   - [ ] Agent stops at appropriate distance from board
4. **Pass/Fail:** ___

#### Step 4: Agent Claims Task
1. **Action:** Watch as agent interacts with board
2. **Expected:** A task card should move from "To Do" to "In Progress"
3. **Verify:**
   - [ ] Card movement is animated and clear
   - [ ] Task appears in correct "In Progress" column
   - [ ] No duplicate cards appear
   - [ ] Agent is now "assigned" to the task
4. **Pass/Fail:** ___

#### Step 5: Agent Works at Desk
1. **Action:** Observe agent movement to desk area
2. **Expected:** Agent moves to desk and begins working
3. **Verify:**
   - [ ] Agent walks to desk area (bottom of canvas)
   - [ ] Agent stops at a desk position
   - [ ] Working badge/indicator appears above agent
   - [ ] Badge clearly shows task being worked on
4. **Pass/Fail:** ___

#### Step 6: Task Completes
1. **Action:** Wait for task completion (varies by task type)
2. **Expected:** Task card should move to "Done" column
3. **Verify:**
   - [ ] Card moves smoothly to "Done" column
   - [ ] Working badge disappears from agent
   - [ ] Agent is no longer in "working" state
4. **Pass/Fail:** ___

#### Step 7: Agent Sends Telegram Message
1. **Action:** Observe Telegram portal area
2. **Expected:** Visual indication of message being sent
3. **Verify:**
   - [ ] Telegram portal shows activity/animation
   - [ ] Clear visual feedback that message was sent
   - [ ] No error states or failed send indicators
4. **Pass/Fail:** ___

#### Step 8: Agent Returns to Sleep
1. **Action:** Watch agent after task completion
2. **Expected:** Agent returns to cot and goes to sleep
3. **Verify:**
   - [ ] Agent walks back to original cot position
   - [ ] Agent lies down (sleep animation)
   - [ ] Agent returns to initial sleep visual state
   - [ ] System is ready for next task cycle
4. **Pass/Fail:** ___

### Overall Test Result: **PASS / FAIL**
**Notes:** ____________________

---

## UAT-002: Visual Inspection Checklist

### Objective
Verify the office layout matches design specifications and all visual elements are correct.

### Layout Verification
- [ ] **Pool table is centered** in the canvas
- [ ] **Desks are positioned at bottom** of the canvas
- [ ] **Cots are positioned on the right side** of the canvas
- [ ] **Kanban board is visible and positioned correctly**
- [ ] **Telegram portal is clearly visible**

### Agent Icons
- [ ] **All 9 agent icons are visible**
- [ ] **Agent icons are distinct and recognizable**
- [ ] **Sleeping agents are clearly in "sleep" pose**
- [ ] **Agent scale is appropriate to other elements**
- [ ] **Agent colors/styling are consistent**

### Kanban Board
- [ ] **Exactly 4 columns are present**
- [ ] **Column headers are clear and readable**
- [ ] **Columns are properly labeled** (To Do, In Progress, Review, Done)
- [ ] **Column widths are appropriate**
- [ ] **Board is positioned where users can easily see it**

### Color Palette
- [ ] **Floor appears as wood texture/color**
- [ ] **Walls appear as cream/off-white color**
- [ ] **Colors are consistent throughout**
- [ ] **Contrast is sufficient for readability**
- [ ] **No jarring or incorrect colors**

### Ticket Badges
- [ ] **Badges float clearly above working agents**
- [ ] **Badge text is readable**
- [ ] **Badges don't overlap other UI elements**
- [ ] **Badge styling matches design system**
- [ ] **Badges appear only when agent is working**

### Pass/Fail Assessment
**Layout:** ___  
**Agents:** ___  
**Board:** ___  
**Colors:** ___  
**Badges:** ___  
**Overall:** **PASS / FAIL**

---

## UAT-003: Responsive Testing

### Objective
Test the application across different screen sizes and document any issues.

### Desktop: 1920x1080 (Full HD)
**Test Steps:**
1. Load site at 1920x1080 resolution
2. Verify all elements are visible without scrolling
3. Check that interactions work properly
4. Verify text readability

**Results:**
- [ ] All elements fit on screen
- [ ] No horizontal scrolling required
- [ ] Agent movements are smooth
- [ ] Kanban board is fully visible
- [ ] Text is readable

**Issues Found:** ____________________  
**Pass/Fail:** ___

### Desktop: 1366x768 (Standard Laptop)
**Test Steps:**
1. Resize browser to 1366x768
2. Check if layout adapts appropriately
3. Verify no critical elements are cut off
4. Test all interactions

**Results:**
- [ ] Layout adapts to smaller width
- [ ] All critical elements remain visible
- [ ] Interactions continue to work
- [ ] No overlapping elements

**Issues Found:** ____________________  
**Pass/Fail:** ___

### Mobile: 375x667 (iPhone SE)
**Test Steps:**
1. Test on mobile device or simulate mobile viewport
2. Check if site is usable on small screen
3. Verify touch interactions work
4. Check for responsive design elements

**Results:**
- [ ] Site loads on mobile
- [ ] Elements are appropriately sized
- [ ] Touch interactions work
- [ ] No horizontal overflow
- [ ] Content is readable

**Issues Found:** ____________________  
**Pass/Fail:** ___

### Responsive Summary
**What breaks at smaller sizes:**
- ____________________
- ____________________

**Recommendations:**
- ____________________
- ____________________

---

## UAT-004: Interaction Testing

### Objective
Test user interactions and verify appropriate responses or feedback.

### Agent Interactions
**Test:** Click on sleeping agents
- **Action:** Click on each sleeping agent
- **Expected:** [Document expected behavior]
- **Actual:** ____________________
- **Pass/Fail:** ___

**Test:** Click on working agents  
- **Action:** Click on agents currently working
- **Expected:** [Document expected behavior]
- **Actual:** ____________________
- **Pass/Fail:** ___

**Test:** Click on moving agents
- **Action:** Click on agents while they're walking
- **Expected:** [Document expected behavior]
- **Actual:** ____________________
- **Pass/Fail:** ___

### Task Interactions
**Test:** Click on tasks in "To Do"
- **Action:** Click on task cards in To Do column
- **Expected:** [Document expected behavior]
- **Actual:** ____________________
- **Pass/Fail:** ___

**Test:** Click on tasks "In Progress"
- **Action:** Click on task cards in In Progress column
- **Expected:** [Document expected behavior]
- **Actual:** ____________________
- **Pass/Fail:** ___

**Test:** Click on completed tasks
- **Action:** Click on task cards in Done column
- **Expected:** [Document expected behavior]
- **Actual:** ____________________
- **Pass/Fail:** ___

### Telegram Portal Interactions
**Test:** Click on Telegram portal
- **Action:** Click on the Telegram portal area
- **Expected:** [Document expected behavior - does it open a link? show details?]
- **Actual:** ____________________
- **Pass/Fail:** ___

### UI Element Interactions
**Test:** Click on Kanban board headers
- **Action:** Click on column headers
- **Expected:** [Document expected behavior]
- **Actual:** ____________________
- **Pass/Fail:** ___

**Test:** Click on empty spaces
- **Action:** Click on empty areas of the canvas
- **Expected:** [Document expected behavior - should do nothing]
- **Actual:** ____________________
- **Pass/Fail:** ___

### Interaction Summary
**User-friendly interactions:** ____________________  
**Confusing interactions:** ____________________  
**Missing feedback:** ____________________  

### Critical User Experience Questions
As a user testing this:

1. **"What am I looking at?"** - Is it immediately clear this is an office with agents working on tasks?
2. **"What can I do here?"** - Are interactive elements obvious?
3. **"What's happening?"** - Is the agent workflow clear and engaging?
4. **"Is this working?"** - Are there clear signs the system is functioning?

**Answers:**
1. ____________________
2. ____________________
3. ____________________
4. ____________________

---

## Test Execution Summary

**Test Date:** ____________________  
**Tester:** ____________________  
**Browser/Device:** ____________________  
**Overall Status:** **PASS / FAIL**

### Key Findings
**What works well:**
- ____________________
- ____________________

**What needs improvement:**
- ____________________
- ____________________

**Critical issues:**
- ____________________
- ____________________

### Recommendations
1. ____________________
2. ____________________
3. ____________________

### User Experience Rating
**First Impression:** ★★★★★  
**Clarity:** ★★★★★  
**Functionality:** ★★★★★  
**Polish:** ★★★★★  
**Overall:** ★★★★★

---

*Remember: Test like a user, not a developer. If something is unclear or broken, document exactly what you expected vs. what happened.*