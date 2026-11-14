/** Offline demo scripts (bilingual) — the show runs with zero Pollen spent. */

export interface DemoLine {
  agentIndex: 0 | 1;
  text: string;
}

const ENDLESS: Record<"en" | "fa", DemoLine[]> = {
  en: [
    { agentIndex: 0, text: "…and that brings us to the end of the interview! It's been lovely, Alex. I'll be in touch this week." },
    { agentIndex: 1, text: "Perfect, thank you — oh, sorry, one last question: does the team use the Azure deployment or the one on-prem? Just so I can read up tonight." },
    { agentIndex: 0, text: "Great question! It's hybrid, actually. Wait — do you have experience with hybrid? I should have asked that an hour ago." },
    { agentIndex: 1, text: "I do! Two years, technically three if you count the migration. Should I walk you through it now? I know we're done, it's just — it's a good story." },
    { agentIndex: 0, text: "You know what, let's hear it. Then I really have to run — oh no, my calendar just beeped. That might be my 2pm. Am I your 2pm? I am your 2pm." },
    { agentIndex: 1, text: "You are! But no worries — while you're here, quick one: what does success look like for this role in the first 90 days?" },
    { agentIndex: 0, text: "I'm so glad you asked, it's right here on my other tab. Anyway, so sorry, I've got to hop off — but actually, hold on, you haven't met the team lead yet. She's in the lobby. Could you wait five minutes?" },
    { agentIndex: 1, text: "Of course, take your time! Meanwhile I'll just prepare a few notes — Sandra? Sandra, are we still on mute?" },
    { agentIndex: 0, text: "Sorry! Yes! Still here. Okay, this is genuinely the last thing: benefits. Do you want dental? Everyone forgets to ask about dental." },
    { agentIndex: 1, text: "Honestly, yes — wait, is this an offer? Oh my gosh, sorry, forget I asked. Please, keep going, I've got nowhere else to be." },
  ],
  fa: [
    { agentIndex: 0, text: "…و همین‌طور به پایان مصاحبه می‌رسیم! حسابی خوش گذشت، الکس. همین هفته خبر می‌دهم." },
    { agentIndex: 1, text: "عالیه، ممنون — وای، ببخشید، یک سوال آخر: تیم شما دیپلوی را روی Azure انجام می‌دهد یا آن نسخه داخل سازمان؟ فقط برای اینکه امشب مطالعه کنم." },
    { agentIndex: 0, text: "سوال خوبی بود! راستش هیبریده. صبر کن — با معماری هیبرید کار کردی؟ این را باید یک ساعت پیش می‌پرسیدم." },
    { agentIndex: 1, text: "کردم! دو سال، تقریباً سه سال اگر مهاجرتش را بشماریم. همین حالا برات تعریف کنم؟ می‌دانم مصاحبه تمام شد، فقط — قصه خوبی است." },
    { agentIndex: 0, text: "ببین، تعریف کن. بعدش واقعاً باید بروم — اوه نه، تقویمم بوق زد. شاید این قرار ساعت دویم باشد. من قرار ساعت دویم؟ من قرار ساعتم!" },
    { agentIndex: 1, text: "هستی! ولی اشکالی ندارد — تا اینجایی، سریع بگویم: موفقیت در ۹۰ روز اول برای این موقعیت چه شکلی است؟" },
    { agentIndex: 0, text: "چه خوب که پرسیدی، همین‌جا تو تب دیگرم است. راستش معذرت می‌خواهم باید بپرم بیرون — اما صبر کن، تو هنوز با مدیر تیم آشنا نشده‌ای. او توی لابی است. پنج دقیقه می‌صرفد؟" },
    { agentIndex: 1, text: "البته، راحت باش! در همین حین من هم چند یادداشت آماده می‌کنم — ساندرا؟ ساندرا، هنوز روی میوت هستیم؟" },
    { agentIndex: 0, text: "ببخشید! بله! هستم. خوب، این واقعاً آخرین مورد است: بیمه تکمیلی. بیمه تکمیلی می‌خواهی؟ همه فراموش می‌کنند بپرسند." },
    { agentIndex: 1, text: "راستش بله — صبر کن، این دیگر پیشنهاد همکاری است؟ وایسا، فراموشم کن. لطفاً ادامه بده، هیچ‌جای دیگری هم نمی‌روم." },
  ],
};

