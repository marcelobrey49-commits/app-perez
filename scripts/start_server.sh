#!/bin/bash
cd /home/ubuntu/app
nohup node app.js > /home/ubuntu/app.log 2>&1 &
echo $! > /home/ubuntu/app.pid
echo "[ApplicationStart] Servidor iniciado con PID $(cat /home/ubuntu/app.pid)"