#!/bin/bash

# Colors for better readability
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Function to kill processes on a specific port
kill_port() {
  local port=$1
  local pid=$(lsof -ti:$port)
  if [ ! -z "$pid" ]; then
    echo -e "${YELLOW}Killing process on port $port (PID: $pid)${NC}"
    kill -9 $pid 2>/dev/null
    sleep 1
  else
    echo -e "${GREEN}No process running on port $port${NC}"
  fi
}

# Function to handle script termination
cleanup() {
  echo -e "\n${YELLOW}Stopping servers...${NC}"
  if [ ! -z "$BACKEND_PID" ]; then
    echo "Stopping backend server (PID: $BACKEND_PID)"
    kill $BACKEND_PID 2>/dev/null
  fi
  if [ ! -z "$FRONTEND_PID" ]; then
    echo "Stopping frontend server (PID: $FRONTEND_PID)"
    kill $FRONTEND_PID 2>/dev/null
  fi
  echo -e "${GREEN}All servers stopped${NC}"
  exit 0
}

# Register the cleanup function for when the script is terminated
trap cleanup SIGINT SIGTERM

# Stop any existing servers
echo -e "${YELLOW}Checking for existing processes...${NC}"
kill_port 5001  # Backend port
kill_port 3000  # Frontend port
echo -e "${GREEN}All ports cleared${NC}"

# Create necessary directories if they don't exist
echo -e "${YELLOW}Checking required directories...${NC}"
mkdir -p data/uploads
mkdir -p data/results
echo -e "${GREEN}Directory structure verified${NC}"

# Start the backend server
echo -e "\n${YELLOW}Starting backend server on port 5001...${NC}"
cd backend
python3 app.py &
BACKEND_PID=$!
echo -e "${GREEN}Backend server started with PID: $BACKEND_PID${NC}"

# Wait for backend to initialize
echo "Waiting for backend to initialize..."
sleep 3

# Verify backend is running
if curl -s http://localhost:5001/api/health > /dev/null; then
  echo -e "${GREEN}Backend server is running and responding${NC}"
else
  echo -e "${RED}Warning: Backend server may not be running properly${NC}"
  echo "Continuing anyway..."
fi

# Start the frontend server
echo -e "\n${YELLOW}Starting frontend server on port 3000...${NC}"
cd ../frontend
npm start &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend server started with PID: $FRONTEND_PID${NC}"

echo -e "\n${GREEN}===============================================${NC}"
echo -e "${GREEN}Both servers are running:${NC}"
echo -e "${GREEN}Backend: http://localhost:5001${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}===============================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Keep the script running
wait
