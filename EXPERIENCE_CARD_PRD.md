# Experience Card Feature - PRD

## Overview
Add a reusable **Experience Card** component to the homepage for displaying professional work experience. Cards will feature a split layout on desktop (company info left, responsibilities right) that stacks on mobile. Full CRUD functionality via Decap CMS.

---

## 1. User Stories

### As a Content Editor
- I want to add experience cards via Decap CMS without touching code
- I want to edit company name, position, date range, duration, and responsibilities
- I want to add/remove up to 4 key responsibility items per card
- I want to format responsibility descriptions with bullet points
- I want to preview the card before publishing

### As a Website Visitor (Desktop)
- I want to see experience cards with company info on the left (~35% width)
- I want to see key responsibilities on the right (~65% width) in a 2x2 grid
- I want responsibility titles and descriptions with blue-styled bullet points
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

---

## 3. Technical Implementation

### Files to Create
- `src/components/experience-card.js` — React component
- `src/assets/scss/experience-card.scss` — Styling
- `src/content/experiences/` — Content folder (create empty initially)
- Example: `src/content/experiences/conwo-solution.md` — Sample data

### Files to Modify
- `static/admin/config.yml` — Add experiences collection
- `src/templates/index-page.js` — Query and display experience cards
- `gatsby-config.js` — Ensure filesystem plugin sources experiences folder

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
- Grid: 2 columns (35% | 65%)
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
        }
      }
    }
  }
}
```

### Rendering

Add after blog posts section in homepage template:

```jsx
{data.experiences && data.experiences.edges.length > 0 && (
  <section className="experiences-section">
    <h2>Experience</h2>
    {data.experiences.edges.map(({ node }) => (
      <ExperienceCard
        key={node.id}
        {...node.childMarkdownRemark.frontmatter}
      />
    ))}
  </section>
)}
```

---

## 7. Styling Details

### Key Classes
- `.experience-card` — Main container
- `.experience-card__info` — Left section (company/position/date)
- `.experience-card__divider` — Vertical divider (desktop only)
- `.experience-card__responsibilities` — Right section
- `.responsibilities-grid` — 2x2 grid container
- `.responsibility-box` — Individual responsibility item
- `.responsibility-description` — Description text with bullets

### Color & Styling
- Company name: Large, bold heading
- Position: Blue color (primary theme color)
- Date/Duration: Muted color, smaller font
- KEY RESPONSIBILITIES header: Uppercase, small, muted, letter-spaced
- Bullet points: Blue colored markers
- Responsibility boxes: Bordered, subtle background, rounded corners

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

| Breakpoint | Behavior |
|-----------|----------|
| **Desktop (>768px)** | 2-column grid (35%/65%), 2x2 responsibility grid |
| **Tablet (768px)** | Single column stack, responsibility items full width |
| **Mobile (<480px)** | Reduced padding/margins, tighter spacing, larger touch targets |

---

## 10. Acceptance Criteria

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
