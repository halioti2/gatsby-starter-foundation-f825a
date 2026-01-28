# Experience Card Feature - PRD

## Overview
Add a reusable **Experience Card** component to the homepage for displaying professional work experience. Cards will feature a split layout on desktop (company info left, responsibilities right) that stacks on mobile. Full CRUD functionality via Decap CMS.

---

## 1. User Stories

### As a Content Editor
- I want to add experience cards via Decap CMS without touching code
- I want to edit company info: company name, position, date range, duration, and responsibilities
- I want to add/remove up to 4 key responsibility items per card
- I want to format responsibility descriptions with bullet points
- I want to optionally link each experience card to a related blog post
- I want the card data structure to support future reordering functionality

### As a Website Visitor (Desktop)
- I want to see experience cards with company info on the left (~35% viewport width)
- I want to see key responsibilities on the right (~65% viewport width) in a 2x2 grid
- I want responsibility boxes made of titles and descriptions with blue-styled bullet points
- I want a visually distinct card design matching the site theme

### As a Website Visitor (Mobile)
- I want cards to stack vertically with company info on top
- I want responsibility items to stack in a single column below
- I want the card to be readable without horizontal scrolling

---

## 2. Data Model

### Collection: `experiences`
- **Location:** `src/content/experiences/`
- **Type:** Markdown frontmatter
- **Create:** Yes (enabled in CMS)
- **Slug:** `{{company}}-{{position}}`

### Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `company` | String | Yes | e.g., "Conwo Solution Pvt. Ltd." |
| `position` | String | Yes | e.g., "Software Development Engineering Intern" |
| `dateRange` | String | Yes | e.g., "JAN 2021 — AUGUST 2021" |
| `duration` | String | Yes | e.g., "8 months" |
| `responsibilities` | Array (max 4) | Yes | Array of responsibility objects |
| `responsibilities[].title` | String | Yes | e.g., "PWA Development" |
| `responsibilities[].description` | Markdown | Yes | Supports bullets, formatting |
| `relatedBlogPost` | String | No | Slug of related blog post (future feature) |
| `displayOrder` | Number | No | Display order (for future reordering feature) |

---

## 3. Technical Implementation

### Files to Create
- `src/components/experience-card.js` — React component
- `src/assets/scss/experience-card.scss` — Styling with rem/em units
- `src/content/experiences/` — Content folder (create empty initially)
- Example: `src/content/experiences/conwo-solution.md` — Sample data

### Files to Modify
- `static/admin/config.yml` — Add experiences collection
- `src/templates/index-page.js` — Query and display experience cards
- `gatsby-config.js` — Ensure filesystem plugin sources experiences folder

### Design Considerations for Future Reordering
- Use `displayOrder` field to enable manual ordering via CMS UI
- Query should sort by `displayOrder` if present, fallback to creation date
- Implement drag-and-drop reordering in CMS (future release)

---

## 4. Component Design

### `ExperienceCard` Component

**Props:**
```js
{
  company: string,
  position: string,
  dateRange: string,
  duration: string,
  responsibilities: [
    { title: string, description: string (markdown) },
    ...
  ]
}
```

**Desktop Layout (>768px):**
- Grid: 2 columns (35% left | 65% right)
- Left: Company info (heading, position, date, duration)
- Right: 2x2 grid of responsibility boxes with H4 "KEY RESPONSIBILITIES" header
- Divider line between sections

**Mobile Layout (<768px):**
- Single column layout
- Top: Company info section
- Bottom: Responsibility boxes stacked single column
- No divider

---

## 5. CMS Configuration

### Decap CMS (`static/admin/config.yml`)

