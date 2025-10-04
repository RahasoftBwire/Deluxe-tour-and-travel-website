#!/bin/bash
# Automated installation script for Deluxe Tour & Travel System
# Run this script on a fresh machine after cloning the repository

echo "==================================="
echo "Deluxe Tour & Travel - Auto Setup"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed!"
    echo "📥 Please install Node.js from: https://nodejs.org/"
    echo "   Download version 22.20.0 or higher"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully!"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully!"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found!"
    echo "📝 Creating sample .env file..."
    cat > backend/.env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/deluxe_tour_travel
JWT_SECRET=change_this_secret_key_in_production_$(date +%s)
JWT_EXPIRE=7d
EOF
    echo "✅ Sample .env file created. Please update with your values!"
    echo ""
fi

echo "==================================="
echo "✅ Installation Complete!"
echo "==================================="
echo ""
echo "📚 Next Steps:"
echo "1. Update backend/.env with your configuration"
echo "2. Start MongoDB (if using local)"
echo "3. Run backend: cd backend && npm run dev"
echo "4. Run frontend: cd frontend && npx http-server -p 3000 -o"
echo ""
echo "🌐 Backend will run on: http://localhost:5000"
echo "🌐 Frontend will run on: http://localhost:3000"
echo ""
echo "📖 For detailed documentation, see REQUIREMENTS.txt"
echo "==================================="
