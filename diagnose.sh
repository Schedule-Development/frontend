#!/bin/bash
set -e

echo "=== DOCKER STATUS ==="
docker ps -a 2>&1 || true
echo ""

echo "=== COMPOSE LOGS ==="
cd /home/geral/saas-landing-page
docker-compose logs --tail=30 2>&1 || true
echo ""

echo "=== PORT CHECK ==="
netstat -tlnp 2>/dev/null | grep -E '(3000|3001)' || echo "No services on 3000/3001"
echo ""

echo "=== CONTAINER INSPECT ==="
docker inspect saas-landing-page 2>&1 | grep -A 10 "State" || echo "Container not found"
echo ""

echo "=== RESTART CONTAINER ==="
docker-compose down 2>&1 || true
sleep 2
docker-compose up -d 2>&1 || true
echo ""

echo "=== NEW STATUS ==="
docker-compose ps
docker-compose logs --tail=20 || true
