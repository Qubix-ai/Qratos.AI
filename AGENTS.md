# Project Rules

## Architecture Constraints
- **Landing Page Integrity**: The `src/components/LandingPage.tsx` and its integration in `App.tsx` are critical brand assets. Do NOT refactor, replace, or modify the landing page structure or styling unless specifically instructed to change its visual design.
- **Navigation Flow**: The application transitions from the Landing Page to the Chat Interface. The Chat Interface must always maintain a visible navigation option (currently "Landing Control") to return to the root landing state.
- **Component Separation**: Keep the landing page as a distinct, full-screen entry point separate from the flex-based sidebar layout of the main app workspace.
