import type { UsageData, UsageLimit, Organization } from './api';

// Progress bar using Unicode blocks
function progressBar(percentage: number, width: number = 10): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '▓'.repeat(filled) + '░'.repeat(empty);
}

// Format relative time from ISO timestamp
function formatResetTime(isoDate: string): string {
  const resetTime = new Date(isoDate);
  const now = new Date();
  const diffMs = resetTime.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return 'now';
  }
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours >= 24) {
    // Show day and time
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[resetTime.getDay()];
    const hours = resetTime.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${dayName} ${hour12}:00 ${ampm}`;
  }
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  }
  
  return `${diffMinutes}m`;
}

// Format a single usage line
function formatUsageLine(label: string, limit: UsageLimit | undefined): string {
  if (!limit) return '';
  
  const bar = progressBar(limit.utilization);
  const pct = limit.utilization.toString().padStart(3);
  const resetText = formatResetTime(limit.resets_at);
  
  // Pad label to 15 chars for alignment
  const paddedLabel = label.padEnd(15);
  
  return `${paddedLabel}${bar}  ${pct}%   Resets in ${resetText}`;
}

// Get plan name from rate_limit_tier
function getPlanName(tier: string): string {
  if (tier.includes('max_20x')) return 'Max 20x Plan';
  if (tier.includes('max_5x')) return 'Max 5x Plan';
  if (tier.includes('max')) return 'Max Plan';
  if (tier.includes('pro')) return 'Pro Plan';
  return 'Free Plan';
}

// Main display function
export function displayUsage(org: Organization, usage: UsageData): void {
  const planName = getPlanName(org.rate_limit_tier);
  
  console.log(`\nClaude Usage (${planName})\n`);
  
  // Session (5-hour)
  const sessionLine = formatUsageLine('Session (5h)', usage.five_hour);
  if (sessionLine) console.log(sessionLine);
  
  // Weekly (All models)
  const weeklyLine = formatUsageLine('Weekly (All)', usage.seven_day);
  if (weeklyLine) console.log(weeklyLine);
  
  // Weekly Sonnet
  const sonnetLine = formatUsageLine('Weekly (Sonnet)', usage.seven_day_sonnet);
  if (sonnetLine) console.log(sonnetLine);
  
  // Weekly Opus (if available)
  const opusLine = formatUsageLine('Weekly (Opus)', usage.seven_day_opus);
  if (opusLine) console.log(opusLine);
  
  console.log('');
}
