#!/bin/bash
if [ -d /home/ubuntu/app ]; then
  sudo rm -rf /home/ubuntu/app/*
fi
sudo mkdir -p /home/ubuntu/app
sudo chown -R ubuntu:ubuntu /home/ubuntu/app
echo "[BeforeInstall] Directorio limpio y preparado"