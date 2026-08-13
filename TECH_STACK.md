# Tech Stack

This document details the technologies, frameworks, and libraries used to build the Airbnb clone.

## 1. Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
  - Utility-first CSS framework used for rapid, responsive UI development.
  - Custom design tokens (colors, spacing, radii) configured in `tailwind.config.ts`.
- **Icons**: `lucide-react` or `react-icons` for scalable vector icons.
- **Date Handling**: `date-fns` for calendar logic and date formatting.
- **State Management**: React Hooks (useState, useContext) for local state; minimal global state required.
- **Data Fetching**: Native `fetch` API or `axios`.

## 2. Backend
- **Framework**: FastAPI (Python)
  - High performance, async-capable web framework for building APIs.
- **Language**: Python 3.10+
- **Server**: Uvicorn (ASGI web server implementation for Python).
- **ORM**: SQLAlchemy
  - SQL toolkit and Object-Relational Mapping library for Python.
- **Data Validation**: Pydantic
  - Data parsing and validation using Python type hints (native to FastAPI).

## 3. Database
- **Engine**: SQLite
  - Lightweight, disk-based database requiring no separate server process. Ideal for development and this specific assignment scope.

## 4. Tooling & Architecture
- **Version Control**: Git / GitHub
- **Package Managers**: `npm` (Frontend), `pip` (Backend)
- **Code Formatting**: Prettier (Frontend), Black/Ruff (Backend - Optional)
