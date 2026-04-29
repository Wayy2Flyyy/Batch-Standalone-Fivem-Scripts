"""Command-line interface for danielilli-scripts."""

from __future__ import annotations

import argparse
import sys


def create_greeting(name: str) -> str:
    """Create a normalized greeting for a provided name."""
    normalized_name = name.strip() or "World"
    return f"Hello, {normalized_name}!"


def build_parser() -> argparse.ArgumentParser:
    """Build and return the top-level CLI parser."""
    parser = argparse.ArgumentParser(prog="danielilli-scripts")
    subparsers = parser.add_subparsers(dest="command")

    hello_parser = subparsers.add_parser("hello", help="Print a greeting")
    hello_parser.add_argument(
        "--name",
        default="World",
        help="Name used in the greeting output.",
    )

    return parser


def run(argv: list[str] | None = None) -> int:
    """Run the CLI and return a process exit code."""
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "hello":
        print(create_greeting(args.name))
        return 0

    parser.print_help()
    return 0


def main() -> None:
    """Entrypoint wrapper that exits with status code from run()."""
    raise SystemExit(run(sys.argv[1:]))