```yaml
- name: "experiences"
  label: "Experience Cards"
  folder: "src/content/experiences"
  create: true
  slug: "{{company}}-{{position}}"
  fields:
    - {label: "Company Name", name: "company", widget: "string", required: true}
    - {label: "Position Title", name: "position", widget: "string", required: true}
    - {label: "Date Range", name: "dateRange", widget: "string", hint: "e.g., JAN 2021 — AUGUST 2021", required: true}
    - {label: "Duration", name: "duration", widget: "string", hint: "e.g., 8 months", required: true}
    - label: "Key Responsibilities"
      name: "responsibilities"
      widget: "list"
      max: 4
      fields:
        - {label: "Title", name: "title", widget: "string", required: true}
        - {label: "Description", name: "description", widget: "markdown", hint: "Use markdown for bullets and formatting", required: true}
    - {label: "Related Blog Post", name: "relatedBlogPost", widget: "string", required: false, hint: "Post slug to link (e.g., /my-project-story)"}
    - {label: "Display Order", name: "displayOrder", widget: "number", required: false, hint: "Use for manual ordering (lower numbers appear first)"}
```

---

## 6. Homepage Integration

### GraphQL Query (in `index-page.js`)

```graphql
experiences: allFile(filter: {sourceInstanceName: {eq: "experiences"}}) {
  edges {
    node {
      id
      sourceInstanceName
      childMarkdownRemark {
        frontmatter {
          company
          position
          dateRange
          duration
          responsibilities {
            title
            description
          }
          relatedBlogPost
          displayOrder
        }
      }
    }
  }
}
```

### Rendering

Replace blog posts section with experience cards on homepage template:

```jsx
{data.experiences && data.experiences.edges.length > 0 && (
  <section className="experiences-section">
    <h2>Experience</h2>
    <div className="experiences-container">
      {data.experiences.edges
        .sort((a, b) => {
          const orderA = a.node.childMarkdownRemark.frontmatter.displayOrder || 999;
          const orderB = b.node.childMarkdownRemark.frontmatter.displayOrder || 999;
          return orderA - orderB;
        })
        .map(({ node }) => (
          <ExperienceCard
            key={node.id}
            {...node.childMarkdownRemark.frontmatter}
          />
        ))}
    </div>
  </section>
)}
```

**Layout Notes:**
- Experiences container has `max-width: 54rem` (860px) to match the card width shown in your design
- Cards are centered on the page with `margin: 0 auto`
- On MacBook full screen, cards take up ~50-60% of viewport width (as in your reference image)
- On tablet/mobile, cards expand with padding but stay readable

---

## 7. Styling Details

### Units & Sizing Philosophy
**All measurements use rem units only (no px)**
- Base font size: 16px → 1rem = 16px
- All dimensions scale relative to font size
- Ensures consistent responsive behavior across all devices

### Container Structure
```scss
.experiences-section {
  // Full-width section
}

.experiences-container {
  max-width: 54rem;        // ~860px - matches your design reference
  margin: 0 auto;          // Centered on page
  padding: 0 1rem;         // Edge padding on mobile
  
  @media (min-width: 768px) {
    padding: 0;            // No side padding on tablet+
  }
}

.experience-card {
  width: 100%;             // Full width within container
  // ... rest of card styles
}
```
- `.experience-card` — Main container
- `.experience-card__info` — Left section (company/position/date)
- `.experience-card__divider` — Vertical divider (desktop only)
- `.experience-card__responsibilities` — Right section
- `.responsibilities-grid` — 2x2 grid container
- `.responsibility-box` — Individual responsibility item
- `.responsibility-description` — Description text with bullets

### Container & Sizing
- **Max-width:** 54rem (~860px) — Constrains card to ~50-60% of MacBook screen width
- **Centering:** margin: 0 auto with padding for edges on mobile
- **Padding:** 2rem on desktop, 1.5rem on tablet, 1rem on mobile (all rem units)
- **Gap between left/right sections:** 3rem desktop, 1.5rem mobile

