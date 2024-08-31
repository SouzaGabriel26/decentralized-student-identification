## Sobre

Em breve...

## Como rodar o projeto

> OBS: Para esse projeto localmente, você precisa ter o docker instalado na sua máquina.

#### Se você está rodando o projeto pela primeira vez, cole esse comando no terminal:

```bash
pnpm project:setup
```

- Esse comando irá:
  1. instalar as dependencias do projeto;
  2. subir o conteiner docker;
  3. esperar pelo conteiner;
  4. aplicar as migrations.

#### Para rodar o projeto, cole esse comando no terminal:

```bash
pnpm dev
```

- Esse comando irá:
  1. subir o conteiner docker;
  2. esperar pelo conteiner;
  3. rodar a aplicação
