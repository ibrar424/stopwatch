import sys
import time


def run_countdown(total_seconds: int) -> None:
    """Run a terminal countdown timer for the given number of seconds."""
    if total_seconds <= 0:
        raise ValueError("Time in seconds must be greater than 0.")

    for remaining in range(total_seconds, -1, -1):
        seconds = remaining % 60
        minutes = (remaining // 60) % 60
        hours = remaining // 3600
        print(f"{hours:02d}:{minutes:02d}:{seconds:02d}")
        if remaining > 0:
            time.sleep(1)

    print("Time's up!")


def main() -> None:
    try:
        raw_input = input("Enter time in seconds: ").strip()
        my_time = int(raw_input)
        run_countdown(my_time)
    except ValueError as err:
        print(f"Invalid input: {err}", file=sys.stderr)
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nCountdown cancelled.")
        sys.exit(0)


if __name__ == "__main__":
    main()
