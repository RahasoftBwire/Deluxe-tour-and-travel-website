# Deluxe Tour & Travel Website

**Student**: Khalid Abdikarim (BSCCS/2023/67547)  
**Project**: Deluxe Tour and Travel - Web-based Travel Booking Platform

## 📋 Project Overview

A comprehensive web-based travel booking and exploration platform designed to provide users with convenient access to luxurious and affordable travel packages including safaris, beach holidays, international trips, and local getaways.

## 🌟 Key Features

- **Browse & Search Tours**: Filter tours by category, price, destination
- **Real-Time Booking**: Check availability and book instantly
- **Secure Payments**: Stripe and Mpesa integration
- **User Authentication**: Register, login, and manage profile
- **Verified Reviews**: Only booked users can leave reviews
- **Interactive Maps**: Google Maps integration for destinations
- **Admin Panel**: Comprehensive management dashboard
- **Responsive Design**: Works on all devices

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **Payment**: Stripe API, Mpesa API
- **Email**: Nodemailer

### Frontend
- **Markup**: HTML5
- **Styling**: CSS3
- **Scripting**: Vanilla JavaScript
- **Icons**: Font Awesome
- **Maps**: Google Maps API

## 📁 Project Structure

```
Deluxe tour and travel website/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth & validation
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   └── utils/          # Helper functions
│   ├── .env.example        # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   └── server.js           # Entry point
│
├── frontend/
│   ├── admin/              # Admin panel pages
│   ├── css/                # Stylesheets
│   ├── images/             # Image assets
│   ├── js/                 # JavaScript files
│   ├── pages/              # HTML pages
│   └── index.html          # Homepage
│
├── APROVAL.docx
└── Chapter One.docx
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB**
   - Option A: Install locally from https://www.mongodb.com/try/download/community
   - Option B: Use MongoDB Atlas (cloud) - https://www.mongodb.com/cloud/atlas

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

### Installation Steps

#### 1. Install Node.js (If not installed)
- Download the Windows installer from nodejs.org
- Run the installer and follow the prompts
- Restart your terminal/PowerShell
- Verify: `node --version` and `npm --version`

#### 2. Setup Backend

```powershell
# Navigate to backend directory
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\backend"

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file with your configuration
notepad .env
```

#### 3. Configure Environment Variables

Open `.env` and update the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/deluxe_tour_travel
JWT_SECRET=your_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:3000
```

For production, you'll also need to add:
- Cloudinary credentials (for image uploads)
- Stripe API keys (for payments)
- Email configuration (for notifications)
- Google Maps API key

#### 4. Start MongoDB

**If using local MongoDB:**
```powershell
# Start MongoDB service
net start MongoDB
```

**If using MongoDB Atlas:**
- Create a free cluster at mongodb.com/cloud/atlas
- Get your connection string
- Update `MONGODB_URI` in `.env` file

#### 5. Run the Backend Server

```powershell
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

Server should start on: http://localhost:5000

#### 6. Open the Frontend

```powershell
# Navigate to frontend directory
cd "..\frontend"

# Open index.html in your browser
# Or use a live server extension in VS Code
```

## 📝 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/profile      - Get user profile
PUT    /api/auth/profile      - Update profile
```

### Tours
```
GET    /api/tours             - Get all tours
GET    /api/tours/:id         - Get single tour
POST   /api/tours             - Create tour (Admin)
PUT    /api/tours/:id         - Update tour (Admin)
DELETE /api/tours/:id         - Delete tour (Admin)
```

### Bookings
```
GET    /api/bookings          - Get user bookings
POST   /api/bookings          - Create booking
GET    /api/bookings/:id      - Get booking details
PUT    /api/bookings/:id      - Update booking
DELETE /api/bookings/:id      - Cancel booking
```

### Contact
```
POST   /api/contact           - Submit inquiry
GET    /api/contact           - Get inquiries (Admin)
```

## 🧪 Testing

To test the API endpoints:

1. **Using Browser**: Visit http://localhost:5000
2. **Using Postman**: Import the API collection (coming soon)
3. **Using Thunder Client**: VS Code extension for API testing

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP security headers (Helmet)
- CORS configuration
- Rate limiting
- Input validation & sanitization
- XSS protection

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Backend Deployment Options

1. **Heroku**
   ```bash
   heroku create deluxe-tour-api
   heroku config:set NODE_ENV=production
   git push heroku main
   ```

2. **Railway**
   - Connect GitHub repository
   - Configure environment variables
   - Deploy automatically

3. **Vercel** (for serverless)
   ```bash
   vercel deploy
   ```

### Frontend Deployment

1. **Netlify** - Drag and drop frontend folder
2. **Vercel** - Connect Git repository
3. **GitHub Pages** - For static hosting

### Database

- Use **MongoDB Atlas** for cloud database
- Free tier: 512MB storage
- Create cluster and whitelist your IP

## 📊 Project Status

✅ Project structure created  
✅ Backend setup complete  
✅ Frontend homepage complete  
🔄 Database models - In Progress  
⏳ Authentication system - Pending  
⏳ Tours management - Pending  
⏳ Booking system - Pending  
⏳ Payment integration - Pending  
⏳ Admin panel - Pending  

## 🤝 Contributing

This is a student project. For suggestions or improvements:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is developed as part of academic requirements.

## 👨‍💻 Developer

**Khalid Abdikarim**  
Student ID: BSCCS/2023/67547  
Course: Bachelor of Science in Computer Science

## 📞 Support

For questions or issues:
- Email: [Your Email]
- GitHub: [Your GitHub Profile]

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Maps API for location services
- MongoDB documentation
- Express.js community
- Stack Overflow community

---

**Last Updated**: October 4, 2025  
**Version**: 1.0.0
