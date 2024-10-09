## About

Coming soon...

[Flowchart on how the project is structured](https://app.eraser.io/workspace/xxmg2mphVZfFWwK0kStY?origin=share)

## How to run

> ATTENTION: To run this project locally, you must have docker installed on your machine.

### First, create a .env file based on .env.example

```bash
cp .env.example .env
```

### If you are running the project for the first time, paste this command into your terminal:

```bash
pnpm project:setup
```

- This command will:
  1. install project dependencies;
  2. compose up docker conteiner;
  3. wait for the conteiner up;
  4. run migrations.

#### To run the project, paste this command into your terminal:

```bash
pnpm dev:all
```

- This command will:
  1. start ganache local server (concurrently in terminal)
  2. deploy the smart contract on ganache local server (it will save the contract address in a file)
  3. compose up docker conteiner;
  4. wait for conteiner;
  5. run the development server.
