# 🏢 The Office — Product Roadmap v2

## Current Problems Identified

### 🔴 Critical Issues
| ID | Problem | Impact |
|----|---------|--------|
| P1 | **No real-time sync** — Office shows static/demo data, not actual Mission Control state | Users see fake data |
| P2 | **Overlap issues** — Elements still collide at different screen sizes | Broken mobile experience |
| P3 | **No agent location awareness** — Agents shown at desks but no movement to pool/cots/kitchen | Missing personality |
| P4 | **Ticket badges aren't synced** — Hardcoded task IDs, not from Notion | Misleading info |

### 🟡 UX Problems
| ID | Problem | Impact |
|----|---------|--------|
| P5 | **No time-of-day awareness** — Office looks same at 3am as 3pm | Feels dead |
| P6 | **No activity feed** — Can't see what just happened | Missing context |
| P7 | **Clicking agents does nothing useful** — Should show their current work | Missed interaction |
| P8 | **No sound/notifications** — Silent office feels lifeless | No feedback |

### 🟢 Missing Personality
| ID | Problem | Impact |
|----|---------|--------|
| P9 | **Agents don't interact** — No conversations, no pool games | Feels lonely |
| P10 | **No agent personalities** — All agents behave identically | Generic feel |
| P11 | **No office events** — No coffee breaks, no meetings | Boring |
| P12 | **No achievements/milestones** — No celebration when tasks complete | Missing dopamine |

---

## Product Specs — Phase 2

### OFFICE-2: Real-Time Mission Control Integration
**Goal:** Sync office state with actual Notion Mission Control board

**Features:**
- Fetch tasks from Notion API every 30s
- Update agent workstations with real task IDs
- Show accurate In Progress / Backlog / Done counts
- Ticket badges link directly to Notion page (not just database)
- Portrait status reflects actual agent activity

**Tickets:**
- `OFFICE-2-1`: Build Notion API integration layer
- `OFFICE-2-2`: Create task→agent mapping from Mission Control
- `OFFICE-2-3`: Real-time badge updates from Notion state
- `OFFICE-2-4`: Deep-link task badges to specific Notion pages

---

### OFFICE-3: Agent Lifecycle & Movement
**Goal:** Agents move around the office based on their state

**Behaviors:**
| State | Location | Animation |
|-------|----------|-----------|
| Working | At desk | Typing animation, focus glow |
| Idle | Pool table or kitchen | Wandering, chatting |
| Sleeping | On cot | Zzz animation, faded |
| Break | Couch/armchair | Relaxed pose |
| Completing task | Mail chute | Message flies up |

**Tickets:**
- `OFFICE-3-1`: Agent pathfinding system (A* or simple waypoints)
- `OFFICE-3-2`: State-based location assignment
- `OFFICE-3-3`: Smooth walking animations between locations
- `OFFICE-3-4`: Activity-specific idle animations

---

### OFFICE-4: Time-of-Day & Atmosphere
**Goal:** Office reflects real-world time and energy

**Features:**
- Morning (6am-12pm): Bright, agents arriving, coffee brewing
- Afternoon (12pm-6pm): Peak activity, all desks busy
- Evening (6pm-10pm): Winding down, some agents leaving
- Night (10pm-6am): Dim lights, skeleton crew, most sleeping
- Shabbat mode: Office dark/quiet Friday sunset → Saturday sunset

**Tickets:**
- `OFFICE-4-1`: Time-based lighting system
- `OFFICE-4-2`: Dynamic agent schedules per time
- `OFFICE-4-3`: Ambient sound system (typing, coffee, murmurs)
- `OFFICE-4-4`: Shabbat detection and quiet mode

---

### OFFICE-5: Activity Feed & Notifications
**Goal:** See what's happening in real-time

**Features:**
- Scrolling activity ticker at bottom: "🐺 Alpha claimed CHN-2-8" 
- Toast notifications for task completions
- Sound effects: task complete chime, new task ping
- Click activity item → jump to that task/agent

