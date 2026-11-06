import { cards, type Card } from "./cards";
import { translate, type Locale } from "./i18n";

type MeaningRow = [
  upright: string,
  reversed: string,
  meaning: string,
  reverseMeaning: string,
];
const major: MeaningRow[] = [
  [
    "Beginnings, freedom, trust",
    "Recklessness, hesitation, avoidance",
    "Take the first step with curiosity and leave room for the unknown.",
    "Check your preparation. Freedom still needs boundaries.",
  ],
  [
    "Action, resources, creation",
    "Manipulation, distraction, daydreaming",
    "Use the resources at hand to turn an idea into action.",
    "Notice gaps between words and actions, then take one practical step.",
  ],
  [
    "Intuition, stillness, subconscious",
    "Secrecy, noise, detachment",
    "Set judgment aside and listen to what surfaces in quiet moments.",
    "Distinguish intuition from anxiety and clarify what remains unsaid.",
  ],
  [
    "Nurture, abundance, senses",
    "Dependence, depletion, overgiving",
    "Patiently tend to the people and projects that are growing.",
    "Replenish your energy before caring for others.",
  ],
  [
    "Order, responsibility, stability",
    "Rigidity, control, disorder",
    "Set clear boundaries and build a structure you can sustain.",
    "Check whether the rules are too tight. Make room for flexibility alongside responsibility.",
  ],
  [
    "Tradition, learning, belief",
    "Conformity, questioning, restriction",
    "Learn from trusted experience and understand the values you share.",
    "Revisit beliefs that may no longer serve you.",
  ],
  [
    "Connection, choice, harmony",
    "Imbalance, disagreement, tension",
    "Make choices that match your values and speak honestly.",
    "Clarify each person's needs and address unresolved differences.",
  ],
  [
    "Willpower, direction, progress",
    "Loss of control, obstacles, impatience",
    "Bring opposing forces together and focus on a clear goal.",
    "Slow down and adjust course before relying on willpower alone.",
  ],
  [
    "Courage, patience, gentleness",
    "Self-doubt, suppression, impulse",
    "Meet difficulty with gentleness and steadiness.",
    "Accept vulnerability and notice feelings you have been holding back.",
  ],
  [
    "Reflection, solitude, exploration",
    "Isolation, withdrawal, confusion",
    "Set aside quiet time to find your own answer.",
    "Notice when solitude becomes isolation and reach out when you need company.",
  ],
  [
    "Change, cycles, opportunity",
    "Setbacks, resistance, imbalance",
    "Look for opportunities in change and adjust your pace.",
    "When circumstances are beyond your control, reconsider how you respond.",
  ],
  [
    "Fairness, consequences, honesty",
    "Bias, imbalance, evasion",
    "Weigh choices against the facts and own their consequences.",
    "Look for bias and missing information before revising your judgment.",
  ],
  [
    "Pause, perspective, release",
    "Delay, attachment, wasted effort",
    "Pause and look at the situation from another angle.",
    "Ask whether waiting still helps, and let go of effort that serves no purpose.",
  ],
  [
    "Endings, transformation, renewal",
    "Resistance, stagnation, attachment",
    "Say goodbye to a finished chapter and make room for what follows.",
    "Identify what makes it hard to let go and take the transition in stages.",
  ],
  [
    "Balance, moderation, pacing",
    "Excess, conflict, haste",
    "Adjust the proportions and pace so different needs can coexist.",
    "Notice where you are overcommitted and return to a sustainable rhythm.",
  ],
  [
    "Restriction, desire, attachment",
    "Release, awareness, breaking habits",
    "Notice which habits and bargains limit your freedom to choose.",
    "Identify what binds you and practise reclaiming your choices.",
  ],
  [
    "Disruption, revelation, collapse",
    "Avoidance, aftershocks, fear",
    "When familiar structures shake, focus on what can steady you today.",
    "Acknowledge the cracks and rebuild the foundations gradually.",
  ],
  [
    "Hope, healing, inspiration",
    "Disappointment, depletion, doubt",
    "Restore trust through small and steady actions.",
    "Allow yourself to be tired and look for small sources of support.",
  ],
  [
    "Dreams, uncertainty, emotions",
    "Clarity, unease, lifting fog",
    "Allow uncertainty while the facts are unclear and notice what you feel.",
    "Check assumptions gradually and separate facts from projection.",
  ],
  [
    "Joy, clarity, vitality",
    "Low spirits, overcompensation, delay",
    "Express yourself openly and appreciate the progress you can see.",
    "Ease the pressure to perform and rediscover simple pleasures.",
  ],
  [
    "Awakening, reflection, calling",
    "Self-blame, avoidance, hesitation",
    "Look back at your journey and respond to what feels important now.",
    "Ease harsh self-judgment and face the decisions still awaiting you.",
  ],
  [
    "Completion, integration, fulfilment",
    "Loose ends, pause, gaps",
    "Recognise the end of a cycle and bring its lessons together.",
    "Identify what remains unfinished and give this chapter a clear ending.",
  ],
];
const wands: MeaningRow[] = [
  [
    "Inspiration, vitality, initiative",
    "Burnout, delay, fading enthusiasm",
    "Turn fresh inspiration into a project you can start.",
    "Clarify your motivation and give early ideas time to develop.",
  ],
  [
    "Planning, foresight, choice",
    "Apprehension, limits, weak planning",
    "Build on what you have and consider your next direction.",
    "Check whether the plan has practical steps behind it.",
  ],
  [
    "Expansion, travel, waiting",
    "Delays, obstacles, limited outlook",
    "Look further ahead and give your efforts time to show results.",
    "Reassess external conditions and adjust the pace of expansion.",
  ],
  [
    "Celebration, belonging, stability",
    "Discord, insecurity, delayed celebration",
    "Enjoy the stability you built together and share the results with your supporters.",
    "Notice unspoken concerns at home or within the team.",
  ],
  [
    "Competition, friction, practice",
    "Avoidance, infighting, easing tension",
    "Look for value in disagreement without treating differences as hostility.",
    "Distinguish peace from suppression and address unresolved disputes.",
  ],
  [
    "Recognition, victory, confidence",
    "Disappointment, vanity, lack of recognition",
    "Accept recognition for your work and acknowledge those who helped.",
    "Reclaim your sense of worth from external approval.",
  ],
  [
    "Conviction, courage, defence",
    "Overwhelm, yielding, exhaustion",
    "Hold important boundaries under pressure and choose which challenges matter.",
    "Ease unnecessary defences and redirect your limited energy.",
  ],
  [
    "Speed, messages, progress",
    "Delay, impatience, confusion",
    "Events may accelerate, so keep communication and preparation up to speed.",
    "Slow down to avoid misunderstandings caused by unclear messages.",
  ],
  [
    "Resilience, vigilance, persistence",
    "Fatigue, suspicion, giving up",
    "Recognise how far you have come, protect yourself and stay flexible.",
    "Consider the cost of persisting and allow yourself rest or help.",
  ],
  [
    "Burden, duty, strain",
    "Relief, overload, evasion",
    "Check whether you are carrying too much and break tasks into manageable parts.",
    "Release responsibilities that are not yours or address obligations you have put off.",
  ],
];
const cups: MeaningRow[] = [
  [
    "Emotional beginnings, acceptance, nurture",
    "Withdrawal, suppression, depletion",
    "Make room for feelings and connection to grow.",
    "Attend to unacknowledged emotions and replenish your own energy.",
  ],
  [
    "Trust, union, equality",
    "Discord, distance, inequality",
    "Respond honestly and build a connection based on mutual respect.",
    "Look at what each person gives, expects and needs to protect.",
  ],
  [
    "Friendship, celebration, support",
    "Cliques, excess, isolation",
    "Share joy with people you trust and accept their support.",
    "Notice whether socialising nourishes you and set your limits accordingly.",
  ],
  [
    "Contemplation, apathy, missed opportunities",
    "Openness, awareness, restlessness",
    "Pause to notice your needs and look for opportunities you may have overlooked.",
    "Reengage with daily life and notice what truly interests you.",
  ],
  [
    "Loss, grief, regret",
    "Acceptance, recovery, release",
    "Give yourself room to grieve and notice the support still available.",
    "Make sense of regret over time and allow yourself to move forward.",
  ],
  [
    "Childhood, memory, kindness",
    "Nostalgia, idealisation, growth",
    "Draw comfort from tender memories and hold on to simple kindness.",
    "Distinguish real memories from an idealised past and return to the present.",
  ],
  [
    "Imagination, options, temptation",
    "Focus, confusion, clarity",
    "Check what each option actually requires before pursuing it.",
    "Set aside daydreams and choose one direction you can act on.",
  ],
  [
    "Departure, seeking, change of direction",
    "Attachment, escape, return",
    "Recognise what no longer satisfies you and seek something more meaningful.",
    "Ask whether leaving would help you grow or help you avoid a problem.",
  ],
  [
    "Contentment, enjoyment, wishes",
    "Emptiness, craving, superficial satisfaction",
    "Appreciate what you already enjoy and make room for pleasure in everyday life.",
    "Ask whether an apparently ideal situation meets your deeper needs.",
  ],
  [
    "Harmony, family, fulfilment",
    "Unmet expectations, discord, different values",
    "Cherish supportive relationships and build happiness into daily life.",
    "Release the ideal of a perfect relationship and discuss differing needs honestly.",
  ],
];
const swords: MeaningRow[] = [
  [
    "Clarity, truth, breakthrough",
    "Confusion, misjudgment, harsh words",
    "Think clearly through the confusion and face the facts honestly.",
    "Check the facts before drawing conclusions and notice whether your words hurt others.",
  ],
  [
    "Stalemate, dilemma, defensiveness",
    "Overload, avoidance, choice",
    "Acknowledge the dilemma and gather what you need to decide.",
    "Stop waiting for a perfect answer and approach the choice in steps.",
  ],
  [
    "Heartache, separation, grief",
    "Healing, release, suppressed grief",
    "Let your sadness be seen and care honestly for what hurts.",
    "Give healing time and allow your feelings to surface.",
  ],
  [
    "Rest, recovery, pause",
    "Overwork, restlessness, renewal",
    "Step away from what drains you and give yourself time to recover.",
    "Check whether you have rested enough and ease back into action.",
  ],
  [
    "Conflict, cost, victory and defeat",
    "Reconciliation, resentment, withdrawal",
    "Consider the cost of winning the argument and which relationships are worth protecting.",
    "Face lingering resentment and find a way to stop causing harm.",
  ],
  [
    "Transition, relief, progress",
    "Stagnation, baggage, resistance",
    "Carry your experience out of the chaos and towards calmer ground.",
    "Name what is holding you back and accept support through the transition.",
  ],
  [
    "Strategy, concealment, independence",
    "Honesty, disclosure, self-deception",
    "Use strategy while checking whether you are avoiding necessary honesty.",
    "Sort out the unspoken facts and be honest with yourself.",
  ],
  [
    "Confinement, limits, helplessness",
    "Freedom, agency, inner barriers",
    "Distinguish real limits from self-imposed ones and find one step you can take.",
    "Recognise the choices you already have and loosen the restrictions gradually.",
  ],
  [
    "Anxiety, sleeplessness, self-blame",
    "Support, relief, deeper worries",
    "Speak your worries aloud and distinguish imagined outcomes from present facts.",
    "Accept help and keep attending to stress that has not eased.",
  ],
  [
    "Ending, pain, rock bottom",
    "Recovery, delayed endings, renewal",
    "Acknowledge the end of a hard chapter and make recovery a priority.",
    "Allow recovery to unfold and face what needs to end.",
  ],
];
const pentacles: MeaningRow[] = [
  [
    "Resources, opportunity, practical beginnings",
    "Missed chances, scarcity, poor planning",
    "Put available resources towards a concrete, sustainable beginning.",
    "Check costs and conditions and account for practical needs.",
  ],
  [
    "Balance, flexibility, multitasking",
    "Imbalance, overload, unclear priorities",
    "Adjust your pace across responsibilities and stay flexible about what is realistic.",
    "Take on fewer things at once and reorder your priorities.",
  ],
  [
    "Skill, collaboration, learning",
    "Poor coordination, uneven quality, working alone",
    "Respect different skills and collaborate to do good work.",
    "Clarify roles and standards and fill the gaps in teamwork.",
  ],
  [
    "Security, preservation, holding on",
    "Letting go, loss of control, scarcity mindset",
    "Build a secure foundation and notice when fear makes you hold on too tightly.",
    "Adjust your spending and need for control, and ask what feeds the insecurity.",
  ],
  [
    "Hardship, scarcity, isolation",
    "Seeking help, improvement, refusing support",
    "Acknowledge practical difficulties and look for resources that can support you.",
    "Notice chances to recover and let yourself accept help.",
  ],
  [
    "Giving, mutual aid, fair exchange",
    "Inequality, strings attached, obligation",
    "Give within your means and respect the recipient's autonomy.",
    "Look at the power and expectations behind an exchange of resources.",
  ],
  [
    "Cultivation, patience, evaluation",
    "Impatience, low returns, reinvestment",
    "Review the results of long-term effort and adjust your approach patiently.",
    "Ask whether further investment is worthwhile, regardless of past costs.",
  ],
  [
    "Practice, focus, craftsmanship",
    "Carelessness, perfectionism, burnout",
    "Refine your skills by paying attention to detail and practising consistently.",
    "Reconnect with the purpose of the work and balance quality against workload.",
  ],
  [
    "Independence, abundance, refinement",
    "Dependence, appearances, overwork",
    "Appreciate the life you have built and enjoy the freedom your work provides.",
    "Consider the cost of success and rebuild your inner sense of security.",
  ],
  [
    "Legacy, stability, family resources",
    "Resource disputes, instability, restrictive traditions",
    "Plan shared resources and support with the long term in mind.",
    "Discuss differences about resources and values, and soften rigid expectations.",
  ],
];
const court: MeaningRow[] = [
  [
    "Curiosity, messages, learning",
    "Immaturity, distraction, hesitation",
    "Explore with a beginner's mind and notice new information.",
    "Turn curiosity into practice and check whether the information is reliable.",
  ],
  [
    "Pursuit, action, journey",
    "Haste, stagnation, fixation",
    "Move with purpose and pay attention to the impact of your actions.",
    "Adjust your pace and watch for impulsiveness or stubbornness.",
  ],
  [
    "Maturity, care, awareness",
    "Depletion, dependence, imbalance",
    "Care for yourself and those around you with mature awareness.",
    "Restore your boundaries and make space for your own needs.",
  ],
  [
    "Mastery, leadership, responsibility",
    "Control, abuse of power, rigidity",
    "Manage resources with steady judgment and take responsibility.",
    "Check whether power and responsibility are balanced, and practise listening.",
  ],
];
function withCourt(numberCards: MeaningRow[], theme: string): MeaningRow[] {
  return [
    ...numberCards,
    ...court.map(([up, down, meaning, reverse]): MeaningRow => [
      up,
      down,
      `${theme} ${meaning}`,
      `${theme} ${reverse}`,
    ]),
  ];
}
const meanings = [
  ...major,
  ...withCourt(wands, "When it comes to action, passion and creativity:"),
  ...withCourt(cups, "When it comes to emotions and relationships:"),
  ...withCourt(
    swords,
    "When it comes to thinking, communication and judgment:",
  ),
  ...withCourt(
    pentacles,
    "When it comes to work, resources and everyday life:",
  ),
];

export function localizeCard(card: Card, locale: Locale): Card {
  if (locale !== "en") return card;
  const row = meanings[card.id];
  const original = cards[card.id];
  // Keep saved interpretations intact if they differ from the supported source text.
  const matchesSource =
    original &&
    original.meaning === card.meaning &&
    original.reverseMeaning === card.reverseMeaning &&
    original.upright.join("、") === card.upright.join("、") &&
    original.reversed.join("、") === card.reversed.join("、");
  const localized = {
    ...card,
    name: card.en,
    suit: translate(locale, card.suit),
  };
  if (!row || !matchesSource) return localized;
  const [upright, reversed, meaning, reverseMeaning] = row;
  return {
    ...localized,
    upright: upright.split(", "),
    reversed: reversed.split(", "),
    meaning,
    reverseMeaning,
  };
}
