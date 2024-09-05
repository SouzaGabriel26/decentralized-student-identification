## About

Coming soon...

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
pnpm dev
```

- This command will:
  1. compose up docker conteiner;
  2. wait for conteiner;
  3. run the development server.
