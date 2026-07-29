# Quick Shop

Quick Shop is a full-stack e-commerce demo built with React, TypeScript, Express, and MySQL. The project showcases a modern storefront experience with authentication, a shopping cart, order creation, an admin dashboard, multilingual support, and a polished UI inspired by premium electronics retail.

## Overview

This project was created to demonstrate a complete web application flow from the frontend experience to backend data handling and database integration.

### Key Features
- Modern electronics-style storefront UI
- Product catalog with search and product detail modal
- Shopping cart and checkout flow
- User authentication and role-based access
- Admin dashboard for managing products and orders
- English and French language support
- MySQL-backed product and order storage

## Tech Stack

### Frontend
- React
- TypeScript
- React Scripts
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- MySQL
- JWT authentication
- bcrypt password hashing

## Project Structure

```text
backend/
  src/
    controllers/
    db/
    middleware/
    routes/
    server.ts

frontend/
  src/
    components/
    context/
    pages/
    services/
```

## Deployment Notes
- Vercel deploys the `frontend/` folder.
- Railway deploys the backend from the repository root using `backend/` as the app source.
- The backend reads Railway MySQL variables automatically when they are provided by the platform.

## Installation

### Prerequisites
- Node.js
- MySQL running locally
- npm

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Configuration

Create a .env file in the backend folder with your local MySQL configuration:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=quick_shop
```

## Usage

- Open the frontend in the browser
- Browse the product catalog
- Add products to the cart
- Proceed through the checkout flow
- Log in as an admin or user to explore the dashboards

## Demo Credentials

### Admin
- Email: admin@quickshop.com
- Password: admin123

## Notes

This project is designed as a demo and portfolio piece. It focuses on demonstrating a clean full-stack architecture, strong UI/UX, and practical e-commerce workflows rather than a production-grade payment platform.

## Future Improvements
- Real image upload storage on the server or cloud
- Payment integration with Stripe or PayPal
- Order history and tracking
- Advanced product filters and category pages
- Admin analytics and inventory management
