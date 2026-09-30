#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const SKILL_NAME = 'finish-task';
const SOURCE_DIR = path.join(__dirname, SKILL_NAME);

// Confirmed target directories:
// - Claude Code:  https://code.claude.com/docs/en/skills
// - Codex CLI:    https://developers.openai.com/codex/skills
// - Antigravity:  project scope shares Codex's .agents/skills convention;
//                 global scope is Antigravity-specific.
const TARGETS = {
  claude: {
    project: () => path.join(process.cwd(), '.claude', 'skills', SKILL_NAME),
    global: () => path.join(os.homedir(), '.claude', 'skills', SKILL_NAME),
  },
  codex: {
    project: () => path.join(process.cwd(), '.agents', 'skills', SKILL_NAME),
    global: () => path.join(os.homedir(), '.agents', 'skills', SKILL_NAME),
  },
  antigravity: {
    project: () => path.join(process.cwd(), '.agents', 'skills', SKILL_NAME),
    global: () => path.join(os.homedir(), '.gemini', 'antigravity', 'skills', SKILL_NAME),
  },
};

function printHelp() {
  console.log(`
finish-task installer

Usage:
  npx github:tadeununes/finish-task [options]

Options:
  --target=<claude|codex|antigravity>   Which tool to install for (default: claude)
  --project                             Install into the current project only
  --global                              Install for all projects (default)
  -h, --help                            Show this help

For any other Agent Skills-compatible tool, copy the "${SKILL_NAME}/" folder
from this repository into that tool's own skills directory manually.
`);
}

function parseArgs(argv) {
  let target = 'claude';
  let scope = 'global';
  for (const arg of argv) {
    if (arg.startsWith('--target=')) target = arg.split('=')[1];
    else if (arg === '--project') scope = 'project';
    else if (arg === '--global') scope = 'global';
    else if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    } else {
      console.error(`Unknown option "${arg}". Run with --help for usage.`);
      process.exit(1);
    }
  }
  return { target, scope };
}

function main() {
  const { target, scope } = parseArgs(process.argv.slice(2));

  if (!TARGETS[target]) {
    console.error(`Unknown target "${target}". Supported: ${Object.keys(TARGETS).join(', ')}.`);
    console.error(`For any other Agent Skills-compatible tool, copy the "${SKILL_NAME}/" folder manually — see README.md.`);
    process.exit(1);
  }

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Error: ${SOURCE_DIR} not found. This script must run from the repository root.`);
    process.exit(1);
  }

  const targetDir = TARGETS[target][scope]();
  fs.mkdirSync(path.dirname(targetDir), { recursive: true });

  if (fs.existsSync(targetDir)) {
    // Back up outside the skills tree: a leftover "finish-task.bak.*" folder next to
    // the install carries its own SKILL.md and can shadow or duplicate the skill.
    const backup = path.join(os.tmpdir(), 'finish-task-backups', `${SKILL_NAME}.${Date.now()}`);
    console.log(`Existing ${targetDir} found — backing up to ${backup}`);
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.cpSync(targetDir, backup, { recursive: true });
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  fs.cpSync(SOURCE_DIR, targetDir, { recursive: true });

  const { version } = require('./package.json');
  console.log('');
  console.log(`Installed finish-task v${version} (${target}, ${scope} scope) to:`);
  console.log(`  ${targetDir}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Restart your agent/session so it discovers the new skills directory.');
  console.log('  2. Confirm it loaded — e.g. ask "What skills are available?", or run /doctor in Claude Code.');
  console.log('  3. Invoke it explicitly (e.g. /finish-task) — it will not trigger on its own.');

  if (target !== 'claude') {
    console.log('');
    console.log('  Note: never-auto-run (disable-model-invocation) is a Claude Code-specific');
    console.log('  extension. Confirm independently how this tool controls automatic skill');
    console.log('  invocation before relying on finish-task never firing on its own.');
  }
}

main();
