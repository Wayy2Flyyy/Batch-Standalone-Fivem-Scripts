from danielilli_scripts.cli import build_parser, create_greeting


def test_create_greeting_with_name() -> None:
    assert create_greeting("Alice") == "Hello, Alice!"


def test_create_greeting_with_blank_name_defaults_to_world() -> None:
    assert create_greeting("   ") == "Hello, World!"


def test_parser_hello_subcommand() -> None:
    parser = build_parser()
    args = parser.parse_args(["hello", "--name", "Bob"])
    assert args.command == "hello"
    assert args.name == "Bob"
