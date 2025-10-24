# AWS News Integration Plan

## Overview
This document outlines the plan for integrating AWS Blog RSS feed (https://aws.amazon.com/blogs/aws/feed/) into the AWS Services Dashboard.

---

## Overall Architecture Plan

### 1. RSS Feed Integration Strategy

#### Option A: Client-Side Fetching (Recommended)
- Use a CORS proxy or RSS-to-JSON service (like `rss2json.com` API or similar)
- Fetch and cache in React Query with a 30-minute stale time
- Fallback gracefully if feed is unavailable

#### Option B: Server-Side (If adding a backend)
- Fetch RSS feed server-side during Lambda function execution
- Store parsed articles in S3 alongside existing data
- Serve as JSON from CloudFront

**Recommendation**: Start with Option A using React Query for simplicity, matching your existing data fetching pattern.

---

### 2. Dashboard/Homepage Changes

#### Replace "Data Source" Section with "Latest AWS News"

**Current Layout (Remove)**:
```
┌─────────────────────────────────┐
│       Data Source Info          │
│  - AWS Systems Manager          │
│  - Daily Updates at 2:00 AM     │
│  - CloudFront CDN               │
└─────────────────────────────────┘
```

**New Layout (Add)**:
```
┌─────────────────────────────────────────────────┐
│            Latest from AWS Blog                 │
├─────────────────────────────────────────────────┤
│  📰 [Thumbnail]  │  Article Title               │
│                  │  Brief excerpt (2-3 lines)   │
│                  │  Published: 2 hours ago      │
│                  │                              │
│                  │  [Read More →] [View All News →] │
└─────────────────────────────────────────────────┘
```

#### Design Specifications
- **Card Style**: Match existing `bg-bg-secondary` with border
- **Thumbnail**: 120x120px image (left side on desktop, top on mobile)
- **Title**: Bold, primary color, clickable
- **Excerpt**: First 150-200 characters from article description
- **Date**: Use existing `formatRelativeTime()` function
- **Buttons**:
  - "Read Article" → Opens AWS blog post in new tab
  - "View All News" → Links to `/news` page
- **Loading State**: Show skeleton or "Loading latest news..."
- **Error State**: "Unable to load news" with retry option

---

### 3. Dedicated News Page (`/news`)

#### Layout Structure

```
┌──────────────────────────────────────────────────┐
│  AWS News & Updates                              │
│  Latest announcements from the AWS Blog          │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  🔍 [Search articles...]         [Filter: All ▼] │
└──────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│  📰 Featured Article (First/Latest)               │
│  ┌────────────────────────────────────────────┐  │
│  │  [Large Thumbnail]                         │  │
│  │  Title (larger font)                       │  │
│  │  Full description excerpt                  │  │
│  │  Published: date • Author                  │  │
│  │  [Read Article →]                          │  │
│  └────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Recent Articles (Grid Layout)                  │
│  ┌─────────────┐  ┌─────────────┐              │
│  │ [Thumbnail] │  │ [Thumbnail] │  ...         │
│  │ Title       │  │ Title       │              │
│  │ Excerpt     │  │ Excerpt     │              │
│  │ Date        │  │ Date        │              │
│  └─────────────┘  └─────────────┘              │
│                                                 │
│  [Load More Articles]                          │
└─────────────────────────────────────────────────┘
```

#### Features
- **Pagination**: Show 10-15 articles initially, "Load More" button
- **Search**: Filter articles by title/description (client-side)
- **Grid Layout**: 3 columns on desktop, 2 on tablet, 1 on mobile
- **Card Design**: Similar to existing service/region cards
- **Sorting**: Most recent first (default from RSS)
- **External Link Indicator**: Icon showing article opens in new tab

---

### 4. Navigation Updates

#### Header Navigation
Add between "Coverage" and "About":
```
Dashboard | Regions | Services | Coverage | News | About
```

#### Mobile Considerations
- Ensure "News" fits in mobile menu
- Consider hamburger menu if nav gets too crowded

---

### 5. Data Structure

#### RSS Feed Response Structure
```javascript
{
  title: "AWS Blog",
  description: "...",
  link: "https://aws.amazon.com/blogs/aws/",
  items: [
    {
      title: "Article Title",
      description: "Full HTML description...",
      link: "https://aws.amazon.com/blogs/aws/article-slug/",
      pubDate: "2025-10-23T10:00:00Z",
      author: "Author Name",
      thumbnail: "https://...", // May or may not exist
      categories: ["Announcements", "Compute"]
    }
  ]
}
```

#### Data Fetching Hook
```javascript
// hooks/useAWSNews.js
- Fetch RSS feed via proxy
- Transform XML to JSON
- Cache for 30 minutes
- Return { articles, isLoading, isError, refetch }
```

---

### 6. Implementation Priority

#### Phase 1: Basic Integration
1. Create RSS-to-JSON fetching utility
2. Create `useAWSNews` hook with React Query
3. Update Dashboard to replace Data Source section
4. Add navigation link

#### Phase 2: Dedicated News Page
5. Create `/news` route and News component
6. Implement article grid layout
7. Add search/filter functionality

#### Phase 3: Enhancements
8. Add category filtering
9. Implement "Load More" pagination
10. Add article thumbnails (extract from content if not in feed)
11. Mobile optimization

---

### 7. Technical Considerations

#### RSS Feed Parsing
- Use `rss-parser` npm package or similar
- Or use RSS-to-JSON API service (e.g., `api.rss2json.com`)
- Handle CORS issues with proxy

#### Caching Strategy
```javascript
{
  staleTime: 30 * 60 * 1000,  // 30 minutes
  cacheTime: 60 * 60 * 1000,  // 1 hour
  refetchOnWindowFocus: false
}
```

#### Error Handling
- Show fallback message if feed fails
- Retry mechanism
- Don't break dashboard if news unavailable

#### Performance
- Lazy load news component
- Optimize image loading (use thumbnails)
- Limit initial articles to 20-30

---

### 8. UI Component Breakdown

#### New Components to Create
1. `components/news/LatestArticle.jsx` - Dashboard featured article
2. `components/news/ArticleCard.jsx` - Individual article card
3. `components/news/ArticleGrid.jsx` - Grid of articles
4. `components/news/FeaturedArticle.jsx` - Hero article on news page
5. `views/News.jsx` - Main news page
6. `hooks/useAWSNews.js` - Data fetching hook
7. `utils/rssParser.js` - RSS parsing utility

---

### 9. Design Mockup (Text-based)

#### Dashboard Integration
```
┌────────────────────────────────────────────────┐
│  Latest from AWS Blog                          │
├────────────────────────────────────────────────┤
│  ┌─────┐  Announcing Amazon Q Apps in         │
│  │ 📰  │  Amazon Q Business                    │
│  │img  │  Amazon Q Apps enables users to      │
│  └─────┘  create generative AI apps without   │
│            coding. Now available in Amazon Q   │
│            Published 3 hours ago               │
│                                                │
│  [Read Article →]    [View All News →]        │
└────────────────────────────────────────────────┘
```

#### News Page Header
```
┌─────────────────────────────────────────────────┐
│  AWS News & Updates                             │
│  Stay up to date with the latest AWS            │
│  announcements, features, and best practices    │
│  Last updated: 15 minutes ago                   │
└─────────────────────────────────────────────────┘
```

---

### 10. Responsive Behavior

#### Desktop (> 1024px)
- 3-column article grid
- Thumbnail on left of cards
- Full navigation visible

#### Tablet (768px - 1024px)
- 2-column article grid
- Thumbnail on top of cards
- Full navigation visible

#### Mobile (< 768px)
- 1-column article grid
- Thumbnail on top of cards
- Hamburger menu navigation
- Reduced excerpt length

---

## Summary

### Key Benefits of This Design
1. ✅ Non-intrusive integration (replaces less useful Data Source section)
2. ✅ Consistent with existing design language
3. ✅ Showcases AWS content without leaving your site's context
4. ✅ Provides value to users wanting latest AWS updates
5. ✅ Uses existing infrastructure (React Query, CloudFront)
6. ✅ Graceful degradation if feed unavailable

### Potential Challenges
1. CORS issues with RSS feed (solved with proxy)
2. RSS feed format changes (add error handling)
3. Image extraction from content (RSS may not have thumbnails)
4. Performance if loading many articles (use pagination)

---

## Next Steps

Once approved, implementation will proceed in phases as outlined in Section 6.
