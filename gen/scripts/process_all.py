#!/usr/bin/env python3
import glob
import os
import subprocess
import sys


def main():
    current_file = os.path.basename(__file__)

    script_paths = glob.glob(os.path.join(os.path.dirname(__file__), "process_*.py"))

    for script in script_paths:
        script_name = os.path.basename(script)

        if script_name == current_file:
            continue

        print(f"Running: {script_name}")
        try:
            subprocess.run([sys.executable, script], check=True)
        except subprocess.CalledProcessError as e:
            print(f"Error running {script_name}: {e}")


if __name__ == "__main__":
    main()
