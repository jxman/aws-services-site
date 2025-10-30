# Dashboard "What's New" Section - Implementation Plan

**Goal:** Replace the "Data Source" section on the Dashboard home page with a dynamic "What's New" preview that shows recent AWS infrastructure changes and the latest AWS announcement.

---

## Current State Analysis

### Existing Dashboard Layout (Dashboard.jsx)

**Current Structure:**
```
Dashboard
├── Page Header (title, description, last updated)
├── Stats Grid (4 cards: Regions, Services, Mappings, Reports)
└── Content Sections (2-column grid)
    ├── Data Source Info (LEFT - TO BE REPLACED)
    │   └── Static information about AWS Parameter Store, update schedule, CloudFront
    └── Quick Actions (RIGHT - KEEP AS IS)
        └── Links to Regions, Services, Reports
```

**Lines to Replace:** Lines 93-127 (Data Source section)

**Current Section Characteristics:**
- Card-based design with border
- 3 bullet points with icons and descriptions
- Static content (never changes)
- No user interaction beyond reading
- Takes up 50% width on desktop (lg:grid-cols-2)

---

## Proposed "What's New" Section Design

### Visual Layout

```
┌──────────────────────────────────────────────────────────┐
│  📰 What's New                         [View All →]      │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  🔥 LATEST FROM AWS                                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │  TwelveLabs' Marengo Embed 3.0 for advanced...    │  │
│  │  Oct 29, 2025 · Amazon Bedrock                    │  │
│  │  [Read More →]                                     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  📊 RECENT INFRASTRUCTURE CHANGES                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │  🔵 Amazon Elastic VMware Service                  │  │
│  │     New service launched                           │  │
│  │                                                     │  │
│  │  🟢 AWS Control Tower                              │  │
│  │     Expanded to ap-southeast-6                     │  │
│  │                                                     │  │
│  │  🟢 AWS Chatbot                                    │  │
│  │     Expanded to ap-southeast-5                     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Since Oct 23: 1 new service, 14 regional expansions     │
└──────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### New Component Structure

```javascript
Dashboard.jsx
  └── WhatsNewPreview (NEW COMPONENT)
      ├── LatestAnnouncementCard (NEW)
      │   ├── Headline (title, truncated)
      │   ├── Metadata (date, service tags)
      │   └── Read More link
      │
      └── RecentChangesPreview (NEW)
          ├── ChangesList (top 3-5 items)
          │   ├── Change icon (colored badge)
          │   ├── Service name
          │   └── Change description
          │
          └── Summary statistics
```

### File Structure

```
src/
├── views/
│   └── Dashboard.jsx (MODIFY)
│
└── components/
    └── dashboard/
        ├── WhatsNewPreview.jsx (NEW)
        ├── LatestAnnouncementCard.jsx (NEW)
        └── RecentChangesPreview.jsx (NEW)
```

---

## Data Requirements

### Data Sources

1. **AWS What's New Announcements**
   - Endpoint: `https://aws-services.synepho.com/data/aws-whats-new.json`
   - Already have hook: `useAWSAnnouncements()`
   - Need: First announcement only for headline

2. **Infrastructure Change History**
   - Endpoint: `https://aws-services.synepho.com/data/change-history.json`
   - Already have hook: `useInfrastructureChanges()`
   - Need: Latest 3-5 changes from most recent date

### Data Fetching Strategy

**Option 1: Fetch Both APIs on Dashboard (Recommended)**
- Pros:
  - Always fresh data on home page
  - Consistent with What's New page
  - Shows real-time updates
- Cons:
  - Two additional API calls on home page load
  - Slightly slower initial load

**Option 2: Use Existing AWS Data + Fetch Announcements Only**
- Pros:
  - One fewer API call
  - Faster load time
- Cons:
  - Infrastructure changes come from different source
  - Inconsistent with What's New page data

**Recommendation:** Use Option 1 for consistency and accuracy

---

## Detailed Component Specifications

### 1. WhatsNewPreview Component

**Location:** `src/components/dashboard/WhatsNewPreview.jsx`

