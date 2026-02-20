# Mobile Responsive Design Test Plan - OFF-4-2

## Test Devices & Resolutions

### iPhone SE (375x667)
- [ ] No horizontal scroll
- [ ] All elements visible
- [ ] Touch targets ≥ 44px
- [ ] Kanban modal full-screen
- [ ] Agent popover bottom-sheet style

### iPhone 14 (390x844)
- [ ] No horizontal scroll  
- [ ] All elements visible
- [ ] Touch targets ≥ 44px
- [ ] Kanban modal full-screen
- [ ] Agent popover bottom-sheet style

### Android Devices (Various)
- [ ] No horizontal scroll
- [ ] All elements visible
- [ ] Touch interactions work
- [ ] Proper viewport scaling

## Test Scenarios

1. **Basic Layout**
   - Office canvas scales properly
   - No elements overflow viewport
   - All furniture visible and proportional

2. **Workstation Interaction**
   - Touch workstation to open agent popover
   - Popover appears as bottom sheet on mobile
   - Task badges clickable with proper touch targets

3. **Kanban Board**
   - Click kanban board icon (📋)
   - Modal opens full-screen on mobile
   - Drag & drop works on touch devices
   - Columns stack vertically on mobile

4. **Responsive Elements**
   - Bookshelf scales down appropriately
   - Pool table rotated and sized for mobile
   - Beds and workstations properly positioned
   - No overlapping elements

## Verification Steps

1. Open: https://aliceagent.github.io/agent-office/
2. Use browser dev tools mobile emulation
3. Test at 375px and 390px widths
4. Verify all checklist items
5. Test touch interactions

## Success Criteria

✅ No horizontal scroll on any mobile device
✅ All elements visible and accessible
✅ Touch interactions work properly
✅ Kanban modal mobile-optimized
✅ Agent popover mobile-friendly