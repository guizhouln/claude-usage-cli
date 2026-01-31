import { chromium } from 'playwright';
import { homedir } from 'os';
import { join } from 'path';

export async function login(): Promise<void> {
  console.log('Opening Claude.ai login page...');
  console.log('Please log in using the browser window.\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://claude.ai/login');
  
  // Wait for login success (URL changes from /login) - 5 minutes timeout
  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: 300000
  });
  
  // Extract sessionKey cookie
  const cookies = await context.cookies('https://claude.ai');
  const sessionCookie = cookies.find(c => c.name === 'sessionKey');
  
  if (!sessionCookie) {
    await browser.close();
    throw new Error('Could not find sessionKey cookie after login');
  }
  
  // Save to config file
  const configPath = join(homedir(), '.claude-usage.json');
  await Bun.write(configPath, JSON.stringify({ sessionKey: sessionCookie.value }, null, 2));
  
  await browser.close();
  console.log('Login successful! Session saved to ~/.claude-usage.json');
}
