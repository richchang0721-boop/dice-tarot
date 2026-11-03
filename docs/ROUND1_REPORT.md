# Dice Tarot V1.0 — 第一輪修正與驗收報告

日期：2026-11-03（Asia/Bangkok）。直接修改 D:\DiseTarot 原專案，未新增會員、AI、付費、牌陣或雲端功能。

## 修正結果

| 優先級 | 項目 | 結果 |
| --- | --- | --- |
| P0 | 78 張牌資料 | 22 大牌改用 0、I–XXI；力量 VIII、正義 XI。56 小牌四花色各 14 張，中英名稱與順序逐筆核對。ID 0–77 唯一且不變。 |
| P0 | 解讀資料 | 檢查 156 段正逆解讀及 468 個關鍵詞欄位，均完整；保持原有繁中內容與 meaningVersion，未依問題改寫。正逆牌義為原創反思性摘要，不宣稱是 Waite 原書逐字翻譯。 |
| P0 | 擲骰／抽牌一致性 | 加入 19→82→32→62 固定案例，驗證有效點數與當時位置、無效不移動、順序及方向保持、不放回與 JSON 全紀錄。 |
| P1 | 傳統牌圖 | 78 張全部換為 Wikimedia Commons 逐檔案明確標示 Public domain 的 Pam-A 掃描。圖片與牌義分離；來源、原始 metadata、校驗值、對照圖均保存。 |
| P1 | 超界提示 | 顯示「82點，超出目前77張牌的範圍，請重新擲骰」；無 target、無有效位置標籤、不移牌，按鈕改「重新擲骰」。 |
| P1 | 有效定位 | 骰子停下且有效時才標記，浮起抽出後清掉標記，避免標記移到下一張。 |
| P1 | 詳細解讀 | 本次方向放前、金色側線與背景強調；另一方向留在次要參考區，未刪資料。 |
| P2 | 通知 | 6 秒後自動消失，主要頁面切換清除。測試涵蓋超界通知消失及牌庫無舊提示。 |
| P2 | 可讀性 | 提高副標題、small、內文、placeholder、導覽、骰子說明、標籤與牌庫文字對比；保留深藍金色主視覺。 |
| P2 | 原有玩法 | 三牌陣、1.3 秒長按、D100、無放回、牌庫、IndexedDB、匯出、減少動態均保留。 |

## 78 張資料與圖面核對

- 大牌完整期望表位於 tests/round1.test.ts；包含所有 22 個中英名稱與 22 個羅馬顯示編號。特別確認：愚者 0、魔術師 I、女祭司 II、教皇 V、星星 XVII、月亮 XVIII、太陽 XIX、世界 XXI。
- 小牌每一花色以 1–14 為資料順序：Ace、Two–Ten、Page、Knight、Queen、King。11–14 是內部順序索引，傳統宮廷牌不要求印有該阿拉伯數字。未改動穩定 ID。
- tests/artwork.test.ts 逐張核對來源檔名、花色、序號與 ID，驗證交付影像 SHA-256、WebP 檔頭與唯一性。
- 瀏覽器在三種尺寸下逐張捲動檢查 78 張載入成功，牌面替代文字的編號與資料一致。另人工檢視 round1-contact-0.png 至 round1-contact-4.png，確認圖片印製編號、英文標題、花色與對照標籤相符，沒有浮水印。
- 完整逐張核對表：round1-card-audit.json。授權細節與使用地區說明：ARTWORK_SOURCES.md；此為根據來源聲明作的素材選用紀錄，不是各國法律意見。
- 已保存的舊牌義快照不遷移或重寫；舊紀錄若有阿拉伯數字仍保留原始快照，新占卜使用修正顯示編號。

## 可重現案例

核心固定牌堆用 ID 0–77、交替方向，依序輸入 19、82、32、62，預期抽到 ID 18、32、63，剩餘 75 張；82 保留為 accepted=false、position=null、cardId=null。

