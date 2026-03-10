#!/usr/bin/env python3
import paramiko
import sys

host = "187.73.185.27"
port = 30
username = "jurack"
password = input("Enter password: ")

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, port=port, username=username, password=password, timeout=10)
    
    stdin, stdout, stderr = ssh.exec_command("cd /home/geral/saas-landing-page && docker-compose ps && echo '---LOGS---' && docker-compose logs --tail=40")
    
    print(stdout.read().decode())
    print(stderr.read().decode())
    
    ssh.close()
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
