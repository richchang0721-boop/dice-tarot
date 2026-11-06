export type Locale = "zh-Hant" | "en";
const english: Record<string, string> = {
  骰塔羅: "Dice Tarot",
  占卜之間: "Readings",
  牌義圖書館: "Card library",
  我的紀錄: "My history",
  減少動態: "Reduce motion",
  "把未知交給骰子，": "Let the dice choose.",
  "把答案留給自己。": "Find your own answer.",
  "當古老塔羅遇上多面骰。": "Classic tarot meets polyhedral dice.",
  "用一場偶然的相遇，聽見內心尚未說出口的聲音。":
    "A chance encounter can help you put words to what you feel.",
  開啟你的占卜: "Start a reading",
  "無需註冊 · 78 張完整牌組 · 紀錄只留在你的裝置":
    "No account · 78 cards · History stays on your device",
  "一個問題，三個片刻。": "One question, three steps.",
  安放你的問題: "Choose a question",
  "選擇牌陣，讓心中的提問慢慢清晰。":
    "Choose a spread and take a moment to clarify your question.",
  讓骰子指路: "Roll the dice",
  "觸碰牌堆，擲出決定抽牌位置的百分骰。":
    "Touch the deck, then roll percentile dice to find your card.",
  與自己對話: "Reflect on the cards",
  "翻開牌面，在象徵與文字之間找到啟發。":
    "Reveal the cards and consider what their symbols bring to mind.",
  "問題由人提出，牌序由洗牌形成，抽牌位置交給骰子。":
    "You ask the question, the shuffle orders the deck, and the dice choose the position.",
  "探索 78 張牌 →": "Explore all 78 cards →",
  屬於此刻的牌語: "Your reading",
  "先為心事，留一個位置。": "Make space for your question.",
  "讓偶然，帶來一點啟發。": "See what chance brings.",
  "不必找到完美的問題，只要誠實地面對自己。":
    "Your question doesn't have to be perfect. Start with what matters to you.",
  選擇牌陣: "Choose a spread",
  專注洗牌: "Shuffle and focus",
  擲骰抽牌: "Roll and draw",
  閱讀牌語: "Read the cards",
  "01　選擇你的牌陣": "01  Choose your spread",
  "02　請在心中默念你想詢問的問題。": "02  Think of your question.",
  "也可以寫下來（選填，最多 300 字）":
    "Write it down (optional, up to 300 characters)",
  "此刻，有什麼是我需要留意的？": "What deserves my attention right now?",
  "只有按下「保存結果」時，才會將問題存入此瀏覽器。":
    "Your question stays in memory until you save the reading to this browser.",
  "專注問題，開始洗牌 ↗": "Focus and shuffle ↗",
  "正在洗牌，安放心緒⋯": "Shuffling the deck…",
  "請將手放在牌上，專注於你的問題。":
    "Rest your hand on the deck and focus on your question.",
  長按牌堆: "Press and hold the deck",
  "長按約 1.3 秒；也可用鍵盤按住空白鍵。":
    "Hold for about 1.3 seconds. You can also hold the space bar.",
  "78 張牌的順序與正逆位已固定。":
    "The order and orientation of all 78 cards are set.",
  "跳過觸牌儀式 →": "Skip the ritual →",
  跳過洗牌動畫: "Skip shuffle animation",
  "下一張：": "Next card: ",
  "由最上方起算，抽出骰子指定的那一張。":
    "Count from the top of the remaining deck to find the rolled position.",
  擲下你的百分骰: "Roll the percentile dice",
  十位骰: "Tens die",
  個位骰: "Ones die",
  等待一個偶然: "Ready to roll",
  有效範圍: "Valid range",
  "00 + 0 代表": "00 + 0 means",
  "骰子滾動中⋯": "Rolling…",
  重新擲骰: "Roll again",
  "跳過動畫，顯示結果": "Skip animation and show result",
  "超出範圍即重擲，不換算、不重洗。":
    "Out-of-range rolls are recorded and retried with the same deck.",
  等待骰子的指引: "Waiting for a roll",
  留給此刻的指引: "Guidance for this moment",
  切換牌陣檢視: "Spread view",
  牌陣總覽: "Spread overview",
  收起詳細解讀: "Hide details",
  查看詳細解讀: "Show details",
  "已保存 ✓": "Saved ✓",
  保存結果: "Save reading",
  "匯出 JSON": "Export JSON",
  "匯出 PNG": "Export PNG",
  "重新占卜 ↗": "New reading ↗",
  牌義版本: "Meaning version",
  "超出範圍，未移動任何牌": "Out of range, no card drawn",
  "每張牌，都是一面鏡子。": "Every card is a mirror.",
  "78 張 RWS 架構牌義 · 傳統 RWS 牌面 · 固定牌義":
    "78 cards · Traditional RWS artwork · Meaning version",
  搜尋牌名或關鍵詞: "Search card names or keywords",
  "搜尋牌名、英文或關鍵詞⋯": "Search names or keywords…",
  篩選牌組: "Filter by suit",
  全部: "All cards",
  大阿爾克那: "Major Arcana",
  權杖: "Wands",
  聖杯: "Cups",
  寶劍: "Swords",
  錢幣: "Pentacles",
  "回看，與自己的對話。": "Revisit your readings.",
  "紀錄只保存在此瀏覽器；清除網站資料會移除紀錄，建議另行匯出。":
    "Readings stay in this browser. Export a copy before clearing site data.",
  搜尋歷史紀錄: "Search reading history",
  "搜尋問題、牌陣或牌名⋯": "Search questions, spreads or cards…",
  "你的第一頁，還在等你。": "Your first reading awaits.",
  "開始一次占卜 ↗": "Start a reading ↗",
  查看: "View",
  刪除: "Delete",
  "確定刪除此筆占卜紀錄？": "Delete this reading?",
  "以偶然為引，以自己為答案。": "Let chance guide your reflection.",
  "僅供娛樂、文化體驗與自我反思，不作為醫療、法律或投資決策依據。":
    "For entertainment, cultural exploration and reflection. No medical, legal or investment advice.",
  "操作未完成。請確認瀏覽器允許本機儲存或檔案下載後再試。":
    "The operation failed. Check that your browser allows local storage or downloads and try again.",
  "已保存至此瀏覽器的占卜紀錄。": "Reading saved in this browser.",
  正位: "Upright",
  逆位: "Reversed",
  單張指引: "One-card guidance",
  時間之流: "Flow of time",
  穿越迷霧: "Through the mist",
  "一個提問，一份此刻的啟發": "One question and a prompt for reflection.",
  "回望過去，理解現在，展望未來":
    "Look back, understand the present and consider what comes next.",
  "看清現況，辨認阻礙，尋找方向":
    "Understand the situation, identify a challenge and consider a next step.",
  今日指引: "Guidance",
  過去: "Past",
  現在: "Present",
  未來: "Future",
  現況: "Situation",
  阻礙: "Challenge",
  建議: "Advice",
  塔羅牌背: "Tarot card back",
  圖片產生失敗: "Could not create the image",
};
export function translate(locale: Locale, text: string) {
  return locale === "en" ? (english[text] ?? text) : text;
}
export function initialLocale(): Locale {
  try {
    return localStorage.getItem("dice-tarot-language") === "en"
      ? "en"
      : "zh-Hant";
  } catch {
    return "zh-Hant";
  }
}
export function storeLocale(locale: Locale) {
  try {
    localStorage.setItem("dice-tarot-language", locale);
  } catch {
    // Switching languages still works when storage is unavailable.
  }
}
