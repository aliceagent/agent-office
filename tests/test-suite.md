# Office Canvas Test Suite

## Automated Tests (Gamma 🦔)

### Unit Tests

| ID | Test | Expected | Status |
|----|------|----------|--------|
| T-001 | Kanban board renders | 4 columns visible | ⏳ |
| T-002 | Task cards display | Title, icon, priority shown | ⏳ |
| T-003 | Drag-drop works | Cards move between columns | ⏳ |
| T-004 | Agent workstations | 9 stations with correct icons | ⏳ |
| T-005 | Ticket badges | Show above working agents | ⏳ |
| T-006 | Sleeping agents | In cots with 💤 animation | ⏳ |
| T-007 | State save | Persists to localStorage | ⏳ |
| T-008 | State load | Restores on refresh | ⏳ |
| T-009 | Concurrent work | Multiple agents working | ⏳ |
| T-010 | Telegram portal | Exists and interactive | ⏳ |

### Integration Tests

| ID | Test | Expected | Status |
|----|------|----------|--------|
| T-011 | Task → Agent wake | Assigning task wakes agent | ⏳ |
| T-012 | Walk animation | Smooth point-to-point | ⏳ |
| T-013 | Claim animation | Agent picks up card | ⏳ |
| T-014 | Complete flow | Full lifecycle works | ⏳ |

---

## UAT Scripts (Theta 🦝)

### UAT-001: Full Task Lifecycle
**Precondition:** Site loaded, at least one agent sleeping

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open https://aliceagent.github.io/agent-office/ | Office renders correctly |
| 2 | Observe Kanban board | 4 columns visible with headers |
| 3 | Find a sleeping agent | Agent in cot with 💤 |
| 4 | Assign task to agent | Agent wakes up |
| 5 | Watch agent walk | Moves toward Kanban board |
| 6 | See agent claim task | Task card attaches to agent |
| 7 | Watch agent walk to desk | Agent goes to workstation |
| 8 | Observe working state | Ticket badge appears above agent |
| 9 | Complete task | Agent stands, walks to board |
| 10 | See task in Done column | Card shows in Done |
| 11 | Watch agent go to portal | Agent walks to Telegram area |
| 12 | See message animation | Whoosh effect plays |
| 13 | Agent returns to cot | Agent sleeps again |

### UAT-002: Visual Checklist

| Item | Check | Pass? |
|------|-------|-------|
| Pool table centered | ☐ | |
| Bookshelf on wall | ☐ | |
| 9 workstations visible | ☐ | |
| 7 cots on right side | ☐ | |
| Telegram portal near door | ☐ | |
| Kitchen in corner | ☐ | |
| Birdcage with 🦜 | ☐ | |
| Plants scattered | ☐ | |
| Armchairs visible | ☐ | |
| Floor is wood colored | ☐ | |
| Wall is cream colored | ☐ | |

### UAT-003: Agent Icons Check

| Agent | Icon | Visible? |
|-------|------|----------|
| Alice | 🦜 | ☐ |
| Alpha | 🐺 | ☐ |
| Beta | 🦊 | ☐ |
| Gamma | 🦔 | ☐ |
| Delta | 🦉 | ☐ |
| Epsilon | 🐙 | ☐ |
| Zeta | 🦄 | ☐ |
| Eta | 🐼 | ☐ |
| Theta | 🦝 | ☐ |

### UAT-004: Responsive Test

| Viewport | Renders? | Issues |
|----------|----------|--------|
| 1920x1080 | ☐ | |
| 1366x768 | ☐ | |
| 1024x768 | ☐ | |
| 768x1024 (tablet) | ☐ | |
| 375x667 (mobile) | ☐ | |

---

## Bug Tracking

| Bug ID | Description | Severity | Status | Fixed By |
|--------|-------------|----------|--------|----------|
| | | | | |

---

## Test Results Log

### Run 1 — [Date]
**Automated:** _/10 passed  
**UAT:** _/4 passed  
**Bugs Found:** _  
**Bugs Fixed:** _  

---

*Tests written by Gamma 🦔 and Theta 🦝*
*Bug fixes by Beta 🦊*
