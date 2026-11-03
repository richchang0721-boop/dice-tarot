import { Art } from "./CardArt";
import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { cards, MEANING_VERSION } from "./cards";
import {
  shuffle,
  draw,
  percentile,
  diceDigits,
  type DeckCard,
  type Roll,
} from "./engine";
import {
  saveReading,
  listReadings,
  deleteReading,
  exportJSON,
  exportPNG,
  type Reading,
  type ResultCard,
} from "./storage";
import "./style.css";
const spreads = [
  {
    name: "單張指引",
    desc: "一個提問，一份此刻的啟發",
    positions: ["今日指引"],
  },
  {
    name: "時間之流",
    desc: "回望過去，理解現在，展望未來",
    positions: ["過去", "現在", "未來"],
  },
  {
    name: "穿越迷霧",
    desc: "看清現況，辨認阻礙，尋找方向",
    positions: ["現況", "阻礙", "建議"],
  },
];
function App() {
  const [page, setPage] = useState("home"),
    [step, setStep] = useState("setup"),
    [spread, setSpread] = useState(1),
    [question, setQuestion] = useState(""),
    [deck, setDeck] = useState<DeckCard[]>([]),
    [picked, setPicked] = useState<ResultCard[]>([]),
    [rolls, setRolls] = useState<Roll[]>([]),
    [value, setValue] = useState<number | null>(null),
    [locatedPosition, setLocatedPosition] = useState<number | null>(null),
    [needsReroll, setNeedsReroll] = useState(false),
    [busy, setBusy] = useState(false),
    [extracting, setExtracting] = useState(false),
    [status, setStatus] = useState(""),
    [holding, setHolding] = useState(false),
    [history, setHistory] = useState<Reading[]>([]),
    [reading, setReading] = useState<Reading | null>(null),
    [detail, setDetail] = useState(false),
    [focusCard, setFocusCard] = useState<number | null>(null),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("全部"),
    [reduced, setReduced] = useState(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [saved, setSaved] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null),
    animation = useRef<ReturnType<typeof setTimeout> | null>(null),
    pending = useRef<(() => void) | null>(null);
  const positions = spreads[spread].positions;
  useEffect(() => {
    setStatus("");
  }, [page]);
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(""), 6000);
    return () => clearTimeout(timer);
  }, [status]);
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduced);
  }, [reduced]);
  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (animation.current) clearTimeout(animation.current);
    },
    [],
  );
  const safe = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
    } catch {
      setStatus("操作未完成。請確認瀏覽器允許本機儲存或檔案下載後再試。");
    }
  };
  function finishAnimation() {
    if (animation.current) clearTimeout(animation.current);
    const fn = pending.current;
    pending.current = null;
    fn?.();
  }
  function animate(fn: () => void, ms: number) {
    setBusy(true);
    pending.current = () => {
      setBusy(false);
      fn();
    };
    animation.current = setTimeout(finishAnimation, reduced ? 0 : ms);
  }
  function start() {
    setPage("reading");
    setStep("setup");
    setReading(null);
    setPicked([]);
    setRolls([]);
    setValue(null);
    setLocatedPosition(null);
    setNeedsReroll(false);
    setStatus("");
    setSaved(false);
    setDetail(false);
    setFocusCard(null);
  }
  function prepare() {
    setDeck(shuffle());
    setStep("shuffle");
    animate(() => setStep("touch"), 1000);
  }
  function hold() {
    if (holding) return;
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      setHolding(false);
      setStep("roll");
    }, 1300);
  }
  function release() {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setHolding(false);
  }
  function roll() {
    if (busy) return;
    const result = draw(deck, percentile());
    setValue(result.roll.value);
    setLocatedPosition(null);
    setNeedsReroll(false);
    setStatus("");
    animate(() => {
      const nextRolls = [...rolls, result.roll];
      setRolls(nextRolls);
      if (!result.card) {
        setNeedsReroll(true);
        setStatus(
          `${result.roll.value}點，超出目前${result.roll.remaining}張牌的範圍，請重新擲骰`,
        );
        return;
      }
      setLocatedPosition(result.roll.position);
      const selected = result.card;
      setExtracting(true);
      animate(() => {
        setExtracting(false);
        const next = [
          ...picked,
          {
            card: cards[selected.id],
            reversed: selected.reversed,
            position: positions[picked.length],
            drawPosition: result.roll.value,
          },
        ];
        setLocatedPosition(null);
        setDeck(result.deck);
        setPicked(next);
        setStatus(
          `第 ${result.roll.value} 張牌已移入「${positions[picked.length]}」`,
        );
        if (next.length === positions.length) {
          setReading({
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            question,
            spread: spreads[spread].name,
            meaningVersion: MEANING_VERSION,
            cards: next,
            rolls: nextRolls,
          });
          setStep("result");
        }
      }, 600);
    }, 1100);
  }
  async function openHistory() {
    await safe(async () => {
      setHistory(await listReadings());
      setPage("history");
      setQuery("");
      setStatus("");
    });
  }
  const digits = value ? diceDigits(value) : null;
  const resultCard = (item: ResultCard, i: number) => (
    <article className="result-card" key={item.card.id}>
      <div className="position">
        {String(i + 1).padStart(2, "0")} — {item.position}
      </div>
      <Art card={item.card} reversed={item.reversed} />
      <div className="card-title">
        <h3>{item.card.name}</h3>
        <span>{item.reversed ? "逆位" : "正位"}</span>
      </div>
      <small>{item.card.en}</small>
      <p className="keywords">
        {(item.reversed ? item.card.reversed : item.card.upright).join(" · ")}
      </p>
      <p>{item.reversed ? item.card.reverseMeaning : item.card.meaning}</p>
      {detail && (
        <div className="detail">
          <p className="meaning-primary">
            <strong>{item.reversed ? "逆位" : "正位"}解讀 · 本次抽牌</strong>
            <br />
            {item.reversed ? item.card.reverseMeaning : item.card.meaning}
          </p>
          <p className="meaning-secondary">
            <strong>{item.reversed ? "正位" : "逆位"}參考</strong>
            <br />
            {item.reversed ? item.card.meaning : item.card.reverseMeaning}
          </p>
          <small>
            {item.card.suit} · 編號 {item.card.number} · 由剩餘牌堆第{" "}
            {item.drawPosition} 張抽出
          </small>
        </div>
      )}
    </article>
  );
  return (
    <>
      <header>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (!busy) setPage("home");
          }}
        >
          <span className="brand-symbol">✧</span>
          <span>
            骰塔羅<small>DICE TAROT</small>
          </span>
        </a>
        <nav>
          <button
            className={page === "home" ? "active" : ""}
            onClick={() => !busy && setPage("home")}
          >
            占卜之間
          </button>
          <button
            className={page === "library" ? "active" : ""}
            onClick={() => {
              if (!busy) {
                setQuery("");
                setFilter("全部");
                setPage("library");
              }
            }}
          >
            牌義圖書館
          </button>
          <button
            className={page === "history" ? "active" : ""}
            onClick={() => !busy && openHistory()}
          >
            我的紀錄
          </button>
        </nav>
        <label className="motion">
          <input
            type="checkbox"
            checked={reduced}
            onChange={(e) => {
              setReduced(e.target.checked);
              if (e.target.checked) finishAnimation();
            }}
          />
          減少動態
        </label>
      </header>
      <main>
        <div
          role="status"
          aria-live="polite"
          className={status ? "notice" : "sr-only"}
        >
          {status}
        </div>
        {page === "home" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">A LITTLE CHANCE. A LITTLE CLARITY.</p>
                <h1>
                  把未知交給骰子，
                  <br />
                  把答案留給自己。
                </h1>
                <p className="intro">
                  當古老塔羅遇上多面骰。
                  <br />
                  用一場偶然的相遇，聽見內心尚未說出口的聲音。
                </p>
                <button className="primary" onClick={start}>
                  開啟你的占卜 <span>↗</span>
                </button>
                <p className="micro">
                  無需註冊 · 78 張完整牌組 · 紀錄只留在你的裝置
                </p>
              </div>
              <div className="hero-art">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <span className="star s1">✦</span>
                <span className="star s2">✧</span>
                <div className="fan left">
                  <Art back />
                </div>
                <div className="fan right">
                  <Art card={cards[17]} />
                </div>
                <div className="fan center">
                  <Art back />
                </div>
                <div className="hero-die">37</div>
                <p>LET CHANCE OPEN A DOOR</p>
              </div>
            </section>
            <section className="how">
              <div>
                <p className="eyebrow">THE RITUAL</p>
                <h2>一個問題，三個片刻。</h2>
              </div>
              {[
                ["01", "安放你的問題", "選擇牌陣，讓心中的提問慢慢清晰。"],
                ["02", "讓骰子指路", "觸碰牌堆，擲出決定抽牌位置的百分骰。"],
                ["03", "與自己對話", "翻開牌面，在象徵與文字之間找到啟發。"],
              ].map((r) => (
                <article key={r[0]}>
                  <span>{r[0]}</span>
                  <h3>{r[1]}</h3>
                  <p>{r[2]}</p>
                </article>
              ))}
            </section>
            <div className="home-note">
              ✧ <span>問題由人提出，牌序由洗牌形成，抽牌位置交給骰子。</span>
              <button onClick={() => setPage("library")}>探索 78 張牌 →</button>
            </div>
          </>
        )}
        {page === "reading" && (
          <>
            <div className="page-heading">
              <p className="eyebrow">YOUR MOMENT OF REFLECTION</p>
              <h1>
                {step === "result"
                  ? "屬於此刻的牌語"
                  : step === "setup"
                    ? "先為心事，留一個位置。"
                    : "讓偶然，帶來一點啟發。"}
              </h1>
              <p>
                {step === "setup"
                  ? "不必找到完美的問題，只要誠實地面對自己。"
                  : spreads[spread].name + " · " + positions.join(" / ")}
              </p>
            </div>
            <div className="steps">
              {["選擇牌陣", "專注洗牌", "擲骰抽牌", "閱讀牌語"].map((s, i) => (
                <span
                  key={s}
                  className={
                    (step === "setup"
                      ? 0
                      : step === "touch" || step === "shuffle"
                        ? 1
                        : step === "roll"
                          ? 2
                          : 3) === i
                      ? "current"
                      : ""
                  }
                >
                  {i + 1}　{s}
                </span>
              ))}
            </div>
            {step === "setup" && (
              <section className="setup panel">
                <h2>01　選擇你的牌陣</h2>
                <div className="spread-options">
                  {spreads.map((s, i) => (
                    <button
                      key={s.name}
                      className={"spread " + (spread === i ? "selected" : "")}
                      onClick={() => setSpread(i)}
                    >
                      <div className="mini-cards">
                        {s.positions.map((p) => (
                          <span key={p}>✧</span>
                        ))}
                      </div>
                      <h3>{s.name}</h3>
                      <p>{s.desc}</p>
                      <small>{s.positions.join(" / ")}</small>
                    </button>
                  ))}
                </div>
                <h2>02　請在心中默念你想詢問的問題。</h2>
                <label htmlFor="question">
                  也可以寫下來（選填，最多 300 字）
                </label>
                <textarea
                  id="question"
                  maxLength={300}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="此刻，有什麼是我需要留意的？"
                />
                <div className="setup-bottom">
                  <small>
                    只有按下「保存結果」時，才會將問題存入此瀏覽器。
                  </small>
                  <button className="primary" onClick={prepare}>
                    專注問題，開始洗牌 ↗
                  </button>
                </div>
              </section>
            )}
            {(step === "touch" || step === "shuffle") && (
              <section className="ritual panel">
                <p className="eyebrow">
                  {step === "shuffle"
                    ? "SHUFFLING THE POSSIBILITIES"
                    : "TAKE A BREATH"}
                </p>
                <h2>
                  {step === "shuffle"
                    ? "正在洗牌，安放心緒⋯"
                    : "請將手放在牌上，專注於你的問題。"}
                </h2>
                <button
                  className={
                    "touch-deck " +
                    (holding ? "holding" : "") +
                    (step === "shuffle" ? " shuffling" : "")
                  }
                  aria-label="長按牌堆"
                  disabled={step === "shuffle"}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    hold();
                  }}
                  onPointerUp={release}
                  onPointerCancel={release}
                  onKeyDown={(e) => {
                    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                      e.preventDefault();
                      hold();
                    }
                  }}
                  onKeyUp={release}
                  onBlur={release}
                >
                  <Art back />
                </button>
                <p>
                  {step === "touch"
                    ? "長按約 1.3 秒；也可用鍵盤按住空白鍵。"
                    : "78 張牌的順序與正逆位已固定。"}
                </p>
                {step === "touch" && (
                  <button
                    className="text-button"
                    onClick={() => {
                      release();
                      setStep("roll");
                    }}
                  >
                    跳過觸牌儀式 →
                  </button>
                )}
                {busy && (
                  <button onClick={finishAnimation}>跳過洗牌動畫</button>
                )}
              </section>
            )}
            {step === "roll" && (
              <>
                <section className="draw-table panel">
                  <div className="deck-area">
                    <p className="eyebrow">THE DECK · {deck.length} CARDS</p>
                    <h2>下一張：{positions[picked.length]}</h2>
                    <div className="deck-stack">
                      <Art back />
                    </div>
                    {extracting && (
                      <div className="selected-card">
                        <Art back />
                      </div>
                    )}
                    <p>由最上方起算，抽出骰子指定的那一張。</p>
                    <div className="deck-strip">
                      {deck.map((c, i) => (
                        <span
                          key={c.id}
                          title={`第 ${i + 1} 張`}
                          className={locatedPosition === i + 1 ? "target" : ""}
                        />
                      ))}
                    </div>
                    {locatedPosition !== null && (
                      <small>
                        定位：第 {locatedPosition} 張 / 目前 {deck.length} 張
                      </small>
                    )}
                  </div>
                  <div className="dice-area">
                    <p className="eyebrow">LET THE DICE DECIDE</p>
                    <h2>擲下你的百分骰</h2>
                    <div className={"dice-pair " + (busy ? "rolling" : "")}>
                      <div>
                        <div className="die">
                          {digits ? String(digits.tens).padStart(2, "0") : "00"}
                        </div>
                        <small>十位骰</small>
                      </div>
                      <span>+</span>
                      <div>
                        <div className="die second">{digits?.ones ?? 0}</div>
                        <small>個位骰</small>
                      </div>
                    </div>
                    <p className="dice-total">
                      {value ? `點數 ${value}` : "等待一個偶然"}
                    </p>
                    <p>
                      有效範圍 <strong>1–{deck.length}</strong> · 00 + 0 代表
                      100
                    </p>
                    <button className="primary" disabled={busy} onClick={roll}>
                      {busy
                        ? "骰子滾動中⋯"
                        : needsReroll
                          ? "重新擲骰"
                          : "擲骰，抽取第 " + (picked.length + 1) + " 張"}
                      　◇
                    </button>
                    {busy && (
                      <button className="text-button" onClick={finishAnimation}>
                        跳過動畫，顯示結果
                      </button>
                    )}
                    <small>超出範圍即重擲，不換算、不重洗。</small>
                  </div>
                </section>
                <section className="results">
                  {picked.map(resultCard)}
                  {positions.slice(picked.length).map((p, i) => (
                    <article className="empty-card" key={p}>
                      <span>
                        0{picked.length + i + 1} — {p}
                      </span>
                      <div>✧</div>
                      <p>等待骰子的指引</p>
                    </article>
                  ))}
                </section>
              </>
            )}
            {step === "result" && reading && (
              <>
                <p className="question-display">
                  {reading.question || "留給此刻的指引"}
                </p>
                <div
                  className="reading-tabs"
                  role="group"
                  aria-label="切換牌陣檢視"
                >
                  <button
                    className={focusCard === null ? "tab-active" : ""}
                    onClick={() => setFocusCard(null)}
                  >
                    牌陣總覽
                  </button>
                  {reading.cards.map((c, i) => (
                    <button
                      key={c.card.id}
                      className={focusCard === i ? "tab-active" : ""}
                      onClick={() => {
                        setFocusCard(i);
                        setDetail(true);
                      }}
                    >
                      {c.position}
                    </button>
                  ))}
                </div>
                <section className="results">
                  {reading.cards.map((item, i) =>
                    focusCard === null || focusCard === i
                      ? resultCard(item, i)
                      : null,
                  )}
                </section>
                <div className="result-actions">
                  <button onClick={() => setDetail(!detail)}>
                    {detail ? "收起詳細解讀" : "查看詳細解讀"}
                  </button>
                  <button
                    className="primary"
                    disabled={saved}
                    onClick={() =>
                      safe(async () => {
                        await saveReading(reading);
                        setSaved(true);
                        setStatus("已保存至此瀏覽器的占卜紀錄。");
                      })
                    }
                  >
                    {saved ? "已保存 ✓" : "保存結果"}
                  </button>
                  <button onClick={() => exportJSON(reading)}>匯出 JSON</button>
                  <button onClick={() => safe(() => exportPNG(reading))}>
                    匯出 PNG
                  </button>
                  <button onClick={start}>重新占卜 ↗</button>
                </div>
                <details className="audit panel">
                  <summary>
                    查看擲骰紀錄與抽牌位置（{reading.rolls.length} 次）
                  </summary>
                  <p>
                    牌義版本 {reading.meaningVersion} ·{" "}
                    {new Date(reading.createdAt).toLocaleString("zh-TW")}
                  </p>
                  {reading.rolls.map((r, i) => (
                    <p key={i}>
                      第 {i + 1} 次：D100 = {r.value}，剩餘 {r.remaining} 張 →{" "}
                      {r.accepted
                        ? `抽取第 ${r.position} 張（卡牌 ID ${r.cardId}）`
                        : "超出範圍，未移動任何牌"}
                    </p>
                  ))}
                </details>
              </>
            )}
          </>
        )}
        {page === "library" && (
          <>
            <div className="page-heading">
              <p className="eyebrow">THE TAROT LIBRARY</p>
              <h1>每張牌，都是一面鏡子。</h1>
              <p>
                78 張 RWS 架構牌義 · 傳統 RWS 牌面 · 固定牌義 {MEANING_VERSION}
              </p>
            </div>
            <div className="library-tools">
              <input
                aria-label="搜尋牌名或關鍵詞"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜尋牌名、英文或關鍵詞⋯"
              />
              <select
                aria-label="篩選牌組"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {["全部", "大阿爾克那", "權杖", "聖杯", "寶劍", "錢幣"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  ),
                )}
              </select>
            </div>
            <div className="library-grid">
              {cards
                .filter(
                  (c) =>
                    (filter === "全部" || c.suit === filter) &&
                    [c.name, c.en, ...c.upright, ...c.reversed]
                      .join()
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                )
                .map((c) => (
                  <article className="library-card panel" key={c.id}>
                    <Art card={c} />
                    <h3>{c.name}</h3>
                    <small>
                      {c.en} · {c.suit} {c.number}
                    </small>
                    <p>
                      <b>正位 · {c.upright.join("、")}</b>
                      <br />
                      {c.meaning}
                    </p>
                    <p>
                      <b>逆位 · {c.reversed.join("、")}</b>
                      <br />
                      {c.reverseMeaning}
                    </p>
                  </article>
                ))}
            </div>
          </>
        )}
        {page === "history" && (
          <>
            <div className="page-heading">
              <p className="eyebrow">YOUR PRIVATE JOURNAL</p>
              <h1>回看，與自己的對話。</h1>
              <p>
                紀錄只保存在此瀏覽器；清除網站資料會移除紀錄，建議另行匯出。
              </p>
            </div>
            <input
              className="history-search"
              aria-label="搜尋歷史紀錄"
              placeholder="搜尋問題、牌陣或牌名⋯"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {!history.length && (
              <div className="panel ritual">
                <h2>你的第一頁，還在等你。</h2>
                <button className="primary" onClick={start}>
                  開始一次占卜 ↗
                </button>
              </div>
            )}
            {history
              .filter((r) =>
                (
                  r.question +
                  r.spread +
                  r.cards.map((c) => c.card.name).join()
                ).includes(query),
              )
              .map((r) => (
                <article key={r.id} className="history-item panel">
                  <div>
                    <small>
                      {new Date(r.createdAt).toLocaleString("zh-TW")} ·{" "}
                      {r.spread}
                    </small>
                    <h3>{r.question || "留給此刻的指引"}</h3>
                    <p>
                      {r.cards
                        .map(
                          (c) =>
                            `${c.position}：${c.card.name}（${c.reversed ? "逆位" : "正位"}）`,
                        )
                        .join(" ／ ")}
                    </p>
                  </div>
                  <div className="history-actions">
                    <button
                      onClick={() => {
                        setReading(r);
                        setSaved(true);
                        setPage("reading");
                        setStep("result");
                        setFocusCard(null);
                        setSpread(
                          Math.max(
                            0,
                            spreads.findIndex((s) => s.name === r.spread),
                          ),
                        );
                        setDetail(false);
                        setFocusCard(null);
                      }}
                    >
                      查看
                    </button>
                    <button onClick={() => exportJSON(r)}>JSON</button>
                    <button onClick={() => safe(() => exportPNG(r))}>
                      PNG
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("確定刪除此筆占卜紀錄？"))
                          safe(async () => {
                            await deleteReading(r.id);
                            setHistory(await listReadings());
                          });
                      }}
                    >
                      刪除
                    </button>
                  </div>
                </article>
              ))}
          </>
        )}
      </main>
      <footer>
        <span>
          ✧　DICE TAROT <small>骰塔羅</small>
        </span>
        <p>以偶然為引，以自己為答案。</p>
        <small>
          僅供娛樂、文化體驗與自我反思，不作為醫療、法律或投資決策依據。
        </small>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
