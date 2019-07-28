import click

@click.command()
@click.option("-p", "--par1", default='400', help="Value of first parameter [default: 400]", type=click.Choice(choices=['400', '500', '600', '700', '800', '900']))
@click.option("-q", "--par2", default='60', help="Value of second parameter [default: 60]")
def print_parameters(par1, par2):
    print(f"par1: {par1}, par2: {par2}")

if __name__ == '__main__':
    print_parameters()
