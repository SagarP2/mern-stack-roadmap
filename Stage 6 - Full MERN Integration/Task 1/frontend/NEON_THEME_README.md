# BlogSpace Dark Theme Drop-In

Modern dark-mode system that keeps admin + public areas visually aligned. Follow the checklist to wire it into the existing React + Vite + Tailwind project.

## 1. Tailwind Tokens
- Merge the new `darkMode: "class"` + `extend` block from `tailwind.config.js`.
- Keep your `content` globs intact, then restart Vite (`npm run dev`) so the new tokens compile.

## 2. Global Styles
- `src/index.css` now imports Inter + Poppins, applies dark backgrounds, and defines a `glass-panel` utility. Keep Tailwind directives at the top.
- If you need additional resets, append them inside the `@layer base` block.

## 3. Components
- New components live under `src/components/ui/` (SiteHeader, Sidebar, Button, Input, Modal, StatsCard, PostCard, PostList, SiteLayout, AdminLayout).
- They rely solely on Tailwind classes; no external CSS frameworks required.

## 4. Layouts & Pages
- `SiteLayout` + `AdminLayout` wire in the header/sidebar combos. Use them inside pages under `src/pages/`.
- Sample pages: `Home.jsx` (public hero + post grid) and the refreshed `AdminDashboard.jsx` (stats, posts table, user list).

## 5. Data Fetching
- `AdminDashboard` uses the existing Axios instance (`src/api/axios.js`) with `/admin/*` routes. Replace or mock these endpoints as needed.

## 6. Dark Mode
- Tailwind uses the `class` strategy. Add `<html class="dark">` or implement a toggle to switch themes globally.

## 7. Accessibility & Motion
- All interactive elements include `focus-visible` rings and respect `prefers-reduced-motion`. Card lifts fall back to static surfaces for users who opt out of animation.

Enjoy the blue-on-ink dark aesthetic across both public and admin experiences! Feel free to extend the component set (tables, editors, analytics) following the same token system.

