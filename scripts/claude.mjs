// 打開大樓背景使用的那份 Claude Code（互動模式），用來登入或檢查狀態。
// 用法：npm run login   → 進去後輸入 /login，依畫面在瀏覽器完成登入
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Claude 桌面版內建的 Claude Code 放在哪：Windows、Mac、Linux 各不同
const DESKTOP_CC = process.platform === 'win32' ? path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'claude-code')
  : process.platform === 'darwin' ? path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude-code')
  : path.join(os.homedir(), '.config', 'Claude', 'claude-code');
function findClaude() {
  if (process.env.CLAUDE_CODE_PATH && fs.existsSync(process.env.CLAUDE_CODE_PATH)) return process.env.CLAUDE_CODE_PATH;
  const name = process.platform === 'win32' ? 'claude.exe' : 'claude';
  const list = d => { try { return fs.readdirSync(d); } catch { return []; } };
  for (const v of list(DESKTOP_CC).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))) {
    const vd = path.join(DESKTOP_CC, v);
    for (const exe of [path.join(vd, name), ...list(vd).map(sub => path.join(vd, sub, name))]) if (fs.existsSync(exe)) return exe;
  }
  // 再找 PATH 和常見的安裝位置（npm 全域安裝、官方安裝程式、Homebrew）；從 Finder 開的 Mac 程式 PATH 很短，所以另外列出來
  const dirs = String(process.env.PATH || '').split(path.delimiter);
  if (process.platform !== 'win32') dirs.push(path.join(os.homedir(), '.local', 'bin'), path.join(os.homedir(), '.claude', 'local'), '/opt/homebrew/bin', '/usr/local/bin', '/usr/bin');
  for (const dir of dirs) { const exe = path.join(dir, name); if (dir && fs.existsSync(exe)) return exe; }
  return undefined;
}
const exe = findClaude();
if (!exe) { console.error('找不到 Claude Code。請安裝 Claude 桌面版或 Claude Code，或用環境變數 CLAUDE_CODE_PATH 指定。'); process.exit(1); }
console.log('Claude Code：' + exe);
if (process.argv[2] === 'auth' && process.argv[3] === 'login') console.log('瀏覽器會打開登入頁，用你的 Claude 帳號登入後回到這裡。\n');
const env = { ...process.env }; delete env.ANTHROPIC_API_KEY;
spawn(exe, process.argv.slice(2), { stdio: 'inherit', env, cwd: path.dirname(path.dirname(fileURLToPath(import.meta.url))) }).on('exit', c => process.exit(c ?? 0));
