#!/bin/bash
if [ -f /home/ubuntu/app.pid ]; then
  PID=$(cat /home/ubuntu/app.pid)
  if ps -p $PID > /dev/null; then
    kill $PID
    echo "[ApplicationStop] Proceso $PID detenido"
  fi
  rm /home/ubuntu/app.pid
fi
sudo pkill -f "node app.js" || true
exit 0