# AI 團隊大樓（AI Team Tower）

把 Claude Code 團隊變成一棟看得見的 3D 辦公大樓：在 1F 大廳發布需求，PM 把工作分給各部門；各部門先提方案給你審核，核准後才動手，做完交任務報告。

> **English summary** — A local web app that turns a team of Claude Code agents into a 3D office tower. You post a request in the lobby, a PM agent splits it across departments, each department proposes a plan for your review, and only after you approve does it start working and file a report. Departments, PM and handbooks are defined per project, so one tower can host several "buildings" (projects). The UI and prompts are in Traditional Chinese.

## 特色

- **先提方案、核准才動手**：規劃階段只能讀不能改；你可以直接改方案再核准，或寫意見退回重寫，也可以先對方案提問。
- **一句話蓋大樓**：寫下團隊要做什麼，Claude Code 讀完專案後設計整個團隊（PM、部門、角色設定、手冊）。
- **自訂部門**：每棟大樓（＝一個專案資料夾）可以有自己的部門、人數、樓層顏色，角色設定直接沿用專案的 `.claude/agents/*.md`。
- **權限把關**：讀寫專案內的檔案自動放行；只讀的終端機指令自動放行；其他指令要你在大樓裡批准。
- **目標與排程**：PM 讀公司計畫書，拆成年、季、月目標和排程（甘特圖），你審核、提問、要求修改。
- **自動運行**：專案裡的 `routines.json` 定義例行工作，時間到就派給部門；可以設每日預算、每日上限，還有「沒事就不叫 AI」的檢查（gates）。
- **待核可清單**：各部門把需要你決定的事寫進專案的 `approvals.md`，大樓整理成「需要你處理」，你回覆後由負責部門落地。
- **自動備份**：每次執行前後替專案拍快照（獨立的影子 git 庫，不碰專案自己的 git）。
- **模擬模式**：不花費用、不呼叫 Claude，用假資料把整個流程跑一遍。

## 需求

- Node.js 18.17 以上
- Claude Code（Claude 桌面版內建的那份，或自己安裝的 `claude`）。找不到時可以用環境變數 `CLAUDE_CODE_PATH` 指定執行檔。
- 以下其中一種登入方式（見下方「登入方式」）：Claude 訂閱帳號，或 Anthropic API 金鑰。

## 快速開始

```bash
npm install
npm run mock
```

打開 http://localhost:7788 ，會看到範例大樓「小島麵包坊」。模擬模式下 Claude 的回應都是假的，用來熟悉介面。

真的要讓 AI 工作時：

```bash
npm start
```

第一次正式啟動時，畫面會跳出「選擇 Claude 的登入方式」指引，照著做就好（見下一節）。

## Mac

Windows 和 Mac 都能用。在 Mac 上：