**Props:**
```javascript
{
  infrastructureData: object,  // From useInfrastructureChanges()
  announcementsData: object,   // From useAWSAnnouncements()
  isLoading: boolean,
  hasError: boolean
}
```

**Layout:**
- Replaces Data Source section (same position, same card styling)
- Header with title "What's New" and "View All →" link to `/whats-new`
- Two subsections: Latest Announcement + Recent Changes
- Loading state: Skeleton placeholders
- Error state: Graceful fallback message

**Styling:**
- Match existing card style: `bg-bg-light-secondary dark:bg-bg-secondary`
- Border: `border border-border-light dark:border-border`
- Padding: `p-6`
- Rounded corners: `rounded-lg`

---

### 2. LatestAnnouncementCard Component

**Location:** `src/components/dashboard/LatestAnnouncementCard.jsx`

**Props:**
```javascript
{
  announcement: {
    title: string,
    pubDateFormatted: string,
    categories: string[],
    link: string,
    summary: string
  }
}
```

**Visual Design:**
```
┌──────────────────────────────────────────────────┐
│  🔥 LATEST FROM AWS                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                  │
│  TwelveLabs' Marengo Embed 3.0 for advanced     │
│  video understanding now in Amazon Bedrock       │
│                                                  │
│  Oct 29, 2025 · Amazon Bedrock · AI/ML          │
│                                                  │
│  [Read More on AWS →]                            │
└──────────────────────────────────────────────────┘
```

**Features:**
- Fire emoji (🔥) or sparkle icon for "latest"
- Title: 2-line truncation with ellipsis
- Date and service tags: Smaller text, secondary color
- External link to AWS announcement
- Hover effect: Slight border color change
- Background: Slightly different shade from main card

**Styling Details:**
- Background: `bg-bg-light-tertiary dark:bg-bg-tertiary`
- Title: `text-base font-semibold` (2-line clamp)
- Metadata: `text-xs text-text-light-secondary`
- Link: `text-primary hover:underline`
- Padding: `p-4`
- Border radius: `rounded-md`

---

### 3. RecentChangesPreview Component

**Location:** `src/components/dashboard/RecentChangesPreview.jsx`

**Props:**
```javascript
{
  changeLog: array,      // Latest changes
  metadata: object,      // Statistics
  maxItems: number       // Default: 3
}
```

**Visual Design:**
```
┌──────────────────────────────────────────────────┐
│  📊 RECENT INFRASTRUCTURE CHANGES                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                  │
│  🔵 Amazon Elastic VMware Service                │
│     New service launched                         │
│                                                  │
│  🟢 AWS Control Tower                            │
│     Expanded to ap-southeast-6                   │
│                                                  │
│  🟢 AWS Chatbot                                  │
│     Expanded to ap-southeast-5                   │
│                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Since Oct 23: 1 new service, 14 expansions     │
└──────────────────────────────────────────────────┘
```

**Features:**
- List of 3-5 most recent changes
- Color-coded icons:
  - 🔵 Blue circle = New service
  - 🟢 Green circle = Regional expansion
  - 🟣 Purple circle = New region
- Two-line format per item:
  - Line 1: Service name (bold)
  - Line 2: Change description (lighter text)
- Summary footer with key statistics
- Background: Same as Latest Announcement card

**Logic:**
1. Get most recent date from changeLog
2. Extract all changes from that date
3. Flatten into single list:
   - All newServices items
   - All newRegionalServices items (grouped by service)
   - All newRegions items
4. Take first 3-5 items
5. Format each based on type

---

## Implementation Steps

### Phase 1: Create Components (No Integration)

**Step 1.1: Create LatestAnnouncementCard**
- Build standalone component
- Accept announcement prop
- Implement truncation and styling
- Add external link

**Step 1.2: Create RecentChangesPreview**
- Build standalone component
- Accept changeLog and metadata
- Implement item extraction logic
- Format items with icons
- Add summary statistics

**Step 1.3: Create WhatsNewPreview Container**
- Combine both subcomponents
- Add loading states (skeleton screens)
- Add error states (graceful degradation)
- Add "View All" header with link

**Step 1.4: Test Components in Isolation**
- Create test file with sample data
- Verify rendering
- Test responsive behavior
- Check dark mode

