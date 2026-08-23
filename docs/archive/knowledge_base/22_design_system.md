# 22 - DESIGN SYSTEM

The STOCKSEE design system is intentionally crafted to mimic high-end financial tools (Bloomberg Terminal, Koyfin) while remaining accessible to retail investors (Robinhood).

## Typography
- **Primary Font**: `Inter` (sans-serif). Highly legible for data-dense tables.
- **Monospace Font**: `JetBrains Mono` or `Roboto Mono`. Used strictly for numbers, prices, and tickers to ensure vertical alignment in tables.

## Color Palette
- **Background (Dark Mode)**: `#09090b` (Deep Zinc). Reduces eye strain during extended trading sessions.
- **Card Backgrounds**: `#18181b` (Zinc 900) with a `1px` border of `border-border/50` to create subtle separation.
- **Bullish (Up)**: `#10b981` (Emerald 500).
- **Bearish (Down)**: `#ef4444` (Red 500).
- **Primary Accent**: `#3b82f6` (Blue 500). Used for primary buttons and active navigational states.

## Spacing & Layout
- Relies heavily on Tailwind's default spacing scale (`p-4`, `m-2`, `gap-4`).
- **Grid Systems**: Dashboards utilize CSS Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) to seamlessly reflow from desktop multi-monitor setups down to mobile web apps.

## UI Philosophy (Glassmorphism & Transparency)
- The UI leverages semi-transparent backgrounds with backdrop blur (`bg-background/80 backdrop-blur-md`) for topbars and sidebars. This gives the app a feeling of depth and premium quality.
- **Data Density**: Financial apps require high data density. shadcn/ui components (like Tables and Tooltips) are customized to have slightly smaller padding than standard SaaS apps to fit more data on screen.

## Consistency & Accessibility
- **Consistency**: All cards utilize the `<Card>` primitive from shadcn, ensuring border radius (`rounded-xl`) and shadow depths are universally identical.
- **Accessibility**: Radix UI (the engine behind shadcn) handles ARIA labels, keyboard navigation, and focus trapping natively.
