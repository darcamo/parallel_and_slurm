import argparse


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--par1',        type=int, default=400, help="Value of first parameter [default: 400]")
    parser.add_argument('-q', '--par2',    type=int, default=60, help="Value of second parameter [default: 60]")
    args = parser.parse_args()

    print(f"par1: {args.par1}, par2: {args.par2}")
