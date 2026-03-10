#!/bin/bash
cd /home/geral/saas-landing-page
echo "=== Container Status ==="
docker compose ps
echo ""
echo "=== Container Logs ==="
docker compose logs --tail=30
echo ""
echo "=== Port Check ==="
netstat -tlnp 2>/dev/null | grep 3001 || echo "Port 3001 not found in netstat"
echo ""
echo "=== Docker Inspect ==="
docker inspect saas-landing-page 2>/dev/null | grep -A 5 "State"
