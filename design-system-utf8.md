## Design System: Kevin Mini OTL

### Pattern
- **Name:** Webinar Registration
- **Conversion Focus:**  speaker avatar float,  urgent ticker, Limited seats logic. 'Live' indicator. Auto-fill timezone.
- **CTA Placement:** Hero (Right side form) + Bottom anchor
- **Color Strategy:** Urgency: Red/Orange. Professional: Blue/Navy. Form: High contrast white.
- **Sections:** 1. Hero (Topic + Timer + Form), 2. What you'll learn, 3. Speaker Bio, 4. Urgency/Bonuses, 5. Form (again)

### Style
- **Name:** Claymorphism
- **Keywords:** Soft 3D, chunky, playful, toy-like, bubbly, thick borders (3-4px), double shadows, rounded (16-24px)
- **Best For:** Educational apps, children's apps, SaaS platforms, creative tools, fun-focused, onboarding, casual games
- **Performance:** ⚡ Good | **Accessibility:** ⚠ Ensure 4.5:1

### Colors
| Role | Hex |
|------|-----|
| Primary | #0D9488 |
| Secondary | #2DD4BF |
| CTA | #F97316 |
| Background | #F0FDFA |
| Text | #134E4A |

*Notes: Progress teal + achievement orange*

### Typography
- **Heading:** Fira Code
- **Body:** Fira Sans
- **Mood:** dashboard, data, analytics, code, technical, precise
- **Best For:** Dashboards, analytics, data visualization, admin panels
- **Google Fonts:** https://fonts.google.com/share?selection.family=Fira+Code:wght@400;500;600;700|Fira+Sans:wght@300;400;500;600;700
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');
```

### Key Effects
Inner+outer shadows (subtle, no hard lines), soft press (200ms ease-out), fluffy elements, smooth transitions

### Avoid (Anti-patterns)
- Boring design
- No gamification

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px

