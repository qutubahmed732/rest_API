# REST API Project

## Project Purpose

This project is a **REST API** for a Blog Management System. This API provides support for various operations:

- **User Management**: User registration and authentication
- **Blog Management**: Create, delete, and update blogs
- **Category Management**: Manage blog categories

## Technologies Used

### Backend Framework
- **Next.js 16.0.7** - Modern React framework with built-in API routes
- **Node.js with TypeScript** - Type-safe JavaScript runtime

### Database
- **MongoDB** - NoSQL database for storing data
- **Mongoose 9.0.0** - ODM (Object Data Modeling) for MongoDB

### Frontend
- **React 19.2.0** - UI library
- **React DOM 19.2.0** - React rendering for web

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS transformation tool

### Development Tools
- **ESLint** - Code quality and linting
- **TypeScript 5** - Type-safe JavaScript
- **Babel** - JavaScript compiler (including React Compiler)

## Project Structure

``
app/
 api/
    (auth)/users/           # User authentication endpoints
    (dashboard)/
        blogs/              # Blog CRUD operations
        categories/         # Category CRUD operations
 page.tsx                    # Home page
 layout.tsx                  # App layout

lib/
 db.ts                       # Database connection
 modals/
     user.ts                # User schema
     blog.ts                # Blog schema
     category.ts            # Category schema
``

## Getting Started

### Installation

``ash
npm install
``

### Development

``ash
npm run dev
``

Server will run on http://localhost:3000

### Build & Production

``ash
npm run build
npm start
``

### Linting

``ash
npm run lint
``

## API Endpoints

- **Users** - /api/users - User registration and authentication
- **Blogs** - /api/blogs - Blog listing and management
- **Categories** - /api/categories - Category management
