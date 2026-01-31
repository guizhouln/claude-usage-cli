#!/usr/bin/env bun
import { login } from './login';
import { readConfig, getOrganizations, getUsage, findBestOrg } from './api';

async function main() {
  const args = Bun.argv.slice(2);
  
  // Handle --login
  if (args.includes('--login') || args.includes('-l')) {
    try {
      await login();
      process.exit(0);
    } catch (error) {
      console.error('Login failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }
  
  // Show usage stats
  try {
    const config = await readConfig();
    const orgs = await getOrganizations(config.sessionKey);
    const org = findBestOrg(orgs);
    
    if (!org) {
      console.error('No organizations found.');
      process.exit(1);
    }
    
    const usage = await getUsage(config.sessionKey, org.uuid);
    
    // Temporary: just log the raw data (formatting in next task)
    console.log(`Organization: ${org.name}`);
    console.log(`Rate limit tier: ${org.rate_limit_tier}`);
    console.log('\nUsage Data:');
    console.log(JSON.stringify(usage, null, 2));
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'CONFIG_NOT_FOUND') {
        console.error("No session found. Run 'claude-usage --login' to authenticate.");
      } else if (error.message === 'SESSION_EXPIRED') {
        console.error("Session expired. Run 'claude-usage --login' to re-authenticate.");
      } else {
        console.error('Error:', error.message);
      }
    }
    process.exit(1);
  }
}

main();
