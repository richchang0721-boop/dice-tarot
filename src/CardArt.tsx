import { translate, type Locale } from "./i18n";
import { useState } from "react";
import type { Card } from "./cards";
import { getCardAsset } from "./deck";
function OriginalArt({
  card,
  locale = "zh-Hant",
  back = false,
  reversed = false,
}: {
  locale?: Locale;
  card?: Card;
  back?: boolean;
  reversed?: boolean;
}) {
  const n = card?.id ?? 0;
  const symbol =
    card?.suit === "聖杯"
      ? "♜"
      : card?.suit === "寶劍"
        ? "⚔"
        : card?.suit === "錢幣"
          ? "✦"
          : card?.suit === "權杖"
            ? "⚚"
            : "☾";
  return (
    <svg
      className={"card-art " + (reversed ? "reverse" : "")}
      viewBox="0 0 200 330"
      role="img"
      aria-label={
        back
          ? translate(locale, "塔羅牌背")
          : locale === "en"
            ? `${card?.en} card artwork${reversed ? ", reversed" : ""}`
            : `${card?.name}原創象徵牌面${reversed ? "逆位" : ""}`
      }
    >
      <rect
        x="2"
        y="2"
        width="196"
        height="326"
        rx="8"
        fill={back ? "#132f38" : "#e0d5b7"}
        stroke="#b89c62"
        strokeWidth="3"
      />
      <rect
        x="12"
        y="12"
        width="176"
        height="306"
        rx="3"
        fill="none"
        stroke={back ? "#8e845b" : "#566254"}
      />
      <path
        d="M20 65L180 265M180 65L20 265M100 25L175 165L100 305L25 165Z"
        fill="none"
        stroke={back ? "#827650" : "#9d9e79"}
        opacity=".6"
      />
      {Array.from({ length: 9 }, (_, i) => (
        <circle
          key={i}
          cx={28 + ((i * 37 + n * 13) % 145)}
          cy={40 + ((i * 53 + n * 17) % 245)}
          r="2"
          fill="#b89c62"
        />
      ))}
      <circle
        cx="100"
        cy="150"
        r="57"
        fill={
          back ? "#183b42" : ["#8a9b83", "#b59166", "#718f99", "#a0a37b"][n % 4]
        }
        stroke="#b89c62"
      />
      <circle
        cx="100"
        cy="150"
        r="46"
        fill="none"
        stroke={back ? "#b89c62" : "#e5d9b5"}
      />
      <text
        x="100"
        y="174"
        textAnchor="middle"
        fontSize="64"
        fill={back ? "#c2a970" : "#f2e7cb"}
      >
        {back ? "✧" : symbol}
      </text>
      {!back && (
        <>
          <text x="100" y="45" textAnchor="middle" fontSize="16" fill="#293b36">
            {card?.number} · {translate(locale, card?.suit ?? "")}
          </text>
          <path
            d={`M25 260 Q65 ${200 + (n % 35)} 100 260 T175 260L175 285L25 285Z`}
            fill="#4e695e"
          />
          <text
            x="100"
            y="305"
            textAnchor="middle"
            fontSize="16"
            fill="#283f39"
          >
            {card?.name}
          </text>
        </>
      )}{" "}
      {back && (
        <text
          x="100"
          y="280"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="3"
          fill="#c2a970"
        >
          DICE TAROT
        </text>
      )}
    </svg>
  );
}

export function Art(props: {
  locale?: Locale;
  card?: Card;
  back?: boolean;
  reversed?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const asset =
    props.card && !props.back ? getCardAsset(props.card.id) : undefined;
  return (
    <div
      className="card-art-frame"
      data-card-id={props.card?.id}
      data-card-number={props.card?.number}
    >
      {asset && !failed ? (
        <img
          className={"card-art " + (props.reversed ? "reverse" : "")}
          src={asset.path}
          alt={
            props.locale === "en"
              ? `${props.card!.en} (${props.card!.number}), ${props.reversed ? "reversed" : "upright"}`
              : props.card!.name +
                "（" +
                props.card!.number +
                "）" +
                (props.reversed ? "逆位" : "正位")
          }
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        <OriginalArt {...props} />
      )}
    </div>
  );
}
