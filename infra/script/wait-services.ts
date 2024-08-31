import { configDotenv } from 'dotenv';
import { expand } from 'dotenv-expand';
import { exec } from 'node:child_process';

expand(configDotenv({ path: '.env' }));

const postgres_db = process.env.DEFAULT_POSTGRES_DB;

waitServices();

function waitServices(attempts = 0) {
  if (attempts === 0) {
    console.log('> Waiting for services to be ready!');
  }
  exec(`docker exec ${postgres_db} pg_isready`, (_error, stdout) => {
    if (!stdout.includes('accepting connections')) {
      process.stdout.write('.');
      return waitServices(attempts + 1);
    }

    console.log('\n> Services are ready!\n');
  });
}
