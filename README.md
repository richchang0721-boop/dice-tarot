# Dice Tarot 骰塔羅 V1.0 — 第一輪修正

可執行的繁體中文、無後端塔羅網站。React 19 + TypeScript + Vite；IndexedDB 本機紀錄。

## 本機啟動

需要 Node.js 22.12+（建議 24 LTS）及 npm。

```sh
npm ci
npm run dev
```

開啟終端顯示的網址，預設 http://127.0.0.1:5173 。若連接埠已使用，Vite 會顯示下一個可用網址。

```sh
npm run build
npm run preview
```

正式檔案在 `dist/`。請透過 HTTP 伺服器開啟，不要直接雙擊 index.html。正式環境使用 HTTPS，確保 Web Crypto 正常。

## 操作

1. 首頁開始，選單張、過去／現在／未來、現況／阻礙／建議。可不輸入問題。
2. 洗牌固定牌序及正逆位。長按牌堆 1.3 秒，或跳過儀式。
3. 分別標示十位與個位的 D100，00 + 0 = 100。超過剩餘張數只記錄並重擲。
4. 依剩餘牌堆第 N 張抽出，不放回；可跳過洗牌、骰子及抽牌動畫。
5. 完成後查看固定解讀、保存、匯出 JSON 或 PNG。歷史可搜尋、查看、刪除與再次匯出。

## 架構與隱私

- `src/engine.ts`：Web Crypto 拒絕採樣、Fisher–Yates、正逆位與 D100；與問題、牌義、歷史完全無關。
- `src/cards.ts`：78 張資料（22 大牌 + 56 小牌），中英名稱、編號、花色、正逆關鍵詞及基本解讀，資料版本 `zh-Hant-1.0.0`。
- `src/main.tsx`：流程、響應式介面、儀式、兩顆百分骰呈現。`src/CardArt.tsx` 與 `src/deck.ts`：牌面呈現及獨立牌組映射。
- `src/storage.ts`：IndexedDB、保存完整牌義快照、逐次有效／無效骰點、抽牌位置、JSON／PNG 下載。
- `src/style.css`：深藍／古金介面，支援系統及手動減少動態。
- `tests/`：核心、十萬次統計及真實瀏覽器測試。
- `docs/`：測試報告、統計原始結果與桌面／手機／大螢幕截圖。

問題僅保留記憶體，按「保存結果」才寫入 IndexedDB。沒有帳號、API、遙測或雲端同步。清除網站資料或換瀏覽器會失去本機紀錄，JSON 可作備份（本版未提供匯入）。牌義保存的是快照，未來更新不改變舊紀錄。字型使用 Google Fonts（無法連線時採系統字型）；該服務會收到一般字型請求，問題不會傳送。

## 測試

```sh
npm test
npm run test:statistics
npx playwright install chromium
npm run test:e2e
```

統計每次會重新使用真實 Web Crypto，數值自然變動；輸出 `docs/statistics.json`。完整實測與限制見 `docs/TEST_REPORT.md`。若使用自訂 Playwright 瀏覽器目錄，安裝與執行請使用相同的 `PLAYWRIGHT_BROWSERS_PATH`。

## 部署至 Vercel

1. 將原始碼推到自己的 Git 儲存庫，在 Vercel 選擇 Import Project。
2. Framework 選 Vite；Install：`npm ci`；Build：`npm run build`；Output：`dist`。
3. Node 選 24，按 Deploy。已附 `vercel.json`；無環境變數或資料庫設定。

## 部署至 Cloudflare Pages

1. 建立 Pages 專案並連結 Git 儲存庫。
2. Build：`npm run build`，Output：`dist`，Root：專案根目錄。
3. 設定 `NODE_VERSION=24`，儲存並部署。或將已建置 `dist/` 透過 Pages Direct Upload 上傳。
4. `public/_headers` 會複製到輸出目錄；Vercel 不使用此 Pages 專用檔。

本次交付提供正式靜態建置，未登入或發布到使用者 Vercel／Cloudflare 帳號。部署只需上述帳號與匯入／上傳步驟。SPA 使用內部畫面狀態，無伺服器路由重寫需求。重新整理回首頁，本次尚未保存的占卜不復原。

## 美術、授權與已知限制

採 RWS 78 張結構，維持原有基本牌義；第一輪修正將大牌顯示編號改為 0、I–XXI（力量 VIII、正義 XI），小牌 1–14 為順序索引，11–14 分別為侍者、騎士、皇后、國王。穩定 ID 不變；已保存的舊資料快照不改寫。牌面換為逐檔案標示 Public domain 的 Wikimedia Commons 傳統 RWS 掃描，本機存放於 `public/decks/rws`，牌義與圖片分離。完整來源、版本及校驗值見 `docs/ARTWORK_SOURCES.md`、`src/deck-assets.json`；原創 SVG 保留作牌背與載入失敗的備援。公有領域原作不套用本專案 MIT，原創程式依 LICENSE。

MVP 採 2D 多面骰動畫而非 Three.js 物理模擬；動畫不參與亂數。PNG 為可讀的結果摘要卡，JSON 為完整紀錄。無 AI 解牌、會員、雲端備份、PWA 或第二階段功能。已驗證 Chromium 的桌面及行動模擬，尚未在實體 iPhone／Android、Safari 與 Firefox 驗證。無障礙包含鍵盤操作、焦點、牌面替代文字與動態提示，未宣稱通過正式 WCAG 審核。

後續建議：實體跨瀏覽器驗證、專業塔羅編輯校閱、授權完整牌面、JSON 匯入、可選多語內容模組。多語擴充可將同一 card ID 的文案抽成 locale catalog，保留紀錄的版本與快照。


## 第一輪修正驗證

執行 `npm run typecheck`、`npm run build`、`npm test`、`npm run test:e2e`。詳細修正、檔案清單、78 張核對結果、指定 19→82→32→62 案例及部署判定見 `docs/ROUND1_REPORT.md`。舊版 `docs/TEST_REPORT.md` 與統計結果保留作初始版本的歷史證據。
