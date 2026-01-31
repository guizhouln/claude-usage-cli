import { homedir } from 'os';
import { join } from 'path';

// Types
export interface Config {
  sessionKey: string;
}

export interface Organization {
  uuid: string;
  name: string;
  capabilities: string[];
  rate_limit_tier: string;
}

export interface UsageLimit {
  utilization: number;
  resets_at: string;
}

export interface UsageData {
  five_hour?: UsageLimit;
  seven_day?: UsageLimit;
  seven_day_sonnet?: UsageLimit;
  seven_day_opus?: UsageLimit;
}

// Read config
export async function readConfig(): Promise<Config> {
  const configPath = join(homedir(), '.claude-usage.json');
  const file = Bun.file(configPath);
  
  if (!await file.exists()) {
    throw new Error('CONFIG_NOT_FOUND');
  }
  
  const text = await file.text();
  return JSON.parse(text) as Config;
}

// Get organizations
export async function getOrganizations(sessionKey: string): Promise<Organization[]> {
  const response = await fetch('https://claude.ai/api/organizations', {
    headers: {
      'Cookie': `sessionKey=${sessionKey}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('SESSION_EXPIRED');
    }
    throw new Error(`API_ERROR: ${response.status}`);
  }
  
  return response.json();
}

// Get usage for organization
export async function getUsage(sessionKey: string, orgUuid: string): Promise<UsageData> {
  const response = await fetch(`https://claude.ai/api/organizations/${orgUuid}/usage`, {
    headers: {
      'Cookie': `sessionKey=${sessionKey}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('SESSION_EXPIRED');
    }
    throw new Error(`API_ERROR: ${response.status}`);
  }
  
  return response.json();
}

// Find the best organization (prefer claude_max capability)
export function findBestOrg(orgs: Organization[]): Organization | undefined {
  // First try to find org with claude_max capability
  const maxOrg = orgs.find(org => org.capabilities.includes('claude_max'));
  if (maxOrg) return maxOrg;
  
  // Fall back to first org with chat capability
  const chatOrg = orgs.find(org => org.capabilities.includes('chat'));
  if (chatOrg) return chatOrg;
  
  // Fall back to first org
  return orgs[0];
}
