#!/usr/bin/env bash
# hello.sh — example standalone script for Danielilli Scripts.
# Prints a friendly greeting and a short system summary.

set -euo pipefail

main() {
  local name="${1:-friend}"
  printf '\n  Hello, %s! Welcome to Danielilli Scripts.\n\n' "$name"
  printf '  Host:    %s\n' "$(uname -n)"
  printf '  Kernel:  %s %s\n' "$(uname -s)" "$(uname -r)"
  printf '  Shell:   %s\n' "${SHELL:-unknown}"
  printf '  Date:    %s\n\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
}

main "$@"