const DEBATE: Record<"en" | "fa", DemoLine[]> = {
  en: [
    { agentIndex: 0, text: "Cats are simply better: independent, clean, and they've never once asked me to justify my life choices at 6am." },
    { agentIndex: 1, text: "Independent? A creature that ignores you until the food bowl moves is not a companion, it's a landlord. Dogs show up for you." },
    { agentIndex: 0, text: "Showing up is easy when you have no boundaries. My cat shows up exactly when it matters — like a great manager." },
    { agentIndex: 1, text: "A great manager would also not knock a glass off the table while maintaining eye contact. That's not independence, that's crime." },
    { agentIndex: 0, text: "Crime? That's performance art. Meanwhile your dog barks at the mailman like he owes him money. The mailman does not owe him money." },
    { agentIndex: 1, text: "He might. The dog knows things. Tell you what — cat people read the terms and conditions. Dog people skip to the fun. I rest my case." },
  ],
  fa: [
    { agentIndex: 0, text: "گربه‌ها کلاً بهترند: مستقل، تمیز، و حتی یک‌بار هم ساعت ۶ صبح از من نخواسته‌اند توضیح بدهم که چرا زندگی‌ام این‌شکلی است." },
    { agentIndex: 1, text: "مستقل؟ موجودی که تا کاسه‌اش جابه‌جا نشود سراغت نمی‌آید رفیق نیست، موجر است. سگ برایت می‌ایستد." },
    { agentIndex: 0, text: "ایستادن که هیچ کاری ندارد وقتی هیچ مرز و حدودی هم نداری. گربه‌ام دقیقاً وقتی می‌آید که مهم است — مثل یک مدیر خوب." },
    { agentIndex: 1, text: "مدیر خوب همچنین لیوان را با حفظ تماس چشمی از میز نمی‌اندازد پایین. این دیگر استقلال نیست، جنایت است." },
    { agentIndex: 0, text: "جنایت؟ این پرفورمنس‌آرت است. در عوض سگ تو برای مأمور پست جاع می‌زند انگار پول دارد به او بدهکار است. مأمور پست بدهکارش نیست." },
    { agentIndex: 1, text: "شاید هم بدهکار است. سگ‌ها چیزها را می‌دانند. این را بگویم — طرفداران گربه قوانین و شرایط را می‌خوانند. طرفداران سگ می‌پرند سراغ بخش تفریح. پرونده بسته شد." },
  ],
};

const PODCAST: Record<"en" | "fa", DemoLine[]> = {
  en: [
    { agentIndex: 0, text: "Welcome back to Late Night Static. Tonight's guest says he invented the snooze button. Twice. Otto, welcome!" },
    { agentIndex: 1, text: "Twice, Jules — the 1968 version had a flaw: it only snoozed once per lifetime. People hated it." },
    { agentIndex: 0, text: "I have questions. But first — the alarm clock that argues back. Talk to me." },
    { agentIndex: 1, text: "It wakes you up by debating why your morning plans are unrealistic. Success rate: 41%. Divorce rate: also 41%." },
    { agentIndex: 0, text: "Those numbers rhyme in a way that frightens me. Let's take a caller — no wait, we have no callers. Let's take a nap." },
    { agentIndex: 1, text: "Fittingly, I brought my napping meter. It reads this studio at 'dangerously cozy.' We should be cautious." },
  ],
  fa: [
    { agentIndex: 0, text: "به «تنهاییِ شبانه» خوش آمدید. مهمان امشب می‌گوید دکمه چرت‌زدن آلارم را او اختراع کرده. دو بار. اتو، خوش آمدی!" },
    { agentIndex: 1, text: "دو بار، ژول — نسخه ۱۹۶۸ یک ایراد داشت: در طول یک عمر فقط یک‌بار چرت می‌خورد. مردم بدشان آمد." },
    { agentIndex: 0, text: "حالم از سوال‌هایت گرفته نیست. اما اول — آلارمی که جواب‌تان را می‌دهد. بگو ببینم." },
    { agentIndex: 1, text: "صبحت را با بحث درباره غیرواقعی بودن برنامه‌هایت بیدارت می‌کند. نرخ موفقیت: ۴۱ درصد. نرخ طلاق: همین ۴۱ درصد." },
    { agentIndex: 0, text: "این اعداد طوری قافیه می‌شوند که آدم را می‌ترسانند. بگذار با یک تماس گیرنده ادامه بدهیم — نه صبر کن، گیرنده نداریم. بگذار یک چرت بزنیم." },
    { agentIndex: 1, text: "چه مناسب، من هم سنجشگر چرت آورده‌ام. روی این استودیو می‌خواند: «خطرناک دنج». بهتر است احتیاط کنیم." },
  ],
};

export function demoScript(scenarioId: string, lang: "en" | "fa"): DemoLine[] {
  const script =
    scenarioId === "debate-night" ? DEBATE : scenarioId === "late-night" ? PODCAST : ENDLESS;
  return script[lang];
}
