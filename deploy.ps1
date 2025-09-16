# Flex Living Reviews Dashboard - Deployment Script (PowerShell)
# This script helps deploy both frontend and backend to Vercel

Write-Host "🚀 Flex Living Reviews Dashboard - Deployment Script" -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Vercel CLI is installed
function Test-VercelCLI {
    try {
        $vercelVersion = vercel --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Vercel CLI is installed (Version: $vercelVersion)"
            return $true
        }
    }
    catch {
        Write-Error "Vercel CLI is not installed. Please install it first:"
        Write-Host "npm i -g vercel" -ForegroundColor Yellow
        return $false
    }
}

# Deploy backend
function Deploy-Backend {
    Write-Status "Deploying backend..."
    
    Set-Location "backend"
    
    # Check if vercel.json exists
    if (-not (Test-Path "vercel.json")) {
        Write-Error "vercel.json not found in backend directory"
        exit 1
    }
    
    # Deploy to Vercel
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Backend deployed successfully!"
        Write-Status "Backend URL: https://the-flex-backend.vercel.app"
    }
    else {
        Write-Error "Backend deployment failed"
        exit 1
    }
    
    Set-Location ".."
}

# Deploy frontend
function Deploy-Frontend {
    Write-Status "Deploying frontend..."
    
    Set-Location "frontend"
    
    # Check if vercel.json exists
    if (-not (Test-Path "vercel.json")) {
        Write-Error "vercel.json not found in frontend directory"
        exit 1
    }
    
    # Deploy to Vercel
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Frontend deployed successfully!"
        Write-Status "Frontend URL: https://flex-living-reviews.vercel.app"
    }
    else {
        Write-Error "Frontend deployment failed"
        exit 1
    }
    
    Set-Location ".."
}

# Test deployment
function Test-Deployment {
    Write-Status "Testing deployment..."
    
    # Test backend health
    Write-Status "Testing backend health..."
    try {
        $response = Invoke-WebRequest -Uri "https://the-flex-backend.vercel.app/health" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "Backend health check passed"
        }
        else {
            Write-Warning "Backend health check failed (Status: $($response.StatusCode))"
        }
    }
    catch {
        Write-Warning "Backend health check failed: $($_.Exception.Message)"
    }
    
    # Test frontend
    Write-Status "Testing frontend..."
    try {
        $response = Invoke-WebRequest -Uri "https://flex-living-reviews.vercel.app" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "Frontend is accessible"
        }
        else {
            Write-Warning "Frontend is not accessible (Status: $($response.StatusCode))"
        }
    }
    catch {
        Write-Warning "Frontend is not accessible: $($_.Exception.Message)"
    }
}

# Main deployment process
function Start-Deployment {
    Write-Status "Starting deployment process..."
    
    # Check prerequisites
    if (-not (Test-VercelCLI)) {
        exit 1
    }
    
    # Deploy backend first
    Deploy-Backend
    
    # Wait a moment for backend to be ready
    Write-Status "Waiting for backend to be ready..."
    Start-Sleep -Seconds 10
    
    # Deploy frontend
    Deploy-Frontend
    
    # Wait for frontend to be ready
    Write-Status "Waiting for frontend to be ready..."
    Start-Sleep -Seconds 10
    
    # Test deployment
    Test-Deployment
    
    Write-Success "Deployment completed!"
    Write-Host ""
    Write-Host "🌐 Live URLs:" -ForegroundColor Green
    Write-Host "Frontend: https://flex-living-reviews.vercel.app" -ForegroundColor Cyan
    Write-Host "Backend:  https://the-flex-backend.vercel.app" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Set environment variables in Vercel dashboard"
    Write-Host "2. Configure MongoDB Atlas connection"
    Write-Host "3. Test all functionality"
    Write-Host "4. Monitor deployment logs"
}

# Run main function
Start-Deployment
