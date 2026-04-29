from danielilli_scripts.cli import build_message


def test_build_message_default_name() -> None:
    assert build_message("World") == "Hello, World! Welcome to Danielilli Scripts."


def test_build_message_custom_name() -> None:
    assert build_message("Deploy Team") == "Hello, Deploy Team! Welcome to Danielilli Scripts."
