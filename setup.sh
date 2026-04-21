#!/bin/bash

echo "SmartSeason Field Monitoring System - Setup Script"
echo "==================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Setup Backend
echo "Setting up Backend..."
cd backend
if [ -f ".env" ]; then
    echo "  .env already exists"
else
    echo "  Creating .env from example..."
    cp .env.example .env
fi

echo "  Installing dependencies..."
npm install > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Backend setup complete"
else
    echo "✗ Backend setup failed"
    exit 1
fi

cd ..
echo ""

# Setup Frontend
echo "Setting up Frontend..."
cd frontend
echo "  Installing dependencies..."
npm install > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Frontend setup complete"
else
    echo "✗ Frontend setup failed"
    exit 1
fi

cd ..
echo ""

echo "==================================================="
echo "✓ Setup Complete!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Then visit http://localhost:3000 in your browser"
echo ""
echo "Demo Credentials:"
echo "  Admin:  admin@smartseason.com / admin123"
echo "  Agent:  agent@smartseason.com / agent123"
echo ""
