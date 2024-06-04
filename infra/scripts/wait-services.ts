import { exec } from 'node:child_process';

waitServices();

function waitServices(attempts = 0) {
  if (attempts === 0) {
    console.log('> Waiting for services to be ready...');
  }
  exec('docker exec where-to-go-postgres pg_isready', (_error, stdout) => {
    if (!stdout.includes('accepting connections')) {
      process.stdout.write('.');
      return waitServices(attempts + 1);
    }
    console.log('\n> Services are ready!');
  });
}
