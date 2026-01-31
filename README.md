# Claude Usage CLI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh/)

View your Claude.ai usage limits directly from the terminal.

## Features

- View session (5-hour) usage limits
- View weekly usage limits for all models
- View model-specific limits (Sonnet, Opus)
- Visual progress bars for quick assessment
- Easy browser-based authentication

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/guizhouln/claude-usage-cli.git
cd claude-usage

# Install dependencies
bun install

# Link globally (optional)
bun link
```

### Requirements

- [Bun](https://bun.sh/) runtime (v1.0.0 or higher)
- Playwright browsers will be installed automatically

## Quick Start

### 1. Login (first time only)

```bash
bun run login
# or
claude-usage --login
```

This opens a browser window. Log in to Claude.ai as usual (Google, email, etc.).
After successful login, your session is automatically saved.

### 2. Check Your Usage

```bash
bun run start
# or
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
| `bun run start` | Show current usage stats |
| `bun run login` | Open browser to authenticate |

## How It Works

1. `--login` opens Claude.ai in a browser using Playwright
2. After you log in, the session cookie is extracted and saved to `~/.claude-usage.json`
3. Running `claude-usage` reads this session and fetches your usage data from Claude's API

## Troubleshooting

**"Session expired"** - Run `claude-usage --login` to re-authenticate

**"No session found"** - Run `claude-usage --login` first

**"Network error"** - Check your internet connection

**Playwright browser issues** - Run `bunx playwright install chromium` to reinstall browsers

## Config Location

Session data is stored at: `~/.claude-usage.json`

This file contains your session key. Keep it private and don't commit it to version control.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is not affiliated with, officially maintained, or endorsed by Anthropic. Use at your own risk.