**Tickets:**
- `OFFICE-5-1`: Activity feed UI component
- `OFFICE-5-2`: WebSocket or polling for live updates
- `OFFICE-5-3`: Sound effect system with mute toggle
- `OFFICE-5-4`: Toast notification system

---

### OFFICE-6: Agent Personalities & Interactions
**Goal:** Each agent has unique behaviors and they interact

**Agent Personalities:**
| Agent | Personality | Unique Behavior |
|-------|-------------|-----------------|
| 🦜 Alice | Cheerful, organized | Tidies desk, greets others |
| 🐺 Alpha | Competitive, fast | Rushes to grab tasks, victory howl |
| 🦊 Beta | Skeptical, thorough | Double-checks work, talks to rubber duck |
| 🦔 Gamma | Cautious, methodical | Slow but steady, validates everything |
| 🦉 Delta | Wise, nocturnal | Most active at night, mentors others |
| 🐙 Epsilon | Complex, systematic | Manages multiple things, tentacle animations |
| 🦄 Zeta | Creative, whimsical | Rainbow effects, decorates space |
| 🐼 Eta | Chill, balanced | Takes breaks, snacks at kitchen |
| 🦝 Theta | Curious, hands-on | Tests everything, breaks things to fix them |

**Interactions:**
- Two agents at pool table = mini game animation
- Agents near each other = chat bubble appears
- Task handoff = agents walk to each other

**Tickets:**
- `OFFICE-6-1`: Agent personality config system
- `OFFICE-6-2`: Inter-agent interaction triggers
- `OFFICE-6-3`: Chat bubble / speech system
- `OFFICE-6-4`: Pool table mini-game animation

---

### OFFICE-7: Responsive Layout & Mobile
**Goal:** Works beautifully on all screen sizes

**Features:**
- Fluid scaling from 320px to 4K
- Touch-friendly interactions
- Collapsible panels on mobile
- Portrait mode support

**Tickets:**
- `OFFICE-7-1`: CSS Grid/Flexbox responsive refactor
- `OFFICE-7-2`: Touch event handlers
- `OFFICE-7-3`: Mobile-specific UI (bottom sheet Kanban)
- `OFFICE-7-4`: Viewport scaling with aspect ratio lock

---

### OFFICE-8: Achievements & Celebrations
**Goal:** Reward progress with visual feedback

**Features:**
- Confetti when task completes
- Trophy case showing milestones (100 tasks, etc)
- Agent level-up animations
- Daily/weekly stats popup
- Streak tracking (days with completions)

**Tickets:**
- `OFFICE-8-1`: Confetti/particle system
- `OFFICE-8-2`: Achievement tracking logic
- `OFFICE-8-3`: Trophy case UI
- `OFFICE-8-4`: Stats dashboard modal

---

## Priority Order

1. **OFFICE-2** (Real-time sync) — Foundation for everything
2. **OFFICE-3** (Agent movement) — Core personality
3. **OFFICE-5** (Activity feed) — Immediate utility
4. **OFFICE-7** (Responsive) — Accessibility
5. **OFFICE-4** (Time-of-day) — Atmosphere
6. **OFFICE-6** (Personalities) — Delight
7. **OFFICE-8** (Achievements) — Engagement

---

## Sub-Agent Assignments

| Phase | Lead Agent | Support |
|-------|------------|---------|
| OFFICE-2 | 🐙 Epsilon | 🦔 Gamma |
| OFFICE-3 | 🦜 Alice | 🐺 Alpha |
| OFFICE-4 | 🦄 Zeta | 🦉 Delta |
| OFFICE-5 | 🐺 Alpha | 🦊 Beta |
| OFFICE-6 | 🦜 Alice | 🦝 Theta |
| OFFICE-7 | 🦊 Beta | 🐼 Eta |
| OFFICE-8 | 🦄 Zeta | 🦜 Alice |
