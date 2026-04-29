import argparse


def build_message(name: str) -> str:
    clean_name = name.strip() or "World"
    return f"Hello, {clean_name}! Welcome to Danielilli Scripts."


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="danielilli-scripts",
        description="Simple standalone script utility.",
    )
    parser.add_argument(
        "--name",
        default="world",
        help="Name to greet (default: world)",
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    print(build_message(args.name))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
