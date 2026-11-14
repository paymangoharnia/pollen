/** Bilingual strings (EN/FA) + direction helpers for the whole app. */

export type Lang = "en" | "fa";
export const LANGS: Lang[] = ["en", "fa"];
const LANG_KEY = "pollen-lang";

export function dirFor(lang: Lang): "ltr" | "rtl" {
  return lang === "fa" ? "rtl" : "ltr";
}

export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "fa" || saved === "en") return saved;
  } catch {
    // localStorage can be unavailable (private mode) — fall through
  }
  return navigator.language?.toLowerCase().startsWith("fa") ? "fa" : "en";
}

export function storeLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore
  }
}

export interface Strings {
  title: string;
  footer: string;
  poweredBy: string;
  demoPre: string;
  demoMode: string;
  demoPost: string;
  walletFail: string;
  live: string;
  demoBadge: string;
  topicLabel: string;
  agentName: string;
  agentEmoji: string;
  agentPersonaPh: string;
  model: string;
  stageEmpty: string;
  thinking: (name: string) => string;
  start: string;
  resume: string;
  pause: string;
  step: string;
  reset: string;
  hostPh: string;
  send: string;
  speedLabel: string;
  follow: string;
  shareLink: string;
  linkCopied: string;
  copyTranscript: string;
  transcriptCopied: string;
  errBudget: string;
  errBalance: string;
  errContent: string;
  errEmpty: string;
}

const en: Strings = {
  title: "AI Dialog — two agents, one stage",
  footer: "Demo mode runs offline and free · Live mode uses your own Pollen ·",
  poweredBy: "powered by Pollinations",
  demoPre: "You're in",
  demoMode: "offline demo mode",
  demoPost:
    "— the show runs on a canned script, no Pollen spent. To go live, this deployment needs its Pollinations app key configured.",
  walletFail: "Wallet widget failed to load — demo mode stays available.",
  live: "● live",
  demoBadge: "◐ demo",
  topicLabel: "Topic / setting",
  agentName: "Agent name",
  agentEmoji: "Agent emoji",
  agentPersonaPh: "Describe who this agent is, how it talks, what it wants…",
  model: "Model",
  stageEmpty: "The stage is empty. Pick a scenario, tweak the agents, then hit Start.",
  thinking: (name) => `${name} is thinking…`,
  start: "Start",
  resume: "Resume",
  pause: "Pause",
  step: "Step",
  reset: "Reset",
  hostPh: "Whisper to an agent (director's note)…",
  send: "Send",
  speedLabel: "Speed",
  follow: "Follow new lines",
  shareLink: "Copy share link",
  linkCopied: "✓ Link copied",
  copyTranscript: "Copy transcript",
  transcriptCopied: "✓ Transcript copied",
  errBudget: "Your connected key's budget is used up. Reconnect the wallet for a fresh scoped key.",
  errBalance: "Not enough Pollen left on the connected key.",
  errContent: "The model declined this content — tweak the topic or personas.",
  errEmpty: "Model returned an empty line — try again.",
};

const fa: Strings = {
  title: "AI Dialog — دو ایجنت، یک صحنه",
  footer: "حالت دمو آفلاین و رایگان است · حالت لایو با پولنِ خودِ شماست ·",
  poweredBy: "قدرت‌گرفته از Pollinations",
  demoPre: "شما در",
  demoMode: "حالت دموی آفلاین",
  demoPost:
    "هستید — نمایش با اسکریپت آماده اجرا می‌شود و هیچ پولنی خرج نمی‌کند. برای لایو شدن، این نسخه به App Key پولینیشنز نیاز دارد.",
  walletFail: "ویجت کیف پول لود نشد — حالت دمو همچنان در دسترس است.",
  live: "● لایو",
  demoBadge: "◐ دمو",
  topicLabel: "موضوع / فضا",
  agentName: "اسم ایجنت",
  agentEmoji: "ایموجی ایجنت",
  agentPersonaPh: "بگو این ایجنت کیست، چطور حرف می‌زند و چه می‌خواهد…",
  model: "مدل",
  stageEmpty: "صحنه خالی است. سناریو را انتخاب کن، ایجنت‌ها را تنظیم کن، بعد شروع را بزن.",
  thinking: (name) => `${name} دارد فکر می‌کند…`,
  start: "شروع",
  resume: "ادامه",
  pause: "توقف",
  step: "یک نوبت",
  reset: "از نو",
  hostPh: "برای ایجنت نجوا کن (یادداشت کارگردان)…",
  send: "بفرست",
  speedLabel: "سرعت",
  follow: "دنبال کردن خط‌های جدید",
  shareLink: "کپی لینک اشتراک",
  linkCopied: "✓ لینک کپی شد",
  copyTranscript: "کپی متن گفتگو",
  transcriptCopied: "✓ متن کپی شد",
  errBudget: "بودجه کلید متصل تمام شده. کیف پول را دوباره وصل کن تا کلید تازه بگیری.",
  errBalance: "پولن کافی روی کلید متصل نمانده.",
  errContent: "مدل با این محتوا موافقت نکرد — موضوع یا پرسوناها را عوض کن.",
  errEmpty: "مدل خط خالی برگرداند — دوباره تلاش کن.",
};

export function strings(lang: Lang): Strings {
  return lang === "fa" ? fa : en;
}
