# Task 9-a: Overdue Fines & Covers Agent

## Task
Add overdue fines/penalties display + AI book cover generation

## Work Completed

### Part 1: Overdue Fines Display on BorrowedScreen
- Enhanced `/home/z/my-project/src/components/screens/BorrowedScreen.tsx`
- Added `FINE_RATE_PER_DAY = 5.00` constant (₱5.00/day, Philippine Peso)
- Added `formatCurrency()` helper function
- Added `useMemo` derived values: `overdueBooks`, `totalFines`
- **Fines Summary Card**: Red-themed card at top of Active tab (only shows when overdue items exist)
  - AlertTriangle icon
  - Total fines owed in large bold text
  - Number of overdue items
  - Fine rate display
  - "Pay at the circulation desk" note
- **Overdue Fine Badge**: Red badge on each overdue book card with calculated amount
- **Due Soon Warning**: Yellow/amber warning for books with 1-3 days left
- **Fine Accrual Notice**: Info text below overdue items
- **Color-coded left accent borders**: Red for overdue, amber for due-soon, purple for normal
- **Overdue count in stats bar**: Added red dot indicator

### Part 2: AI-Generated Book Covers
- Generated 6 AI book covers using `z-ai image` CLI (864x1152 portrait):
  1. `/home/z/my-project/public/covers/introduction-to-algorithms.png` — algorithm flowcharts
  2. `/home/z/my-project/public/covers/clean-code.png` — minimalist coding theme
  3. `/home/z/my-project/public/covers/deep-learning.png` — neural network visualization
  4. `/home/z/my-project/public/covers/ai-modern-approach.png` — AI/robotics theme
  5. `/home/z/my-project/public/covers/design-patterns.png` — architecture patterns
  6. `/home/z/my-project/public/covers/the-pragmatic-programmer.png` — practical coding theme
- Updated `/home/z/my-project/src/lib/covers.ts`: Added `deep-learning` and `the-pragmatic-programmer`/`pragmatic-programmer` entries to coverMap
- Updated `/home/z/my-project/prisma/seed.ts`: Added `coverImage` field to 6 resource entries
- Re-seeded database successfully

## Files Modified
- `/home/z/my-project/src/components/screens/BorrowedScreen.tsx` — Overdue fines display
- `/home/z/my-project/src/lib/covers.ts` — Added new cover mappings
- `/home/z/my-project/prisma/seed.ts` — Added coverImage fields

## Files Created
- `/home/z/my-project/public/covers/deep-learning.png` — AI-generated cover
- `/home/z/my-project/public/covers/the-pragmatic-programmer.png` — AI-generated cover
- (4 other covers overwritten with new AI-generated versions)

## Lint Status
Zero errors
