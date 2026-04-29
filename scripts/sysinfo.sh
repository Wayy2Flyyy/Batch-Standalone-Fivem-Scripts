#!/usr/bin/env bash
# Description: Display key system information (OS, CPU, memory, disk, network)
# Language: bash

set -euo pipefail

hr() { printf '%-44s\n' '' | tr ' ' '-'; }

echo "============================================"
echo " System Information"
hr

# OS
if [[ -f /etc/os-release ]]; then
  . /etc/os-release
  echo "  OS       : $PRETTY_NAME"
else
  echo "  OS       : $(uname -s) $(uname -r)"
fi
echo "  Kernel   : $(uname -r)"
echo "  Arch     : $(uname -m)"
echo "  Hostname : $(hostname)"
echo "  Uptime   : $(uptime -p 2>/dev/null || uptime)"

hr

# CPU
CPU_MODEL=$(grep -m1 'model name' /proc/cpuinfo 2>/dev/null | cut -d: -f2 | xargs || echo "N/A")
CPU_CORES=$(nproc 2>/dev/null || echo "N/A")
echo "  CPU      : $CPU_MODEL"
echo "  Cores    : $CPU_CORES"

hr

# Memory
if command -v free &>/dev/null; then
  MEM_TOTAL=$(free -h | awk '/^Mem:/ {print $2}')
  MEM_USED=$(free -h  | awk '/^Mem:/ {print $3}')
  echo "  Memory   : ${MEM_USED} used / ${MEM_TOTAL} total"
fi

hr

# Disk
echo "  Disk usage (top mounts):"
df -h --output=target,size,used,avail,pcent 2>/dev/null | grep -v 'tmpfs\|udev\|Filesystem' | head -5 | while read -r line; do
  echo "    $line"
done

hr
echo " Done."
echo "============================================"
