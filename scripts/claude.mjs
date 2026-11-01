// 打開大樓背景使用的那份 Claude Code（互動模式），用來登入或檢查狀態。
// 用法：npm run login   → 進去後輸入 /login，依畫面在瀏覽器完成登入
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function findClaude() {
  if (process.env.CLAUDE_CODE_PATH && fs.existsSync(process.env.CLAUDE_CODE_PATH)) return process.env.CLAUDE_CODE_PATH;
  const base = path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'claude-code');
  try {
    const vers = fs.readdirSync(base).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    for (const v of vers) for (const sub of fs.readdirSync(path.join(base, v))) {
      const exe = path.join(base, v, sub, process.platform === 'win32' ? 'claude.exe' : 'claude');
      if (fs.existsSync(exe)) return exe;
    }
  } catch {}
  for (const dir of String(process.env.PATH || '').split(path.delimiter)) {
    const exe = path.join(dir, process.platform === 'win32' ? 'claude.exe' : 'claude');
    if (dir && fs.existsSync(exe)) return exe;
  }
  return null;
}
const exe = findClaude();
if (!exe) { console.error('找不到 Claude Code。請安裝 Claude 桌面版或 Claude Code，或用環境變數 CLAUDE_CODE_PATH 指定。'); process.exit(1); }
console.log('Claude Code：' + exe);
if (process.argv[2] === 'auth' && process.argv[3] === 'login') console.log('瀏覽器會打開登入頁，用你的 Claude 帳號登入後回到這裡。\n');
const env = { ...process.env }; delete env.ANTHROPIC_API_KEY;
spawn(exe, process.argv.slice(2), { stdio: 'inherit', env, cwd: path.dirname(path.dirname(fileURLToPath(import.meta.url))) }).on('exit', c => process.exit(c ?? 0));
