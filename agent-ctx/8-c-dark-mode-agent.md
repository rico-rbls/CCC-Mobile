# Task 8-c: Add dark mode classes to screens missing them

## Agent: Dark Mode Agent

## Summary
Added comprehensive dark mode Tailwind classes to all 7 screens that were missing them. Applied consistent dark theme following the specified rules: `dark:bg-gray-900` for cards, `dark:bg-gray-950` for pages, `dark:border-gray-800` for borders, `dark:bg-gray-800` for inputs/hover, `dark:text-gray-400` for secondary text.

## Files Modified
1. **BorrowedScreen.tsx** - emerald badge dark variants, View button hover
2. **ProfileScreen.tsx** - chart bars, borders, chevrons, member card, logout button
3. **NotificationsScreen.tsx** - typeConfig dark variants, borders, hovers, empty state
4. **HomeScreen.tsx** - quick actions, library badges, announcement card, status badges, trending
5. **AttendanceScreen.tsx** - Full dark mode (page, header, cards, calendar, legend, visits)
6. **FavoritesScreen.tsx** - Full dark mode (page, header, categories, cards, remove button)
7. **ReservationsScreen.tsx** - Full dark mode (statusConfig, page, header, filters, cards, buttons)

## Lint
Zero errors. Dev server compiles successfully.