---

### Phase 2: Integrate with Dashboard

**Step 2.1: Add Data Hooks to Dashboard**
```javascript
// In Dashboard.jsx
const { data: infrastructureData, isLoading: infraLoading } = useInfrastructureChanges();
const { data: announcementsData, isLoading: announcementsLoading } = useAWSAnnouncements();
```

**Step 2.2: Replace Data Source Section**
- Remove lines 93-127 (Data Source section)
- Insert WhatsNewPreview component
- Pass data props

**Step 2.3: Update Loading State**
- Dashboard should show loading for AWS data
- WhatsNewPreview can load independently if needed
- Consider progressive loading (show stats first, then What's New)

**Step 2.4: Test Integration**
- Verify data flows correctly
- Check loading states
- Test error scenarios
- Validate responsive layout

---

### Phase 3: Polish & Optimization

**Step 3.1: Performance**
- Memoize expensive calculations
- Optimize re-renders
- Consider caching strategy

**Step 3.2: Accessibility**
- Add ARIA labels
- Ensure keyboard navigation
- Test screen reader compatibility

**Step 3.3: Mobile Optimization**
- Test on small screens
- Adjust truncation for mobile
- Verify touch targets

**Step 3.4: Visual Polish**
- Add subtle animations
- Improve hover states
- Fine-tune spacing

---

## Detailed Specifications

### Loading States

**Skeleton Design:**
```
┌──────────────────────────────────────────────────┐
│  📰 What's New                  [View All →]     │
├──────────────────────────────────────────────────┤
│                                                  │
│  🔥 LATEST FROM AWS                              │
│  ┌────────────────────────────────────────────┐ │
│  │  ████████████████████████                  │ │
│  │  ██████████                                │ │
│  │  ███████                                   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  📊 RECENT INFRASTRUCTURE CHANGES                │
│  ┌────────────────────────────────────────────┐ │
│  │  ● ████████████████                        │ │
│  │    ██████████                              │ │
│  │                                            │ │
│  │  ● ████████████                            │ │
│  │    ████████                                │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

**Implementation:**
- Use animated gradient shimmer effect
- Match card dimensions exactly
- Show immediately (no delay)

---

### Error States

**Graceful Degradation:**

**Scenario 1: Both APIs Fail**
```
┌──────────────────────────────────────────────────┐
│  📰 What's New                  [View All →]     │
├──────────────────────────────────────────────────┤
│                                                  │
│  ⚠️ Unable to load latest updates                │
│                                                  │
│  Visit the What's New page to see the latest    │
│  AWS infrastructure changes and announcements.   │
│                                                  │
│  [View What's New Page →]                        │
└──────────────────────────────────────────────────┘
```

**Scenario 2: Announcements Fail, Infrastructure Works**
```
Show infrastructure changes only, with message:
"Latest AWS announcements unavailable. Showing recent changes."
```

**Scenario 3: Infrastructure Fails, Announcements Work**
```
Show announcement only, with message:
"Recent changes unavailable. Showing latest AWS news."
```

---

### Responsive Behavior

#### Desktop (≥1024px)
- Full two-column layout maintained
- What's New on left, Quick Actions on right
- All content visible without scrolling within card

#### Tablet (768px - 1023px)
- Two-column layout maintained
- Slightly reduced padding
- Announcement title may need 3-line truncation

#### Mobile (<768px)
- Single column stack
- What's New shows first, then Quick Actions
- Consider collapsing to "Latest AWS News" only (omit infrastructure changes)
- Or show 2 items instead of 3-5

---

## Data Processing Logic

### Extract Latest Changes

```javascript
function getLatestChanges(changeLog, maxItems = 3) {
  if (!changeLog || changeLog.length === 0) return [];

  // Get most recent entry
  const latestEntry = changeLog[0]; // Assuming sorted by date DESC
  const changes = latestEntry.changes;

  const items = [];

  // Add new services
  if (changes.newServices) {
    changes.newServices.forEach(service => {
      items.push({
        type: 'new-service',
        icon: 'blue',
        title: service.name,
        description: 'New service launched',
        code: service.code
      });
    });
  }

  // Add regional expansions (grouped)
  if (changes.newRegionalServices) {
    const grouped = groupByService(changes.newRegionalServices);
    Object.entries(grouped).forEach(([serviceCode, data]) => {
      items.push({
        type: 'regional-expansion',
        icon: 'green',
        title: data.name || serviceCode,
        description: `Expanded to ${data.regions.join(', ')}`,
        code: serviceCode
      });
    });
  }

  // Add new regions
  if (changes.newRegions) {
    changes.newRegions.forEach(region => {
      items.push({
        type: 'new-region',
        icon: 'purple',
        title: 'New Region Available',
        description: region,
        code: region
      });
    });
  }

  return items.slice(0, maxItems);
}
```

### Format Statistics

```javascript
function formatChangeSummary(metadata) {
  const { created, changesSinceInception } = metadata;
  const { newServices, newRegionalServices, newRegions } = changesSinceInception;

  const parts = [];
  if (newServices > 0) parts.push(`${newServices} new service${newServices > 1 ? 's' : ''}`);
  if (newRegionalServices > 0) parts.push(`${newRegionalServices} expansion${newRegionalServices > 1 ? 's' : ''}`);
  if (newRegions > 0) parts.push(`${newRegions} new region${newRegions > 1 ? 's' : ''}`);

  return `Since ${created}: ${parts.join(', ')}`;
}
```

---

## Key Decisions & Rationale

### Why Replace Data Source?

**Current Issues:**
1. **Static content** - Never changes, low value after first view
2. **Technical focus** - More about infrastructure than user value
3. **No actionable insights** - Just explanatory information
4. **Wasted prime real estate** - High visibility, low engagement

**Benefits of What's New Preview:**
1. **Dynamic content** - Always fresh, reason to revisit
2. **User value** - Shows what's actually new and relevant
3. **Drives engagement** - Encourages exploration of What's New page
4. **Better homepage** - More interesting and useful

---

### Why Show Only Latest (Not Historical)?

**Rationale:**
1. **Dashboard purpose** - Quick overview, not deep dive
2. **Space constraints** - Limited card space
3. **Engagement driver** - Tease content, drive to full page
4. **Performance** - Minimal data processing

---

### Why 3-5 Items Max?

**Rationale:**
1. **Visual balance** - Fits nicely in card without scrolling
2. **Scan-ability** - Easy to consume at a glance
3. **Focus** - Most recent items are most relevant
4. **Consistency** - Matches Quick Actions item count

---

## Testing Checklist

### Functional Testing
- [ ] Data loads from both APIs correctly
- [ ] Latest announcement displays properly
- [ ] Recent changes show correct items
- [ ] Summary statistics are accurate
- [ ] "View All" link navigates to /whats-new
- [ ] External AWS links open in new tab
- [ ] Loading states display correctly
- [ ] Error states handle gracefully

### Visual Testing
- [ ] Layout matches design spec
- [ ] Icons render correctly (colored circles)
- [ ] Text truncation works properly
- [ ] Spacing and alignment correct
- [ ] Colors match theme (light/dark)
- [ ] Borders and shadows consistent with site

### Responsive Testing
- [ ] Desktop (1920px, 1440px, 1024px)
- [ ] Tablet (768px, 834px, 1024px)
- [ ] Mobile (375px, 414px, 390px)
- [ ] Layout doesn't break at any size
- [ ] Touch targets adequate on mobile

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Alt text for icons/images

### Performance Testing
- [ ] Component renders quickly
- [ ] No unnecessary re-renders
- [ ] Images/icons load efficiently
- [ ] No layout shift during load

---

## Alternative Design Considerations

### Option A: Single Column (Selected Design Above)
**Pros:**
- Consistent with current layout
- Easy to implement
- Familiar pattern

**Cons:**
- Limited space
- May feel cramped

### Option B: Full-Width Banner
```
┌─────────────────────────────────────────────────────────────┐
│  📰 What's New with AWS                    [View All →]     │
├────────────────────┬────────────────────────────────────────┤
│  🔥 Latest News    │  📊 Recent Changes                      │
│  [Announcement]    │  [3 items in horizontal row]          │
└────────────────────┴────────────────────────────────────────┘
```

**Pros:**
- More prominent placement
- Horizontal layout for changes
- Better visibility

**Cons:**
- Disrupts grid layout
- May be too prominent
- Complex responsive behavior

### Option C: Carousel/Slider
```
┌──────────────────────────────────────────────────┐
│  📰 What's New            [< 1/5 >]  [View All]  │
├──────────────────────────────────────────────────┤
│  [Single announcement or change at a time]       │
│  [Auto-rotate every 5 seconds]                   │
└──────────────────────────────────────────────────┘
```

**Pros:**
- Space-efficient
- Eye-catching animation
- Can show more items

**Cons:**
- User must wait or click to see all
- Accessibility concerns
- May be distracting

**Decision:** Stick with Option A (single column) for consistency and simplicity.

---

## Future Enhancements (Phase 4+)

### Enhancement Ideas
1. **User Preferences**
   - Allow users to choose which types of changes to show
   - Save preferences in localStorage
   - Custom number of items displayed

2. **Filtering**
   - Show only changes relevant to specific services
   - Filter by region
   - Show only new services or only expansions

3. **Notifications**
   - Show badge when new items available
   - Browser notifications for major changes
   - Email subscriptions

4. **Rich Previews**
   - Hover cards with more details
   - Inline expansion for full announcement
   - Related links and resources

5. **Analytics**
   - Track which items users click
   - Measure engagement with What's New preview
   - Optimize based on user behavior

---

## Success Metrics

### Key Performance Indicators
1. **Click-through Rate** - % of users who click "View All" or individual items
2. **Time on Page** - Average time spent viewing What's New preview
3. **Engagement Rate** - % of dashboard views that interact with What's New
4. **Return Visits** - Do users come back more often with dynamic content?

### Target Goals
- Click-through rate: >15%
- Engagement rate: >25%
- Return visits: +10% increase

---

## Risk Assessment

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| API failures | Medium | Medium | Graceful error handling, fallback content |
| Performance impact | Low | Medium | Lazy loading, caching, memoization |
| Data inconsistencies | Low | Low | Validation, error boundaries |
| Layout breaking | Low | High | Thorough responsive testing |

### User Experience Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Users miss Data Source info | Medium | Low | Add to About page or footer |
| Too much information | Low | Medium | Limit to 3-5 items, clear hierarchy |
| Confusion with navigation | Low | Medium | Clear "View All" link, consistent design |
| Mobile layout issues | Medium | Medium | Mobile-first development |

---

## Rollout Strategy

### Phased Rollout (Recommended)

**Phase 1: Development (Week 1)**
- Build components
- Unit tests
- Integration with Dashboard

**Phase 2: Internal Testing (Week 2)**
- Deploy to staging
- Team review
- Gather feedback
- Iterate on design

**Phase 3: Beta Release (Week 3)**
- Deploy to production
- Monitor analytics
- Watch for errors
- Collect user feedback

**Phase 4: Full Release (Week 4)**
- Address any issues
- Optimize based on data
- Document learnings
- Plan future enhancements

### Rollback Plan
- Keep Data Source component code
- Feature flag to toggle between old/new
- Can revert instantly if issues arise
- Monitor error rates and user complaints

---

## Documentation Requirements

### Code Documentation
- JSDoc comments for all functions
- PropTypes or TypeScript definitions
- README for component usage
- Examples in Storybook (if available)

### User Documentation
- Update About page to mention What's New
- Add tooltip or help text if needed
- Update any onboarding materials

---

## Conclusion

Replacing the Data Source section with a What's New preview provides significantly more value to users while maintaining the Dashboard's clean, information-dense design. The implementation is straightforward, leveraging existing APIs and components from the What's New page, ensuring consistency and minimizing technical risk.

**Key Benefits:**
- More engaging home page
- Drives traffic to What's New page
- Always fresh, relevant content
- Minimal technical complexity

**Next Steps:**
1. Review and approve this plan
2. Begin Phase 1: Component development
3. Test thoroughly before integration
4. Monitor success metrics post-launch