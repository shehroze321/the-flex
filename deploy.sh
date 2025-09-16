#!/bin/bash

# Flex Living Reviews Dashboard - Deployment Script
# This script helps deploy both frontend and backend to Vercel

echo "🚀 Flex Living Reviews Dashboard - Deployment Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Please install it first:"
        echo "npm i -g vercel"
        exit 1
    fi
    print_success "Vercel CLI is installed"
}

# Deploy backend
deploy_backend() {
    print_status "Deploying backend..."
    
    cd the-flex-backend
    
    # Check if vercel.json exists
    if [ ! -f "vercel.json" ]; then
        print_error "vercel.json not found in backend directory"
        exit 1
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_success "Backend deployed successfully!"
        print_status "Backend URL: https://the-flex-backend.vercel.app"
    else
        print_error "Backend deployment failed"
        exit 1
    fi
    
    cd ..
}

# Deploy frontend
deploy_frontend() {
    print_status "Deploying frontend..."
    
    cd flex-living-reviews
    
    # Check if vercel.json exists
    if [ ! -f "vercel.json" ]; then
        print_error "vercel.json not found in frontend directory"
        exit 1
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_success "Frontend deployed successfully!"
        print_status "Frontend URL: https://flex-living-reviews.vercel.app"
    else
        print_error "Frontend deployment failed"
        exit 1
    fi
    
    cd ..
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Test backend health
    print_status "Testing backend health..."
    curl -s https://the-flex-backend.vercel.app/health > /dev/null
    if [ $? -eq 0 ]; then
        print_success "Backend health check passed"
    else
        print_warning "Backend health check failed"
    fi
    
    # Test frontend
    print_status "Testing frontend..."
    curl -s https://flex-living-reviews.vercel.app > /dev/null
    if [ $? -eq 0 ]; then
        print_success "Frontend is accessible"
    else
        print_warning "Frontend is not accessible"
    fi
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    # Check prerequisites
    check_vercel_cli
    
    # Deploy backend first
    deploy_backend
    
    # Wait a moment for backend to be ready
    print_status "Waiting for backend to be ready..."
    sleep 10
    
    # Deploy frontend
    deploy_frontend
    
    # Wait for frontend to be ready
    print_status "Waiting for frontend to be ready..."
    sleep 10
    
    # Test deployment
    test_deployment
    
    print_success "Deployment completed!"
    echo ""
    echo "🌐 Live URLs:"
    echo "Frontend: https://flex-living-reviews.vercel.app"
    echo "Backend:  https://the-flex-backend.vercel.app"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Set environment variables in Vercel dashboard"
    echo "2. Configure MongoDB Atlas connection"
    echo "3. Test all functionality"
    echo "4. Monitor deployment logs"
}

# Run main function
main