瀏覽器則在測試環境替換 Web Crypto 輸入，先完成真正 Fisher–Yates 洗牌，再擲 19、82、32、62，預期抽到 ID 19（逆）、33（逆）、64（正）。這是不同初始牌序，抽牌位置相同；每筆 JSON 為 [點數, 當時張數, 有效, 位置]：

```json
[[19,78,true,19],[82,77,false,null],[32,77,true,32],[62,76,true,62]]
```

詳細頁／儲存後重新載入仍顯示第 19、32、62 張。測試只在瀏覽器測試程式注入亂數；正式程式沒有固定點數入口，也沒有改動 Web Crypto、拒絕採樣、洗牌或抽牌引擎。

## 最終測試結果

| 檢查 | 結果 |
| --- | --- |
| npm run typecheck | 通過，TypeScript 無錯誤 |
| npm run build | 通過，dist 正式靜態版本 |
| npm test | 10/10 通過（含既有 5 項核心、4 項本輪資料／案例、1 項 78 張圖面映射及校驗） |
| npm run test:e2e | 12/12 通過；Chromium，1920×1080、390×844、2560×1440 各 4 項 |
| 78 張牌庫 | 三種尺寸逐張圖片載入成功；花色篩選與搜尋通過 |
| 超界與重擲 | 82/77 不移牌、不標位置；6 秒通知消失後仍可重新擲骰 |
| JSON | 實際下載後解析並核對 4 次擲骰、3 張 ID／方向／位置 |
| PNG | 實際下載，驗證 PNG 檔頭；人工檢視採新牌面、正逆方向、牌義及位置 |
| 本機紀錄 | 保存、重新整理、查詢、詳細位置、刪除通過 |
| 響應式 | 桌面／手機／大螢幕流程通過，結果頁及牌庫無水平溢出；人工檢視手機超界與結果圖 |
| 正式建置 smoke | npm run preview，HTTP 200，設定與擲骰畫面無 JS 例外 |

核心亂數引擎 src/engine.ts 未改動；原始十萬次統計留在 statistics.json，未將舊統計冒稱本輪新跑結果。本輪針對修改執行上述回歸驗證。

## 修改／新增檔案

- 修改：src/cards.ts、src/main.tsx、src/storage.ts、src/style.css。
- 新增：src/CardArt.tsx（原創備援 + 傳統圖片）、src/deck.ts（獨立牌組查找）、src/deck-assets.json（78 張來源映射）。
- 新增素材：public/decks/rws/00.webp–77.webp、NOTICE.txt、sources.json；78 張 WebP 合計約 10.26 MB，按需／延遲載入，不以外站熱連結顯示。
- 測試：新增 tests/round1.test.ts、tests/artwork.test.ts、tests/browser/round1.spec.ts；更新 tests/browser/app.spec.ts 以支援新重擲按鈕。
- 工具：新增 scripts/research-rws.mjs、fetch-deck.mjs、optimize-rws.mjs、contact-sheets.ts，保留可重建素材流程。
- 文件／設定：README.md、package.json（typecheck）、.gitignore（素材暫存）；docs 新增本報告、素材來源、metadata、逐卡資料、五張對照圖與本輪桌面／手機／大螢幕截圖；dist 更新。
- 未修改抽牌演算法、IndexedDB schema 或第三方依賴。

## 尚未解決與公開部署判定

本輪需求未發現未解決的阻擋問題。以已驗證的 Chromium 桌面與行動模擬範圍，符合靜態 MVP 公開部署條件，可部署更新後 dist 至 Vercel／Cloudflare Pages；本輪未執行帳號上的線上發布。

仍有限制：尚未實機驗證 Safari／iOS／Android 與 Firefox；未進行正式 WCAG 全站審核或專業塔羅編輯認證。本機記錄仍受瀏覽器資料清除影響，沒有雲端備份。牌義內容保持既有版本。這些限制已記錄，不影響已通過的本輪功能回歸；正式開放前仍建議在目標手機做一次手動驗收。
