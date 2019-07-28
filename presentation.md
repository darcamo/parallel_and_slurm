name: newpart
layout: true
class: center, middle, inverse

---
layout: false

class: center, middle, hide-slide-number, hide-logo
background-image: url(figs/circles.svg)
background-size: cover
background-position: 0 50px
name: title-slide

.titleblock[
# Gnu Parallel and SLURM
]

.authorsblock[
.presenter[Darlan Cavalcante Moreira]

![logo](figs/logo.svg)

&nbsp;

1 de Agosto de 2018
]

.footnote[Criado com [{Remark.js}](http://remarkjs.com/) usando
[{Markdown}](https://daringfireball.net/projects/markdown/) +
[{MathJax}](https://www.mathjax.org/)]


---
template:newpart
# GNU Parallel

---

# O que é o GNU Parallel


- Ferramenta para executar múltiplos comandos/trabalhos em paralelo em um ou mais computadores. 
  - Ele garante que a saída dos comandos seja a mesma que você obteria se
    tivesse executado os comandos sequencialmente

--

![:box happy, Nota](É até mesmo possível utiliza-lo para executar em parallelo uma única tarefa normalmente serial
- Ex: Quebrar um arquivo em múltiplos pedaços e compactar os pedaços em paralelo.)


---

layout:true
# Exemplos

---

## Entrada única

```sh
$ parallel echo ::: A B C
A
B
C
```

A entrada pode ser um arquivo contento `A B C`

```sh
parallel -a abs-file echo
```

![:box moody, Nota](Cada entrada deve estar em uma linha diferente)

---
layout: true
# Exemplos
## Múltiplas entradas

```sh
$ parallel echo ::: A B C ::: D E F
A D
A E
A F
B D
B E
B F
C D
C E
C F
```

ou de um arquivo

---

```sh
$ parallel -a abc-file -a def-file echo
```
---

```sh
$ parallel :::: abc-file :::: def-file echo
```

![:box moody, Nota](Ao invés de `-a` é possível usar `::::`)

---
layout: true
# Exemplos

---
## Linkando os argumentos das entradas

- Em alguns casos não queremos o produto cartesiano das entradas

```sh
$ parallel --link echo ::: A B C ::: D E F
A D
B E
C F
```

- Se alguma entrada é menor seu valor vai repetir

```sh
$ parallel --link echo ::: A B C D E ::: F G
A F
B G
C F
D G
E F
```

---
## Linkando os argumentos das entradas

- É possível utilizar `:::+` e `::::+` para uma linkagem mais flexível

```sh
$ parallel echo ::: A B C :::+ G H I ::: D E F
A G D
A G E
A G F
B H D
B H E
B H F
C I D
C I E
C I F
```

- Se alguma entrada é muito curta quando linkando, o resto será ignorado

```sh
$ parallel echo ::: A B C D E :::+ F G
A F
B G
```

---
layout: true

# Construindo a linha de comando
## Substituição de Strings

---
- `{}` indica onde as entradas devem ser substituídas

.smallcodefont[
```sh
$ parallel echo A entrada '{}' foi passada ::: A/B.C
A entrada A/B.C foi passada
```
]

--

- Usando `{.}` podemos remover a extensão

.smallcodefont[
```sh
$ parallel echo {.} ::: A/B.C
A/B
```
]

--
- Usando `{/}` podemos remover a path

.smallcodefont[
```sh
$ parallel echo {/} ::: A/B.C
B.C
```
]

--
- Usando `{//}` mantemos apenas o path

.smallcodefont[
```sh
$ parallel echo {//} ::: A/B.C
A
```
]

---

- Podemos combinar alguns casos. 
  - Ex: Usando `{/.}` removemos o path e a extensão.

--
- Um caso especial é `{#}`, que nos dá o índice do job 

```sh
$ parallel echo A entrada {} corresponde ao job {#} ::: A B C
A entrada A corresponde ao job 1
A entrada B corresponde ao job 2
A entrada C corresponde ao job 3
```

--
- Temos também `{%}`, que nos dá o "slot" do job

```sh
$ parallel -j 2 echo {%} ::: A B C
1
2
1
```

![:box moody, Nota](Há várias outras possibilidades descritas no tutorial do gnu parallel.)

---
layout: false
# Construindo a linha de comando
## Substituição de Strings por posição

- Podemos indicar a entrada desejada com `{número}`.

```sh
$ parallel echo {1} e {2} ::: A B ::: C D
A e C
A e D
B e C
B e D
```

--
- Uma posição negativa corresponde a entrada de trás pra frente

```sh
$ parallel echo 1={1} 2={2} -1={-1} -2={-2} ::: A B ::: C D
1=A 2=C -1=C -2=A
1=A 2=D -1=D -2=A
1=B 2=C -1=C -2=B
1=B 2=D -1=D -2=B
```

--
![:box moody, Nota](É possível combinar substituição por posição com as substituições anteriores. Ex: `{2/.}`)

---
layout: true

# Usando colunas em um arquivo

---

- Um arquivo de entrada pode conter múltiplas colunas representando múltiplas entradas
- Ex: Considere um arquivo "values.tsv" contento o conteúdo abaixo (colunas separadas por TABs)

```tsv
A	B
1	a
2	b
3	c
```

--
- Podemos usar o arquivo como abaixo especificando `--colsep`

```sh
$ parallel --colsep='\t' echo col1={1}, col2={2} :::: values.tsv
col1=A, col2=B
col1=1, col2=a
col1=2, col2=b
col1=3, col2=c
```

---

- Se a primeira linha contém o cabeçalho de cada coluna, podemos passar o argumento `--header`

```sh
$ parallel --header --colsep='\t' echo col1={A}, col2={B} :::: values.tsv
col1=1, col2=a
col1=2, col2=b
col1=3, col2=c
```

--
![:box happy, Nota](`--header` também funciona com entradas na linha de comando, mas apenas a versão não modificada de `{}` funciona)

<!-- ![:box moody, Nota](Há vários outros tipos de substituições que ficam disponíveis se a opção -->
<!-- `--plus` for passada para o gnu parallel.) -->

```sh
$ parallel --header : echo col1={A}, col2={B} ::: A 1 2 3 :::+ B a b c
col1=1, col2=a
col1=2, col2=b
col1=3, col2=c
```

---
layout: false

# Controlando a saída

- É possível adicionar um prefixo a saída com a opção `--tag`
  - Útil para saber qual entrada foi usada para cada saída

```sh
$ parallel --tag echo Entrada 1={1}, Entrada 2={2} ::: A B :::+ x y
A x	Entrada 1=A, Entrada 2=x
B y	Entrada 1=B, Entrada 2=y
```

--
- Para ver os comandos que serão executados sem executá-los use `--dry-run`

```sh
$ parallel --dry-run echo {} ::: A B C
echo A
echo B
echo C
```

---
layout: true
# Controlando a execução

---

## Número de jobs simultâneos

- Controle o número de jobs simultâneos com `-j/--jobs`
  - O comando abaixo demora aproximadamente 5 segundos para terminar

```sh
$ time parallel -n0 --jobs 3 sleep 5 ::: a b c
parallel -n0 --jobs 3 sleep 5 ::: a b c  0,11s user 0,05s system 3% cpu 5,127 total
```

--

- Com apenas dois jobs o comando demora aproximadamente 10 segundos para terminar

```sh
$ time parallel -n0 --jobs 2 sleep 5 ::: a b c
parallel -n0 --jobs 2 sleep 5 ::: a b c  0,13s user 0,03s system 1% cpu 10,126 total
```

--

![:box moody, Nota](A opção `-n0` indica que zero entradas serão passadas para o comando.)

---

## Delay para início do próximo job

- Com a opção `--delay X` o gnu parallel vai esperar `X` segundos para iniciar o
próximo job.

```sh
$ parallel --delay 2.5 echo Starting {}\;date ::: 1 2 3
Starting 1
seg jul 29 00:49:31 -03 2019
Starting 2
seg jul 29 00:49:33 -03 2019
Starting 3
seg jul 29 00:49:36 -03 2019
```

![:box moody, Nota](Útil se os jobs fazem uso de muito I/O.)

---

## Informação de progresso

- O gnu parallel pode estimar o tempo total para executar todos os jobs 

```sh
$ parallel --eta sleep ::: 1 3 2 2 1 3 3 2 1
```

- Mostrar informações de progresso com `--progress`

```sh
$ parallel --progress sleep ::: 1 3 2 2 1 3 3 2 1
```

- Até mesmo uma barra de progresso

```sh
$ parallel --bar sleep ::: 1 3 2 2 1 3 3 2 1
```

---
## Log de progresso

- `--progress` gera um log dos jobs concluídos até o momento

.monospace[
```sh
$ parallel --joblog /tmp/log exit  ::: 1 2 3 0
$ cat /tmp/log
Seq Host Starttime      Runtime Send Receive Exitval Signal Command
  1   :    1376577364.974 0.008   0    0       1       0      exit 1
  2   :    1376577364.982 0.013   0    0       2       0      exit 2
  3   :    1376577364.990 0.013   0    0       3       0      exit 3
  4   :    1376577365.003 0.003   0    0       0       0      exit 0 
```
]

![:box moody, Nota](O log contém a sequência do job, o host que o executou, o início e o tempo de
execução, a quantidade de dados transferida, o valor de saída do job, o sinal
que matou o job e, por fim, o comando que foi executado.)

---

## Parando a execução e continuando depois

- Com a opção `--resume` junto a `--joblog` podemos o gnu parallel
pode continuar de onde parou.

![:box moody, Nota](Para isso a entrada dos jobs já concluídos não deve mudar.)

--

- Com a opção `--resume-failed` jobs com valor de saída diferente de 0 serão
executados novamente.

--

![:box moody, Nota](Também é possível usar `--retry-failed` para executar os comandos com saída diferente de 1. Nesse caso as entradas são lidas do log.)

---
layout: false

# Execução Remota

- O gnu parallel também pode executar jobs em máquinas com acesso via ssh

- Ex: Considere o comando abaixo

```sh
$ parallel -n0 hostname ";" sleep 3 ::: 1 2 3
darlan-notebook
darlan-notebook
darlan-notebook
```

--
- É possível executar jobs em computadores remotos 

.smallcodefont[
```sh
$ # parallel --sshloginfile servers.txt -n0 hostname ";" sleep 3 ::: 1 2 3
$ parallel -S node01.cluster,node02.cluster,: -n0 hostname ";" sleep 3 ::: 1 2 3
darlan-notebook
node01
node02
```
]

![:box moody, Nota](localhost é representado como `:`)


---
template: newpart

# Python

---
layout: true

# Lendo parâmetros da linha de comando

---

- Python possui a biblioteca padrão[argparse](https://docs.python.org/3/library/argparse.html).

.smallcodefont[
```python
import argparse

if __name__ == "__main__":  # This code is in a 'test_argparse.py' file
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--par1', type=int, default=400, help="Value of first parameter [default: 400]")
    parser.add_argument('-q', '--par2', type=int, default=60, help="Value of second parameter [default: 60]")
    args = parser.parse_args()
    print(f"par1: {args.par1}, par2: {args.par2}")
```
]

```sh
$ python test_argparse.py'
par1: 400, par2: 60
```

```sh
$ python test_argparse.py' -p 10 -q 20
par1: 10, par2: 20
```

---

- Outra opção é a biblioteca [click](https://click.palletsprojects.com/en/7.x/quickstart/), que pode ser instalada via conda ou pip.


```python
import click

@click.command()
@click.option("-p", "--par1", default=400, help="Value of first parameter [default: 400]")
@click.option("-q", "--par2", default=60, help="Value of second parameter [default: 60]")
def print_parameters(par1, par2):
    print(par1, par2)

if __name__ == '__main__':
    print_parameters()
```


```sh
$ python test_click.py
par1: 400, par2: 60
```

```sh
$ python test_click.py -p 10 -q 20
par1: 10, par2: 20
```

---
layout: true

# Exemplo Prático

---

- Considere o exemplo abaixo.


```python
def run_mlp_grid_search(num_ues, balanced, pkt_size):
    """
    Fit several mlp models using GridSearchCV, keep the best and save classification 
    report to a json file.
    
    Parameters
    ----------
    num_ues : int
        The desired number of UEs. Must be one of [400, 500, ..., 900]
    balanced : bool
        Perform balancing of the classes by dropping samples from class with more samples.
    pkt_size : int
        Desired packet size. Must be either 8000 or 12000.
    """
    # Code that can take from 5 seconds to 30 minutes dependeing on the chosen scenario
    pass
```


- Queremos simular para todas as configurações de parâmetros. Total de `6 * 2 * 2
= 24` cenários

---

## Passo 1: Adaptar run_mlp_grid_search

- usando a biblioteca `click` precisamos apenas adicionar alguns decorators

.smallcodefont[
```python
@click.command()
@click.option("--num_ues", type=click.Choice(choices=['400', '500', '600', '700', '800', '900']), help="Number of users")
@click.option("--balanced/--not-balanced", default=False)
@click.option("--pkt_size", type=click.Choice(['8000', '12000']), help="The packet size in bits. Valid values are 8000 and 12000. Default is [8000, 12000].")
def run_mlp_grid_search(num_ues, balanced, pkt_size):
    if isinstance(num_ues, str):
        num_ues = int(num_ues)

    if isinstance(pkt_size, str):
        pkt_size = int(pkt_size)

    # Code that can take from 5 seconds to 30 minutes dependeing on the chosen scenario
    pass
    

if __name__ == '__main__':
    run_mlp_grid_search()
```
]

![:box moody, Nota](`click.Choice` só aceita uma lista de strings)

---

## Rodando na nossa máquina

![:box moody, Nota](Assuma que código está em um arquivo chamado `myscript.py`)

### Caso 1: Rodar de maneira serial

- Se um único job quer usar todos os processadores é melhor rodar cada job
  sequencialmente

.smallcodefont[
```sh
parallel --jobs 1 --joblog parallel_log.txt --resume python myscript.py --num_ues {1} --{2} --pkt_size {3} \
         ::: {400..900..100} ::: balanced not-balanced ::: 8000 12000
```
]

### Caso 2: Rodar em paralelo

- Se cada job só usa um processador, melhor rodar vários em paralelo

.smallcodefont[
```sh
parallel --joblog parallel_log.txt --resume python myscript.py --num_ues {1} --{2} --pkt_size {3} \
         ::: {400..900..100} ::: balanced not-balanced ::: 8000 12000
```
]

---
## Arquivo de log gerado

- O arquivo `parallel_log.txt` contém o seguinte conteúdo

.verysmallcodefont[.monospace[
```sh
Seq Host Starttime      JobRuntime Send Receive Exitval Signal Command
1   :    XXX.309      4.818 0    634     0       0      python myscript.py --num_ues 400 --balanced --pkt_size 8000
2   :    XXX.379     21.069 0    633     0       0      python myscript.py --num_ues 400 --balanced --pkt_size 12000
3   :    XXX.970   1670.964 0    637     0       0      python myscript.py --num_ues 400 --not-balanced --pkt_size 8000
4   :    XXX.445    486.587 0    634     0       0      python myscript.py --num_ues 400 --not-balanced --pkt_size 12000
5   :    XXX.582      6.762 0    635     0       0      python myscript.py --num_ues 500 --balanced --pkt_size 8000
6   :    XXX.876    411.998 0    633     0       0      python myscript.py --num_ues 500 --balanced --pkt_size 12000
7   :    XXX.392    650.898 0    633     0       0      python myscript.py --num_ues 500 --not-balanced --pkt_size 8000
8   :    XXX.797   1130.472 0    633     0       0      python myscript.py --num_ues 500 --not-balanced --pkt_size 12000
9   :    XXX.812      6.705 0    633     0       0      python myscript.py --num_ues 600 --balanced --pkt_size 8000
10  :    XXX.418    589.785 0    633     0       0      python myscript.py --num_ues 600 --balanced --pkt_size 12000
11  :    XXX.737    276.677 0    633     0       0      python myscript.py --num_ues 600 --not-balanced --pkt_size 8000
12  :    XXX.937    965.874 0    633     0       0      python myscript.py --num_ues 600 --not-balanced --pkt_size 12000
13  :    XXX.320    244.995 0    634     0       0      python myscript.py --num_ues 700 --balanced --pkt_size 8000
14  :    XXX.861    376.037 0    636     0       0      python myscript.py --num_ues 700 --balanced --pkt_size 12000
15  :    XXX.431    856.713 0    632     0       0      python myscript.py --num_ues 700 --not-balanced --pkt_size 8000
16  :    XXX.663    934.269 0    633     0       0      python myscript.py --num_ues 700 --not-balanced --pkt_size 12000
17  :    XXX.438   1129.496 0    634     0       0      python myscript.py --num_ues 800 --balanced --pkt_size 8000
18  :    XXX.475    272.491 0    637     0       0      python myscript.py --num_ues 800 --balanced --pkt_size 12000
19  :    XXX.493   1084.332 0    634     0       0      python myscript.py --num_ues 800 --not-balanced --pkt_size 8000
20  :    XXX.340   1022.843 0    634     0       0      python myscript.py --num_ues 800 --not-balanced --pkt_size 12000
21  :    XXX.733    811.157 0    633     0       0      python myscript.py --num_ues 900 --balanced --pkt_size 8000
22  :    XXX.427    192.792 0    633     0       0      python myscript.py --num_ues 900 --balanced --pkt_size 12000
23  :    XXX.743   1248.435 0    633     0       0      python myscript.py --num_ues 900 --not-balanced --pkt_size 8000
24  :    XXX.688    922.022 0    635     0       0      python myscript.py --num_ues 900 --not-balanced --pkt_size 12000
```
]]

![:box moody, Nota](`XXX` na coluna `Starttime` é um número grande que foi substituído por `XXX` para reduzir o espaço.)

---
template: newpart

# SLURM

---
layout: false
# Jobs, tasks e steps

- Um job consistem em um ou mais steps, cada um podendo consistir de uma ou mais tasks

--
- Jobs são tipicamente criados com o comando `sbatch`
  - O job é mostrado com seu jobID na saída do comando `squeue`
  
--
- Steps são criados com o comando `srun` (dentro de um job submetido com sbatch)

--
- Tasks são solicitadas (em um job ou em um step) com `--ntasks`
  - O número de tasks pode ser entendido como `o número de processos` disparado pelo srun
  - CPUs são requeridas por task com `--cpus-per-task`

![:box moody, Nota](Jobs submetidos com sbatch tem um step implícito: o script bash que foi submetido)

![:box moody, Nota](Utilize o comando `squeue -s -j JOBID` para ver os steps de um job)

---
layout: true 
# O caso mais simples

- O script abaixo corresponde a um job com que contém um step e esse step roda
  apenas uma task

---

```sh
#!/bin/bash

# Job Parameters
#SBATCH --mem=2000M
#SBATCH --time=02:00:00
#SBATCH --partition=GTEL

echo "Job started at $(date)"
/opt/anaconda3/bin/python my_script.py
echo "Job ended at $(date)"
```

---

```sh
#!/bin/bash

# Job Parameters
#SBATCH --mem=2000M
#SBATCH --time=02:00:00
#SBATCH --partition=GTEL

echo "Job started at $(date)"
 `srun` /opt/anaconda3/bin/python my_script.py  # Criamos um step
echo "Job ended at $(date)"
```

- Agora temos um step explícito

![:box moody, Nota](Em geral o ideal é utilizarmos `srun` para cada tarefa no shell script)


---
layout: true

# Um job com vários steps

---

- Cada step pode rodar scripts diferentes ...

.smallcodefont[
```sh
#!/bin/bash

#SBATCH --mem=2000M
#SBATCH --time=02:00:00
#SBATCH --partition=GTEL

srun /opt/anaconda3/bin/python my_script.py  # Criamos um step
srun /opt/anaconda3/bin/python my_script2.py  # Criamos um step
srun /opt/anaconda3/bin/python my_script3.py  # Criamos um step
```
]

--

ou o mesmo script com entradas diferentes

.smallcodefont[
```sh
#!/bin/bash

#SBATCH --mem=2000M
#SBATCH --time=02:00:00
#SBATCH --partition=GTEL

srun /opt/anaconda3/bin/python my_script.py -p arg1 -q arg2
srun /opt/anaconda3/bin/python my_script.py -p arg1_other -q arg2_other
srun /opt/anaconda3/bin/python my_script.py -p arg1_another -q arg2_another
```
]

---

- Mas esses steps são executados de maneira serial
  - E se quisermos que eles rodem ao mesmo tempo?

--

![:box happy, Nota](Queremos rodar várias tarefas ao mesmo tempo!)

--

```sh
#!/bin/bash

#SBATCH --mem=2000M
#SBATCH --time=02:00:00
#SBATCH --partition=GTEL
#SBATCH --ntasks=3

PYTHON=/opt/anaconda3/bin/python

echo "Job started at $(date)"
srun -n 1 $PYTHON my_script.py -p arg1 -q arg2 `&`
srun -n 1 $PYTHON my_script.py -p arg1_other -q arg2_other `&`
srun -n 1 $PYTHON my_script.py -p arg1_another -q arg2_another `&`
echo "Job ended at $(date)"

 `wait`
```

???

- Cada `srun` utiliza os mesmos valores do job e por isso precisamos especificar
  o número de tasks de cada `srun` como 1 para que os 3 possam rodar ao mesmo
  tempo.

---

## Usando o GNU Parallel para criar s steps

- Podemos usar o gnu parallel para criar os diversos steps que rodam ao mesmo tempo

```sh
#!/bin/bash

#SBATCH --mem=2000M
#SBATCH --time=02:00:00
#SBATCH --partition=GTEL
#SBATCH --ntasks=3

PYTHON=/opt/anaconda3/bin/python

echo "Job started at $(date)"
parallel `--jobs 3` srun -n 1 $PYTHON my_script.py -p {1} -q {2} \
             ::: arg1 arg1_other arg1_another :::+ arg2 arg2_other arg2_another
echo "Job ended at $(date)"
```

![:box moody, Nota](Indicamos para o gnu parallel o número de jobs simultâneos)

---

template: newpart

# Casos típicos

---

layout: true

# Casos Típicos
 
---

## Um programa que usa MPI

- N CPUs para rodar N processos MPI

```sh
#!/bin/bash

#SBATCH ...
#SBATCH --ntasks=`N`

echo "Job started at $(date)"
 `srun` ./myprog  # srun pode ser usado no lugar do mpirun
                         # Note que o srun vai usar --ntasks=N
echo "Job ended at $(date)"
```

--

.auto-left-right-margin[
| Você quer                                                     | Você pede                        |
| :--                                                           | :--                              |
| N CPUs                                                        | --ntasks=N                       |
| N CPUs espalhadas em nós distintos                            | --ntasks=N --nodes=N             |
| O mesmo que acima, mas sem mais ninguém nos nós &nbsp; &nbsp; | --ntasks=N --nodes=N --exclusive |
| N CPUs espalhadas em N/2 nós                                  | --ntasks=N --ntasks-per-node=2   |
| N CPUs no mesmo nó                                            | --ntasks=N --ntasks-per-node=N   |
]

---

## Um programa que usa múltiplas threads

- N CPUs para rodar N processos ou threads no mesmo nó
  - Ex: OpenMP, PThreads, TBB, .angry.alert[python multiprocessing], etc

```sh
#!/bin/bash

#SBATCH ...
#SBATCH --cpu-per-task=`N`

export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK

echo "Job started at $(date)"
 `srun` ./myprog  # myprog usa openmp para rodar usando N threads
echo "Job ended at $(date)"
```

![:box moody, Nota](Perceba o uso da variável `SLURM_CPUS_PER_TASK`)

--

.auto-left-right-margin[
| Você quer                              | Você pede        |
| :--                                    | :--              |
| N CPUs para rodar N theads no mesmo nó &nbsp; &nbsp; | --cpu-per-task=N |
]

---

## Um programa tipo master/slaves

- N CPUs para rodar N processos ou threads no mesmo nó
  - Ex: MATLAB com multicore

```sh
#!/bin/bash

#SBATCH ...
#SBATCH --ntasks=N

echo "Job started at $(date)"
srun --multi-prog multi.conf  # multi.conf é um arquivo de texto
echo "Job ended at $(date)"
```

```txt
# Arquivo multi.conf para o parâmetro --multi-prog
0: ./master
1-7: ./slave
```

.auto-left-right-margin[
| Você quer                                                          | Você pede                       |
| :--                                                                | :--                             |
| N CPUs para rodar N processos ou threads no mesmo nó &nbsp; &nbsp; | --ntasks=N ---ntasks-per-node=N |
]

---

## Simulações independentes

- N CPUs para rodar N jobs completamente independentes
  - Ex: Rodar o mesmo programa variando p/ diferentes entradas

```sh
#!/bin/bash

#SBATCH ...
#SBATCH --array=1-N

echo "Job started at $(date)"
srun ./myprog $SLURM_TASK_ARRAY_ID
echo "Job ended at $(date)"
```

- Usamos a variável $SLURM_TASK_ARRAY_ID para distinguir a entrada 

--

![:box angry, Nota](Quando usar um job array vs um job com vários steps em paralelo?)

---


## Simulações independentes

- Quando cada job demora pouco tempo (~30 minutos ou menos)
  - É melhor suar um único job com vários steps -> menor overhead no slurm
    
<!-- <https://stackoverflow.com/questions/57206237/difference-in-slurm-job-array-and-job-step-performance> -->

```sh
#! /bin/bash
#
#SBATCH --ntasks=8
for i in {1..1000}
do
  # --exclusive significa que o step só vai rodar quando tiver recursos livres
  srun -n1 --exclusive ./myprog $i &
done
wait
```

--
- Pode usar o gnu parallel para criar os steps

```sh
#! /bin/bash
#
#SBATCH --ntasks=8
parallel --jobs $SLURM_NTASKS srun -n1 --exclusive ./myprog ::: {1..1000}
```

---

## Jobs híbridos

- Também é possível rodar várias tasks onde cada task usa vários processadores
- Ex: MPI com 8 processos, onde cada processo usa OpenMP para paralelizar em 4
  theads

```sh
#! /bin/bash
#
#SBATCH --ntasks=8
#SBATCH --ncpus-per-task=4
export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK
srun ./myprog
```

--

- Até mesmo um job array de jobs híbridos

```sh
#! /bin/bash
#
#SBATCH --ntasks=8
#SBATCH --ncpus-per-task=4
#SBATCH --array=1-10
export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK
srun ./myprog $SLURM_TASK_ARRAY_ID
```

---

## Muitas tarefas de pequena duração

<!-- - Caso precise rodar várias tarefas de curta duração (em torno de meia hora), -->
<!--   use um job com vários steps -->
- Ex: Rodar 1000 tarefas de curta duração, cada uma usando 8 processadores, mas
  vamos ser cavalheiros e usar apenas 15 nós (cada nó possuindo 8 processadores)

```sh
#! /bin/bash
#
#SBATCH --ntasks=15
#SBATCH --cpus-per-task=8

SRUN_ARGS="-n1 -c $SLURM_CPUS_PER_TASK --exclusive"
PARALLELARGS="--jobs $SLURM_NTASKS"

parallel $PARALLELARGS srun $SRUN_ARGS ./myprog ::: {1..1000}
```

---
## Poucas tarefas de longa duração

- Nesse caso é melhor submeter múltiplos jobs
  - Podemos usar a opção "--wrap" do comando `sbatch` ao invés de criar um
    script de submissão
 
O script abaixo
 
```sh
#! /bin/bash
#
#SBATCH --ncpus-per-task=4
export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK
srun ./myprog
```

equivale a

```sh
$ export OMP_NUM_THREADS=4
$ sbatch --ntasks=8 --ncpus-per-task=4 --wrap "./myprog"
```

---

## Poucas tarefas de longa duração

![:box moody, Nota](O gnu parallel é muito útil nesse caso)

O comando

```sh
parallel sbatch ... --wrap \"./myprog {1} {2}\" ::: {1..3} ::: A B
```

--
equivale a 

```sh
sbatch ... --wrap "./myprog 1 A"
sbatch ... --wrap "./myprog 1 B"
sbatch ... --wrap "./myprog 2 A"
sbatch ... --wrap "./myprog 2 B"
sbatch ... --wrap "./myprog 3 A"
sbatch ... --wrap "./myprog 3 B"
```

--
![:box happy,Dica, Nota](Utiliza a opção --dryrun do gnu parallel para ver se está tudo certo)

---
layout: false

# Comandos úteis no slurm


.auto-left-right-margin.extra-top-bottom-margin[
| Comando     | Opção                      | Descrição                                                             |
| :--         | :--                        | :--                                                                   |
| **squeue**  |                            | **Mostra informações dos jobs na fila do slurm**                      |
|             | -s                         | Mostra os steps de um job                                             |
|             | -u USER_NAME &nbsp; &nbsp; | Mostra apenas jobs do usuário USER_NAME                               |
|             | -j JOB_ID                  | Mostra apenas o job especificado (combine som "-s" para ver os steps) |
| **sinfo**   |                            | **Mostra informações do cluster (nós e partições, etc)**              |
|             | -T                         | Mostra informações das reservas (se houver alguma)                    |
| **scancel** |                            | **Usado para cancelar jobs sobre controle do slurm**                  |
|             | JOB_ID                     | Cancela o job com id JOB_ID                                           |
|             | -u USER_NAME               | Cancela todos os jobs do usuário USER_NAME                            |
|             | -n JOB_NAME                | Cancela o job com nome JOB_NAME                                       |
|             | -t PENDING                 | Cancela apenas os jobs com estado PENDING                             |
]

<!-- TODO: scontrol -->

---


# Algumas variáveis de ambiente

- O slurm seta o valor de várias variáveis de ambiente. Abaixo algumas das
  principais.

.auto-left-right-margin.extra-top-bottom-margin[
| Variável                             | Descrição                         |
| :--                                  | :--                               |
| `SLURM_CPUS_PER_TASK`                | Número de CPUs por tarefa         |
| `SLURM_NTASKS`                       | Número de tarefas do job          |
| `SLURM_NNODES`                       | Número de nós alocados para o job |
| `$SLURM_TASK_ARRAY_ID` &nbsp; &nbsp; | ID da task em um job array        |
]

![:box happy, Dica, Nota](
- Crie um job iterativo com o comando </br>`srun -n 3 -c 2 --pty bash`
- No prompt do job, excreva `echo $SLURM_` e aperte `TAB` para completar as
  variáveis disponíveis)


---
class: middle, center, hide-slide-number, hide-logo

# Dúvidas?


Apresentação disponível em</br>
<https://darcamo.github.io/parallel_and_slurm/>


![:qrcode](https://darcamo.github.io/parallel_and_slurm/)


.contactblock[
.presenter[Darlan Cavalcante Moreira: [darlan@gtel.ufc.br](mailto:darlan@gtel.ufc.br)]<br />
.home[GTEL - Wireless Telecom Research Group]<br />
.webpage[https://www.gtel.ufc.br]<br />
.location[Fortaleza, Brazil]
]


<!-- # Outras dicas -->

<!-- - Use bat no lugar de cat -->
<!--   - Adicione "alias cat='bat'" no arquivo de inicialização do seu shell -->
<!-- - Usar o gnu parallel para executar o mesmo comando em vários servidores -->
<!--   - Veja em <http://www.elsotanillo.net/2015/05/a-quick-and-neat-orchestrator-using-gnu-parallel/> -->




<!-- Local Variables: -->
<!-- ispell-local-dictionary: "brasileiro" -->
<!-- End: -->

<!-- LocalWords: Remark Markdown MathJax middle class true inverse name animated jackInTheBox title subtitle author Parallel and SLURM nbsp titlepagebody institution date footnote sh parallel echo abs def linkando linkagem path job slot TABs colsep header tag dry run js jobs sleep pip newpart template moody col user system cpu delay monospace joblog exit host failed retry -->
