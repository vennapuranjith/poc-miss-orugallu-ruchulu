# Project Context: Miss Orugallu Ruchulu Order Management Portal

## Tech Stack
- **Frontend:** React (functional components, hooks, CSS modules or plain CSS)
- **Backend:** Node.js, Express.js
- **Database:** SQL Server (MSSQL)
- **API:** RESTful, JSON

## Coding Conventions

### Frontend
- Use functional components and React hooks (`useState`, `useEffect`, etc.)
- Use `.css` files for styling, with BEM-like class names for consistency.
- Use semantic HTML and ARIA attributes for accessibility.
- Use `fetch` for API calls.
- Use `autoComplete="off"` or custom values to minimize browser autofill.
- Form validation should be done both client-side (JS) and server-side (Express Validator).
- Use context or props for state management (no Redux or external state library unless needed).
- Keep components modular and reusable.

### Backend
- Use `express-validator` for input validation.
- Use async/await for all asynchronous code.
- Use parameterized queries to prevent SQL injection.
- Passwords must be hashed with bcrypt before storing.
- API responses should be JSON and include clear error messages and status codes.
- Use consistent naming for database columns and parameters (match case and spelling).

### Database
- Table and column names use PascalCase (e.g., `Users`, `PasswordHash`).
- All user credentials are stored securely (never plain text).

## UI/UX
- All forms should have clear labels, error messages, and accessible markup.
- Use consistent button and input styles across all pages.
- Responsive design is preferred.

## File/Folder Structure
- `src/pages-of-orugallu/` for main pages (e.g., Signup, Login, Items, Home)
- `src/orugallu-components/` for reusable components (e.g., Navbar, ItemCard, CategoryFilter)
- CSS files are named after their component/page and imported directly.

## General Rules
- Always validate and sanitize user input on both client and server.
- Never expose sensitive information in frontend code or API responses.
- Keep code readable, modular, and well-commented where necessary.

---

**When generating or reviewing code, always follow these guidelines for consistency and security.**