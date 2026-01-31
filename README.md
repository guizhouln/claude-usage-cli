# Claude Usage CLI

View your Claude.ai usage limits directly from the terminal.

## Installation

```bash
# Clone or navigate to the project
cd ~/projects/claude-usage

# Install dependencies
bun install

# Link globally (optional)
bun link
```

## Quick Start

### 1. Login (first time only)

```bash
claude-usage --login
```

This opens a browser window. Log in to Claude.ai as usual (Google, email, etc.).
After successful login, your session is automatically saved.

### 2. Check Your Usage

```bash
claude-usage
```

## Example Output

```
Claude Usage (Max 5x Plan)

Session (5h)   ▓▓░░░░░░░░   13%   Resets in 3h 54m
Weekly (All)   ▓▓▓░░░░░░░   27%   Resets in 9h 54m
Weekly (Sonnet)▓░░░░░░░░░    1%   Resets Sat 9:00 AM
```

## Usage

| Command | Description |
|---------|-------------|
| `claude-usage` | Show current usage stats |
| `claude-usage --login` | Open browser to authenticate |
| `claude-usage -l` | Short form of --login |

## How It Works

1. `--login` opens Claude.ai in a browser using Playwright
2. After you log in, the session cookie is extracted and saved to `~/.claude-usage.json`
3. Running `claude-usage` reads this session and fetches your usage data from Claude's API

## Troubleshooting

**"Session expired"** - Run `claude-usage --login` to re-authenticate

**"No session found"** - Run `claude-usage --login` first

**"Network error"** - Check your internet connection

## Requirements

- [Bun](https://bun.sh/) runtime
- Playwright (installed automatically with `bun install`)

## Config Location

Session data is stored at: `~/.claude-usage.json`

This file contains your session key. Keep it private and don't commit it to version control.
