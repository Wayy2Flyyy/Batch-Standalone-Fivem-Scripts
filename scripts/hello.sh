#!/usr/bin/env bash
# Description: Print a colourful hello-world greeting with system info
# Language: bash

set -euo pipefail

echo "============================================"
echo " Hello from Danielilli Scripts!"
echo "============================================"
echo "  Date     : $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "  Hostname : $(hostname)"
echo "  User     : $(whoami)"
echo "============================================"
