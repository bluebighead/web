@echo off

REM Start frontend service
echo Starting frontend service...
start cmd /k "cd /d %~dp0 && npm run dev"

REM Wait 2 seconds for frontend to start
echo Waiting for frontend service to start...
timeout /t 2 >nul

REM Start backend service
echo Starting backend service...
start cmd /k "cd /d %~dp0\server && npm run dev"

echo Services started successfully!
echo Frontend service: http://localhost:5173
echo Backend service: http://localhost:3001
echo Press any key to exit...
pause >nul