1. 安裝 Node.js 18.17 以上（[nodejs.org](https://nodejs.org/)，或 `brew install node`）。
2. 安裝 Claude Code：Claude 桌面版內建的那份（大樓會自己找到），或用官方安裝程式、`npm install -g @anthropic-ai/claude-code` 安裝。
3. 在「終端機」進到大樓資料夾，執行 `npm install`，再 `npm start`（想先試玩就 `npm run mock`）。也可以在 Finder 直接雙擊 `start-mac.command`，它會自動安裝並打開大樓；第一次雙擊如果被系統擋下，對它按右鍵 →「打開」。

- 大樓專用瀏覽器會找「應用程式」裡的 Brave 或 Google Chrome；裝在別的地方可以在 `tower.config.json` 的 `towerBrowser.exe` 指定。
- Mac 支援是新加的，遇到問題歡迎開 issue。

## 登入方式

大樓在背景驅動你電腦上的 Claude Code，有兩種登入方式可以選。第一次啟動會有指引一步一步帶你設定，之後隨時可以在工具列的「登入」按鈕切換，或從選單裡的「登入指引」重新打開：

| 方式 | 怎麼設定 | 費用 |
|---|---|---|
| **訂閱登入**（預設） | 在大樓資料夾執行 `npm run login`，在瀏覽器用你的 Claude 帳號登入；回到指引按「檢查登入狀態」確認 | 算在你的訂閱方案額度裡（Pro、Max 等） |
| **API 金鑰** | 到 [Anthropic Console](https://console.anthropic.com/) 建立金鑰（`sk-ant-…`），貼進指引按「驗證並使用」；或設定環境變數 `ANTHROPIC_API_KEY` | 依實際用量計費 |

- 選擇和在介面貼上的金鑰只存在本機的 `.tower-local.json`（已列在 `.gitignore`），不會進版本控制，也不會傳給展示模式的訪客。
- 也可以在 `tower.config.json` 用 `"auth": "subscription"` 或 `"auth": "api"` 指定預設值；在介面切換過之後，以介面的選擇為準。

## 範例專案

`examples/demo-project/` 是一家虛構麵包店的陽春官網，示範一棟大樓需要的東西：

| 檔案 | 用途 |
|---|---|
| `.claude/agents/*.md` | PM 與各部門的角色設定（Claude Code 子代理格式） |
| `docs/team/00-chief.md`… | 各部門手冊（檔名開頭的編號用來對應待核可清單的「來自」欄） |
| `docs/team/routines.json` | 例行工作表（範例預設關閉） |
| `docs/company-plan.md` | 公司計畫書，「目標」面板從這裡拆解 |
| `approvals.md` | 待核可清單 |

## 新增大樓

一棟大樓對應一個專案資料夾。點左上角的大樓名稱 →「新增大樓」：

1. 填大樓名稱、專案資料夾（不填就建在大樓資料夾的 `workspaces/` 底下），再寫下「這個團隊要做什麼」。
2. 按「**讓 Claude Code 設計團隊**」：Claude Code 會先讀專案（只讀、不改檔案），設計 PM 和 3～8 個部門；大樓把每個角色的設定寫進 `.claude/agents/`、手冊寫進 `docs/team/`，需要的話再補上 `approvals.md` 和公司計畫書。專案裡已經有的檔案不會被覆蓋。
3. 完成後畫面會自動重新整理，切到新大樓。

也可以按「先用基本四個部門」（研究、設計、開發、測試），不呼叫 Claude，馬上蓋好。新大樓會寫進 `tower.config.json`，之後想調整部門也可以直接改這個檔案。

## 工作流程

1. **發布需求**：底部「發布需求」，寫下要做什麼。
2. **PM 分工**：PM 閱讀專案，決定由哪些部門負責、先後順序。
3. **部門提方案**：各部門只讀不改，寫出方案送審。
4. **你審核**：右上角「需要你處理」。可以改方案再核准、寫意見退回，或先提問。
5. **執行**：依順序開工，讀寫檔自動放行，其他終端機指令要你批准。
6. **報告**：每個部門交任務報告，PM 彙整總報告。
7. **追加需求**：任務完成後可以追加，PM 只安排受影響的部門。

任務、方案（含版本）、報告都存在專案的 `.tower/` 資料夾。

## 設定（tower.config.json）

| 欄位 | 說明 |
|---|---|
| `port` | 伺服器埠號（也可用環境變數 `TOWER_PORT`） |
| `auth` | 預設的登入方式：`subscription`（訂閱登入，預設）或 `api`（API 金鑰）；可在介面切換 |
| `model` | 指定模型，`null` 表示依工作自動選 |
| `models` | 自動選模型的對照：`{ "plan": "opus", "light": "haiku", "standard": "sonnet", "heavy": "opus" }` |
| `maxTurnsPlan` / `maxTurnsRun` | 規劃與執行的回合上限 |
| `maxBudgetUsdPerRun` | 每次執行的費用上限（美元） |
| `dailyBudgetUsd` | 自動運行的每日預算；超過七成時簡單的工作改用便宜的模型 |
| `deptTiers` | 指定某個部門的例行工作預設難度，例如 `{ "test": "light" }` |
| `fixedRules` | 額外加進「固定規則」的句子（陣列），所有部門都必須遵守 |
| `backupRoot` | 備份位置，預設是大樓資料夾下的 `backups/`；`"backup": false` 關閉備份 |
| `towerBrowser` | 大樓專用瀏覽器：`{ "enabled": true, "exe": "…", "port": 9333 }` |
| `browserCaps` / `autoBrowserCaps` | 哪些能力需要瀏覽器；哪些能力可以由背景部門自己用大樓瀏覽器做，以及允許的網域，例如 `{ "browser": ["example.com"] }` |
| `shareBuildings` | 對外展示模式開放哪些大樓（預設不開放） |
| `buildings` | 每棟大樓一個專案，欄位見下表 |

每棟大樓（`buildings[]`）：

| 欄位 | 說明 |
|---|---|
| `id` / `name` | 代號與顯示名稱 |
| `projectDir` | 專案資料夾（相對於大樓資料夾，或絕對路徑） |
| `plan` | 公司計畫書路徑（給「目標」面板） |
| `pm` | `{ name, agentFile, handbook }` |
| `departments` | `[{ id, name, line, members, style, icon, wall, ink, agentFile, handbook }]`；`style` 可用 `board`、`research`、`design`、`dev`、`test` |
| `approvals` | 待核可清單路徑，預設找 `approvals.md`、`docs/approvals.md` |
| `routines` | 例行工作表路徑，預設找 `docs/team/routines.json`、`docs/ai-team/routines.json` |
| `gates` | 例行工作開跑前的檢查：`changed`（這些檔案有變動才跑）、`match`（檔案裡找得到這個樣式才跑） |
| `uploadDir` | 「需要你處理」上傳素材的位置 |
| `autoCommit` | 做完一項工作，自動 commit 這次改到的檔案（不在 main／master 上 commit、不 push） |
| `workshops` | 外部工具的捷徑按鈕（`{ id, name, url, match, desc, services }`），選用 |

## 操作

- 點人物或桌上的螢幕：看他在做什麼
- 拖曳平移、滾輪縮放、`F` 看整棟、`Esc` 關閉抽屜、空白鍵暫停
- 工具列的對話框圖示：顯示所有人的動作與房間名稱

## 安全提醒

- 伺服器只給本機用。從外部連進來（例如透過 Cloudflare Tunnel）一律唯讀，而且要帶分享金鑰（第一次啟動時產生在 `.share-token`）。
- 大樓專用瀏覽器的設定檔在 `.browser-profile/`，裡面有你的登入狀態，**不要上傳**（已列在 `.gitignore`）。

## 素材授權

- 人物：[Quaternius](https://quaternius.com/)（CC0）
- 家具與自然模型：[Kenney](https://kenney.nl/) Furniture Kit、Nature Kit（CC0）
- 3D 引擎：[three.js](https://threejs.org/)（MIT，從 CDN 載入）

## 授權

MIT，見 [LICENSE](LICENSE)。