### Color & Styling (using rem/em units for all measurements)
- Company name: Large, bold heading (2rem font)
- Position: Blue color (primary theme color), 1rem font
- Date/Duration: Muted color, smaller font (0.875rem)
- KEY RESPONSIBILITIES header: Uppercase, small (0.75rem), muted, letter-spaced
- Bullet points: Blue colored markers
- Responsibility boxes: Bordered, subtle background, rounded corners (0.5rem border-radius)
- All gaps, padding, margins: rem units only (no px)

---

## 8. Data Example

**File: `src/content/experiences/conwo-solution.md`**

```markdown
---
company: "Conwo Solution Pvt. Ltd."
position: "Software Development Engineering Intern"
dateRange: "JAN 2021 — AUGUST 2021"
duration: "8 months"
responsibilities:
  - title: "PWA Development"
    description: |
      Developed a PWA using React, TypeScript, GraphQL, and Redux.
      - Built progressive web app features
      - Implemented offline functionality
  - title: "Metadata-driven Components"
    description: |
      Created components for data management using GraphQL, reducing time to production.
      - Reduced time to production
      - Improved component reusability
  - title: "Data Aggregation APIs"
    description: |
      Implemented analytics APIs with Cube.js, PostgreSQL, and Node.js.
      - Built custom analytics endpoints
      - Improved query performance
  - title: "Website Performance Optimization"
    description: |
      Improved website performance through caching, pagination, and reduced network calls.
      - 60% improvement in website performance
      - Improved Lighthouse score
---
```

---

## 9. Responsive Breakpoints

| Breakpoint | Card Width | Layout | Responsibility Grid |
|-----------|-----------|--------|-------------------|
| **Desktop (>1024px)** | max 54rem (860px), centered | 35% left / 65% right | 2x2 |
| **Tablet (768px-1024px)** | 90% with padding | 35% left / 65% right | 1 column |
| **Mobile (<768px)** | 100% with padding | Full stack (top/bottom) | 1 column |

---

## 10. CMS Preview & Publishing

### Preview Behavior
- **In CMS Editor:** You'll see the form fields and a text preview of your entries (field values displayed)
- **Live Preview:** No visual card preview in the CMS editor itself
- **Publishing:** Save the experience card in CMS → It immediately appears on the homepage
- **Testing:** Refresh the homepage to see changes in real-time during development

### No Blog Posts Section
- Experience cards are now the primary content on the homepage
- Blog posts have been removed from the homepage (previously displayed below experience cards)
- Blog posts still exist and can be linked via `relatedBlogPost` field (future feature)

- ✅ Experience collection created in Decap CMS
- ✅ Can add/edit/delete experience cards via CMS
- ✅ Max 4 responsibilities enforced in CMS
- ✅ Markdown descriptions with bullets supported
- ✅ Component renders correctly on desktop (split layout)
- ✅ Component stacks correctly on mobile
- ✅ Blue bullet points styled properly
- ✅ Homepage displays experience cards
- ✅ Responsive design tested (MacBook, tablet, mobile)
- ✅ No console errors
- ✅ CMS preview shows card layout (if supported)

---

## 11. Implementation Checklist

- [ ] Create `src/content/experiences/` folder
- [ ] Create `src/components/experience-card.js`
- [ ] Create `src/assets/scss/experience-card.scss`
- [ ] Update `static/admin/config.yml` with experiences collection
- [ ] Update `gatsby-config.js` if needed for experiences folder
- [ ] Update `src/templates/index-page.js` with GraphQL query
- [ ] Add experience section to homepage JSX
- [ ] Create sample experience markdown file
- [ ] Test desktop layout (2x2 grid, split columns)
- [ ] Test mobile layout (stacked single column)
- [ ] Test CMS add/edit/delete functionality
- [ ] Style bullet points with primary color
- [ ] Verify responsive design at all breakpoints
- [ ] Test homepage with both posts and experiences

---

## 12. Success Metrics

- Experience cards display correctly on homepage
- Users can manage experience data entirely through Decap CMS
- Mobile experience is seamless (no horizontal scrolling)
- Visual design matches site theme and branding
- All 4 responsibility items fit properly in 2x2 grid on desktop
