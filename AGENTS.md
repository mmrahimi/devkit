# DevKit project guide

Read this file before changing the project. It records the product identity and the implementation decisions established while building the first tool, Stacker. Treat these as defaults for future tools unless the user changes them.

## Product identity

- DevKit is a growing collection of focused, practical tools for developers. The home page is the front door to the collection; individual tools are destinations within it.
- Stacker is the first tool, not the whole product. Keep shared site identity and navigation separate from tool-specific experiences so more tools can be added cleanly.
- The project is a hobby product shipped through Vercel. Keep the experience useful, polished, and understandable without adding enterprise complexity.
- The user is learning by building and will review, adjust, and verify the work. Explain decisions plainly when asked; do not turn implementation replies into tutorials.

## Product and interaction principles

- Prefer a clear, direct experience with few controls and little ceremony.
- Preserve existing product behavior when adding another tool. Do not make unrelated product or architecture changes.
- Keep interfaces responsive and usable on narrow and wide screens.
- Make primary actions obvious, use accessible native controls, retain visible keyboard focus, and give failures a clear message.
- Do not add accounts, backend services, databases, analytics, or persistent user data without an explicit product decision.

## Current Stacker decisions

- Show all technology categories together on one scrollable page. There is no wizard, step counter, review screen, live diagram preview, or category search.
- The catalogue is curated and typed in `src/Tools/Stacker/catalogue.ts`. Preserve its order. Add technologies or categories only for a concrete product reason.
- A user can select at most one technology in each category. Clicking the selected option again clears it. Categories are optional, and users can clear the entire selection.
- Keep technology tiles fixed in size. Lay them out from the left and let them wrap naturally; do not center the rows or stretch the tiles to fill a row. Category cards may stretch to match their adjacent card in a grid row.
- Give every technology a recognizable logo or custom illustrated mark. Keep the technology name visible with the mark in the interface and in the exported diagram.
- The completed diagram follows catalogue order, omits empty categories, and connects selected entries with simple arrows. The arrows show sequence, not technical dependencies.
- PNG is the only export format. Generate it in the browser, keep the export-only diagram off-screen, and report export failures clearly.

## Structure and ownership

- `src/App.tsx` chooses the page for the current route. Keep app-level routing small and explicit.
- `src/pages/` contains collection-level pages, including the DevKit home page.
- `src/components/` contains shared site components such as the header.
- Put each tool in `src/Tools/<ToolName>/`, capitalizing the first letter of each tool name. Stacker lives in `src/Tools/Stacker/`.
- `src/Tools/Stacker/pages/` contains the Stacker page. A whole page belongs in `pages`, not in `components`.
- `src/Tools/Stacker/components/` contains reusable Stacker interface pieces.
- `src/Tools/Stacker/catalogue.ts` owns technology and category data and related types.
- `src/Tools/Stacker/selection.ts` owns selection rules, separate from presentation.
- `src/Tools/Stacker/png-export.ts` owns browser-side PNG generation and download behavior.
- Put Stacker tests in `src/Tools/Stacker/tests/`; keep app-level tests beside the app source under `src/`.
- Keep modules focused and readable. Prefer direct imports and small functions over extra layers, generic frameworks, or new state-management libraries.

## Styling and visual identity

- Use Tailwind CSS v4 utility classes in JSX. Do not add custom CSS rules, CSS modules, or a separate styling system.
- `src/index.css` should contain only Tailwind's required import unless the user explicitly changes the no-custom-CSS rule. Global document-level utility classes belong in `index.html` when needed.
- Prefer standard Tailwind utilities and responsive variants over arbitrary bracket values. Use arbitrary values only when the design genuinely needs a value the standard scale cannot express.
- Keep the dark, expressive purple/blue visual identity. Use contrast, typography, spacing, and a restrained glow to add character without clutter.
- Keep decorative elements simple and robust. Avoid large intersecting circles or ornamental shapes that compete with the content.
- Do not sacrifice usability or visual clarity for decorative effects. Preserve the established logo-first technology choice cards and their fixed dimensions.

## Catalogue assets and dependencies

- Use bundled local logo assets. The current catalogue uses Simple Icons where appropriate and custom SVG marks for concepts without a suitable brand logo.
- Never depend on a third-party logo server at runtime. Avoid broken-image states; every technology needs an identifiable mark.
- Prefer existing dependencies and project conventions. Add a dependency or change configuration only when the feature needs it and the simpler existing approach is insufficient.
- Keep TypeScript strictness, lint rules, tests, and CI intact. Do not weaken quality gates to make a change appear complete.

## Tests and collaboration workflow

- Tests are product feature specifications and a key verification step, not coverage targets or a way to make changes look complete. Write a small number of clear feature tests that state what users can do and what outcome they should see.
- Implement behavior to satisfy the intended product rules captured by those tests. Do not relax, rewrite, or delete a meaningful assertion just to get a green result. If a failing test only depends on an implementation detail (such as a CSS class name), replace it with a user-visible behavior assertion; if the feature is actually broken, fix the source.
- When the user asks for verification, run the narrowest relevant feature tests with a bounded command and report the actual result. Do not ask the user to run checks. Do not run broad builds, lint, or manual browser checks unless requested or needed to resolve a concrete issue.
- Never run a command indefinitely. Use bounded commands and stop to reason with the user if a real blocker repeats or an important product decision cannot be inferred.
- Never run a command indefinitely. Use bounded commands and stop to reason with the user if a real blocker repeats or an important product decision cannot be inferred.
- Make authorized, reversible project changes without asking for redundant permission. Do not claim system-wide permissions or imply that code has been deployed or verified when it has not.
- Keep progress and final messages concise. State what changed, the reason, and whether checks were run. When linking project files in chat, use clickable absolute file links.
