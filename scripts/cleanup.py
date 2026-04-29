#!/usr/bin/env python3
# Description: Remove common temp files (.log, .tmp, .bak, __pycache__) from /tmp
# Language: python3

import os
import shutil
import glob

TARGET_DIR = "/tmp"
REMOVE_EXTENSIONS = {".log", ".tmp", ".bak", ".cache"}
REMOVE_DIRS = ["__pycache__", ".pytest_cache"]

removed_files = 0
removed_dirs = 0
freed_bytes = 0

print("=" * 44)
print(" Cleanup Script")
print("=" * 44)
print(f"  Target : {TARGET_DIR}")
print("-" * 44)

for root, dirs, files in os.walk(TARGET_DIR):
    # Remove matching directories
    for d in dirs[:]:
        if d in REMOVE_DIRS:
            full = os.path.join(root, d)
            try:
                size = sum(
                    os.path.getsize(os.path.join(dp, f))
                    for dp, _, fs in os.walk(full)
                    for f in fs
                )
                shutil.rmtree(full)
                removed_dirs += 1
                freed_bytes += size
                print(f"  [DIR]  Removed {full}")
                dirs.remove(d)
            except PermissionError:
                print(f"  [SKIP] No permission: {full}")

    # Remove matching files
    for fname in files:
        _, ext = os.path.splitext(fname)
        if ext in REMOVE_EXTENSIONS:
            full = os.path.join(root, fname)
            try:
                size = os.path.getsize(full)
                os.remove(full)
                removed_files += 1
                freed_bytes += size
                print(f"  [FILE] Removed {full}")
            except PermissionError:
                print(f"  [SKIP] No permission: {full}")

print("-" * 44)
print(f"  Files removed : {removed_files}")
print(f"  Dirs  removed : {removed_dirs}")
print(f"  Space freed   : {freed_bytes / 1024:.1f} KB")
print("=" * 44)
