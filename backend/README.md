# Deluxe Tour & Travel - Backend API

Backend API for the Deluxe Tour and Travel booking platform built with Node.js, Express, and MongoDB.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration values

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files (database, etc.)
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware (auth, error handling)
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
├── .env.example        # Example environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js           # Main application file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Tours
- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get single tour
- `POST /api/tours` - Create tour (Admin only)
- `PUT /api/tours/:id` - Update tour (Admin only)
- `DELETE /api/tours/:id` - Delete tour (Admin only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Contact
- `POST /api/contact` - Submit contact form

## 🔒 Environment Variables

See `.env.example` for all required environment variables.

## 👨‍💻 Author

**Khalid Abdikarim**  
BSCCS/2023/67547

## 📝 License

ISC
