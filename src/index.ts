#!/usr/bin/env bun
import { login } from './login';

async function main() {
  const args = Bun.argv.slice(2);
  
  if (args.includes('--login') || args.includes('-l')) {
    try {
      await login();
      process.exit(0);
    } catch (error) {
      console.error('Login failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }
  
  // TODO: Show usage stats (will be implemented in next task)
  console.log('Usage display coming soon. Run with --login to authenticate first.');
}

main();
