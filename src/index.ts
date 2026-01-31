#!/usr/bin/env bun
import { login } from './login';
import { readConfig, getOrganizations, getUsage, findBestOrg } from './api';
import { displayUsage } from './display';

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
      console.error('No organizations found for this account.');
      process.exit(1);
    }
    
    const usage = await getUsage(config.sessionKey, org.uuid);
    
    displayUsage(org, usage);
    process.exit(0);
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'CONFIG_NOT_FOUND') {
        console.error("No session found. Run 'claude-usage --login' to authenticate.");
      } else if (error.message === 'SESSION_EXPIRED') {
        console.error("Session expired. Run 'claude-usage --login' to re-authenticate.");
      } else if (error.message === 'INVALID_JSON') {
        console.error("Invalid config file. Delete ~/.claude-usage.json and run 'claude-usage --login'.");
      } else if (error.message === 'NETWORK_ERROR') {
        console.error("Network error. Check your internet connection.");
      } else if (error.message.startsWith('API_ERROR')) {
        console.error("API error. Run 'claude-usage --login' to re-authenticate.");
      } else {
        console.error('Error:', error.message);
      }
    } else {
      console.error('An unexpected error occurred.');
    }
    process.exit(1);
  }
}

main();
