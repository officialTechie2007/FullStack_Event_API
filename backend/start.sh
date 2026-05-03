#!/bin/bash

# Navigate to the backend directory
cd "$(dirname "$0")"

# Check if venv exists, if not create it
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate the virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install the required dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run the FastAPI server on port 8001 (based on comments in main.py)
echo "Starting the FastAPI backend server..."
uvicorn main:app --reload --port 8001
