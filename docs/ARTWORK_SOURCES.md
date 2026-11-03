# RWS 牌面來源與使用紀錄（第一輪修正）

查核日期：2026-11-03。

採用 Wikimedia Commons「Rider-Waite-Smith tarot deck (TaionWC)」78 張原始配色掃描。每個檔案的 API metadata 都必須同時標示 `LicenseShortName = Public domain`、`Copyrighted = False` 才允許下載；不使用新近重新著色或授權不明牌組。繪者 Pamela Colman Smith，原作約 1910 年。各檔案描述均指出 Pam-A 版本，來源 credit 保留於 manifest。

- 牌組分類：https://commons.wikimedia.org/wiki/Category:Rider-Waite-Smith_tarot_deck_(TaionWC)
- 分類的著作權提醒（新著色版本可能仍受保護）：https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck
- 星星 XVII：https://commons.wikimedia.org/wiki/File:RWS_Tarot_17_Star.jpg
- 聖杯王牌：https://commons.wikimedia.org/wiki/File:Cups01.jpg
- 標記說明：https://creativecommons.org/publicdomain/mark/1.0/

上述檔案頁明確標示美國公有領域，並敘述原作在來源國及相應作者死後保護年限地區的狀態。採用此來源的依據是逐檔案的公有領域聲明，而非推定任何 RWS 圖片都可使用；不宣稱已替每一可能部署地區作法律審核。

完整逐張證據：`docs/rws-source-metadata.json` 保存 API 原始來源資訊；`src/deck-assets.json` 以穩定 ID 保存檔名、來源頁、下載 URL、作者、授權、原始與交付圖檔 SHA-256、尺寸及轉檔紀錄。影像與 `src/cards.ts` 的牌義資料分離。原作公有領域不套用本專案 MIT 再授權，其他自製程式仍按 LICENSE。

只縮小尺寸並轉為 WebP，未重新著色、裁掉標題或加浮水印。高解析下載暫存在 `.asset-cache/rws`（不隨正式部署），正式網站使用本機 `/decks/rws/*.webp`，不在訪客瀏覽時向 Commons 請求。PNG 匯出使用同一份牌面，載入失敗才退回原創 SVG／摘要圖。

映射：大牌 ID 0–21 對應來源標題的 00–21，顯示編號 0、I–XXI；小牌依 Wands、Cups、Swords、Pents 各 01–14 對應權杖、聖杯、寶劍、錢幣。11、12、13、14 在資料中依序為侍者、騎士、皇后、國王（內部順序，傳統宮廷牌圖不一定印阿拉伯數字）。不以圖片排序推斷抽牌結果。
