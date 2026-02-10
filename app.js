const els = {
  homeView: document.getElementById("homeView"),
  courseView: document.getElementById("courseView"),
  flashCard: document.getElementById("flashCard"),
  progressDots: document.getElementById("progressDots"),
  tinyFill: document.getElementById("tinyFill"),
  hintText: document.getElementById("hintText"),
  courseTitle: document.getElementById("courseTitle"),
  courseKicker: document.getElementById("courseKicker"),
  courseMeta: document.getElementById("courseMeta"),
  backHomeBtn: document.getElementById("backHomeBtn"),
  nextBtn: document.getElementById("nextBtn"),
  prevBtn: document.getElementById("prevBtn"),
  startBtn: document.getElementById("startBtn"),
  howBtn: document.getElementById("howBtn"),
  modal: document.getElementById("modal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  backToTopBtn: document.getElementById("backToTopBtn"),
  downloadBtn: document.getElementById("downloadBtn"),
  countrySelect: document.getElementById("countrySelect"),
  langSelect: document.getElementById("langSelect"),
  soundBtn: document.getElementById("soundBtn"),
  carouselTrack: document.getElementById("carouselTrack"),
  carouselDots: document.getElementById("carouselDots"),
  avatarWrap: document.getElementById("avatarWrap"),
  avatarBubble: document.getElementById("avatarBubble"),
};

const TOPIC_META = {
  trueStories: { title: "True Stories", kicker: "MY KNOWLEDGE" },
  yourBody: { title: "Your Body", kicker: "MY KNOWLEDGE" },
  sex: { title: "Sex", kicker: "MY KNOWLEDGE" },
  relationships: { title: "Relationships", kicker: "MY KNOWLEDGE" },
};

const LS_KEY = "tuneme_course_state_v3";

/* --------------------------
   Simple i18n dictionary
   (You can expand these translations later)
   -------------------------- */
const I18N = {
  en: {
    pickOne: "Pick one:",
    correct: "Correct ✅ — you can go Next.",
    tryAgain: "Not quite. Try again 💡",
    tipUnlock: "Tip: Choose an answer to unlock Next.",
    tipNav: "Tip: Use Next/Back to move through the cards.",
    counsellorSays: "Counsellor says:",
    storyTime: "Story time 📖",
    quickCheck: "Quick check ✅",
    keepGoing: "Keep going 👉",
    finished: "Nice work ✅ Choose another topic!",
    countrySet: (c)=>`Country set: ${c} 🌍`,
    courseMeta: (c, n, lang)=>`Country: ${c} • Cards: ${n} • Lang: ${lang.toUpperCase()}`,
    soundOn: "🔊 Sound",
    soundOff: "🔇 Sound",
  },

  // NOTE: These are simple, clear translations. You can refine wording with a native speaker later.
  ny: {
    pickOne: "Sankhani chimodzi:",
    correct: "Ndizoona ✅ — mutha kupita Patsogolo.",
    tryAgain: "Sizinayende. Yesaninso 💡",
    tipUnlock: "Langizo: Sankhani yankho kuti mutsegule Patsogolo.",
    tipNav: "Langizo: Gwiritsani Ntchito Patsogolo/Kumbuyo.",
    counsellorSays: "Wothandiza (counsellor) akunena:",
    storyTime: "Nkhani 📖",
    quickCheck: "Tiyese ✅",
    keepGoing: "Pitilira 👉",
    finished: "Zabwino ✅ Sankhani mutu wina!",
    countrySet: (c)=>`Dziko: ${c} 🌍`,
    courseMeta: (c, n, lang)=>`Dziko: ${c} • Makadi: ${n} • Chilankhulo: ${lang.toUpperCase()}`,
    soundOn: "🔊 Phokoso",
    soundOff: "🔇 Phokoso",
  },

  bem: {
    pickOne: "Sankeni cimo:",
    correct: "Icine ✅ — mwalefwaya ukuya pa Next.",
    tryAgain: "Tafilubila. Yesaninso 💡",
    tipUnlock: "Amashiwi: Sankeni icishinka ukuti mutendele ku Next.",
    tipNav: "Amashiwi: Gwilisheni Next/Back.",
    counsellorSays: "Uwa kwafwa (counsellor) alelanda:",
    storyTime: "Insanshi 📖",
    quickCheck: "Yeseni ✅",
    keepGoing: "Pitikeni 👉",
    finished: "Mwapanga bwino ✅ Sankeni topic imwe!",
    countrySet: (c)=>`Icalo: ${c} 🌍`,
    courseMeta: (c, n, lang)=>`Icalo: ${c} • Amakadi: ${n} • Ululimi: ${lang.toUpperCase()}`,
    soundOn: "🔊 Ilyo",
    soundOff: "🔇 Ilyo",
  },

  loz: {
    pickOne: "Kgeta imwe:",
    correct: "Ki nnete ✅ — mwa kona ku ya kwa pele.",
    tryAgain: "Ha se nnete. Leka hape 💡",
    tipUnlock: "Keletšo: Kgeta karabo ku bula kwa pele.",
    tipNav: "Keletšo: Sebedisa Next/Back.",
    counsellorSays: "Mueletsi (counsellor) u bulela:",
    storyTime: "Mulumo 📖",
    quickCheck: "Teko ✅",
    keepGoing: "Tswela pele 👉",
    finished: "Mubonele ✅ Kgeta topic e nngwe!",
    countrySet: (c)=>`Naha: ${c} 🌍`,
    courseMeta: (c, n, lang)=>`Naha: ${c} • Dikarete: ${n} • Puo: ${lang.toUpperCase()}`,
    soundOn: "🔊 Modumo",
    soundOff: "🔇 Modumo",
  }
};

function t(key, ...args){
  const lang = state.lang;
  const dict = I18N[lang] || I18N.en;
  const v = dict[key] ?? I18N.en[key];
  return typeof v === "function" ? v(...args) : v;
}

/* --------------------------
   Content builders
   -------------------------- */
function card(label, bigWord, pillHeadline, body, tip, mood="happy"){
  return { type:"card", label, bigWord, pillHeadline, body, tip, mood };
}
function story(label, title, character, scene, body, counsellorTip, mood="concerned"){
  return { type:"story", label, title, character, scene, body, counsellorTip, mood };
}
function quizTF(label, question, answerTrue, mood="confused"){
  return { type:"quiz", label, question, options:["True","False"], correctIndex: answerTrue ? 0 : 1, mood };
}
function quizMCQ(label, question, options, correctIndex, mood="confused"){
  return { type:"quiz", label, question, options, correctIndex, mood };
}

/* --------------------------
   Zambia-focused UN micro-course content
   (Safe, non-explicit, CSE-aligned)
   Each topic ~8 items (mix story + cards + quizzes)
   -------------------------- */
const CONTENT = {
  Zambia: {
    carousel: [
      { title:"DON’T Drink And…", sub:"Things never to do under the influence" },
      { title:"Know your limits", sub:"‘Party too hard’ checklist" },
      { title:"DMs getting weird?", sub:"Set boundaries without drama" },
      { title:"Dating online?", sub:"Respect + privacy first" },
      { title:"Body changes", sub:"What’s normal in puberty" },
      { title:"True Stories", sub:"Learn from real-life moments" },
    ],
    topics: {
      relationships: [
        story("RELATIONSHIPS", "Read Receipts & Real Stress",
          "Leya (20)", "‘Seen’ messages",
          "Every time a message stayed on ‘seen’, anxiety hit. Leya started replying just to avoid conflict — even when tired.",
          "You don’t owe instant replies. If someone punishes you for boundaries, that’s a red flag. Protect your peace.",
          "concerned"
        ),
        quizTF("RELATIONSHIPS CHECK", "True or False: You owe people instant replies all the time.", false),

        story("RELATIONSHIPS", "The ‘Password Test’",
          "Brian (18)", "Online dating",
          "Brian was told: “If you trust me, share your password.” It sounded like love — but felt like control.",
          "Passwords are not proof of love. Trust grows with respect, not demands. Say no, and stay safe.",
          "concerned"
        ),
        quizMCQ("RELATIONSHIPS CHECK", "Someone asks for your password. Best response?",
          ["Share it to prove trust", "Say no and keep your privacy", "Send a screenshot of it", "Ignore but keep chatting"], 1),

        card("RELATIONSHIPS", "RESPECT", "INFORMATION HERE",
          "Healthy relationships feel safe. Respect means you can say no, take space, and be yourself without fear.",
          "If love feels like pressure, pause and check the pattern.",
          "happy"
        ),

        story("RELATIONSHIPS", "When ‘Jokes’ Hurt",
          "Chanda (17)", "Friend group chats",
          "Chanda kept being teased in group chats. People said “it’s just jokes”, but it started feeling like bullying.",
          "If it hurts, it matters. Speak up, mute the chat, and get support. Respect is the baseline.",
          "concerned"
        ),
        quizTF("RELATIONSHIPS CHECK", "True or False: If it hurts you, it still matters even if they call it a joke.", true),

        card("RELATIONSHIPS", "BOUNDARIES", "INFORMATION HERE",
          "Boundaries protect your time, emotions, body, and privacy. You can set them without explaining yourself forever.",
          "Mute, block, and report are safety tools — not rudeness.",
          "happy"
        ),
      ],

      sex: [
        card("SEX TALK 101", "CONSENT", "INFORMATION HERE",
          "Consent is clear, willing, and ongoing. Pressure, fear, or silence is not consent. You can change your mind anytime.",
          "If someone respects you, they won’t rush you.",
          "concerned"
        ),
        quizTF("SEX CHECK", "True or False: Silence means yes.", false),

        story("SEX TALK 101", "The ‘Fast Forward’ Feeling",
          "Neo (18)", "A date that moved too quickly",
          "Neo liked the attention, but felt uncomfortable when things started moving too fast. Saying “wait” felt difficult.",
          "You’re allowed to slow down. A respectful person checks in, listens, and accepts your boundary.",
          "concerned"
        ),
        quizMCQ("SEX CHECK", "What’s the healthiest move if you feel rushed?",
          ["Stay quiet so it ends", "Say you’re not ready and pause", "Agree to keep them", "Let them decide"], 1),

        story("SEX TALK 101", "The ‘Prove You Love Me’ Line",
          "Mike (19)", "Dating pressure",
          "Mike heard: “If you love me, prove it.” It felt like a test, not a relationship.",
          "Real love doesn’t use guilt. Respect sounds like: “No pressure. We can wait.”",
          "concerned"
        ),
        quizMCQ("SEX CHECK", "Which statement shows respect?",
          ["‘If you love me, prove it.’", "‘No worries, we can wait.’", "‘Everyone does it.’", "‘Don’t be childish.’"], 1),

        card("SEX TALK 101", "SAFETY", "INFORMATION HERE",
          "Being informed helps you make safer choices. Accurate info > rumors. If you need support, trusted health services can help.",
          "Asking questions is smart, not embarrassing.",
          "happy"
        ),
      ],

      yourBody: [
        card("YOUR BODY", "GROWTH", "INFORMATION HERE",
          "Everyone’s body develops on its own timeline. Early, late, fast, slow — it can all be normal.",
          "Comparing your body to others can steal confidence.",
          "happy"
        ),
        quizTF("YOUR BODY CHECK", "True or False: Being a late bloomer means something is wrong.", false),

        story("YOUR BODY", "Filters & Confidence",
          "Dineo (16)", "Selfies + social media",
          "Dineo started comparing real life to filtered posts. Posting became stressful. Confidence dropped.",
          "Unfollow what triggers you. Take breaks. Real bodies are valid bodies.",
          "concerned"
        ),
        quizMCQ("YOUR BODY CHECK", "What helps when social media hurts confidence?",
          ["Mute/unfollow + take breaks", "Post more to prove yourself", "Compare harder", "Punish your body"], 0),

        story("YOUR BODY", "Stress Talks Through the Body",
          "Tapiwa (18)", "School pressure",
          "Sleep got worse, energy dropped, mood changed. Tapiwa thought it was laziness, but it was stress showing up.",
          "Stress is real. Rest, routines, movement, and support matter. Talk to someone you trust.",
          "concerned"
        ),
        quizTF("YOUR BODY CHECK", "True or False: Stress can affect sleep, mood, and energy.", true),

        card("YOUR BODY", "SELF-CARE", "INFORMATION HERE",
          "Self-care isn’t luxury. It’s basics: rest, food, hydration, support, and boundaries — especially online.",
          "Small habits daily can protect your mental health.",
          "happy"
        ),
      ],

      trueStories: [
        story("TRUE STORY", "The Screenshot Lesson",
          "Ruth (17)", "Private messages",
          "Ruth shared something in confidence. Later, it got forwarded. Trust felt broken and embarrassing.",
          "If someone pressures you to share private things, that’s a red flag. Protect your privacy and get support.",
          "concerned"
        ),
        quizTF("TRUE STORY CHECK", "True or False: You are allowed to say no to sharing private photos.", true),

        story("TRUE STORY", "The Party Pressure Moment",
          "Kago (17)", "Friends pushing limits",
          "Kago felt pushed to do something risky to ‘fit in’. The vibe was loud, but the gut feeling was louder.",
          "Real friends respect your no. Pressure is not friendship.",
          "concerned"
        ),
        quizMCQ("TRUE STORY CHECK", "Which response is healthiest to pressure?",
          ["Go along to avoid conflict", "Say no and set a boundary", "Share private info to prove trust", "Stay silent and hope it ends"], 1),

        story("TRUE STORY", "Online… But Not Okay",
          "Asha (19)", "DMs that turned heavy",
          "At first, messages were fun. Then replies became demands. Silence became accusations. Sleep and mood suffered.",
          "If attention turns into pressure, it’s not healthy. Mute, block, and talk to someone safe.",
          "concerned"
        ),
        quizTF("TRUE STORY CHECK", "True or False: If something feels off online, you should trust that feeling.", true),

        card("TRUE STORY", "YOUR PEACE", "INFORMATION HERE",
          "You can protect your peace without explaining yourself to everyone. Safety tools exist for a reason.",
          "If you need help, reach out to a trusted adult or support service.",
          "happy"
        ),
      ],
    }
  },

  // fallback (kept minimal)
  Botswana: {
    carousel: [
      { title:"DON’T Drink And…", sub:"Things never to do under the influence" },
      { title:"Do you know your limits?", sub:"‘Party too hard’ checklist" },
      { title:"Respect is the vibe", sub:"Healthy relationships 101" },
    ],
    topics: {
      relationships: [card("RELATIONSHIPS","RESPECT","INFORMATION HERE","Healthy love feels safe and respectful.","Trust grows with respect.","happy")],
      sex: [card("SEX TALK 101","CONSENT","INFORMATION HERE","Consent must be clear and willing.","You can change your mind.","concerned")],
      yourBody: [card("YOUR BODY","GROWTH","INFORMATION HERE","Bodies grow at different speeds.","Comparison can hurt confidence.","happy")],
      trueStories: [story("TRUE STORY","The ‘Good Friend’ Test","Kago (17)","Friend pressure","Real friends respect boundaries.","Say no and stay safe.","concerned")],
    }
  }
};

function getCountryData(country){
  return CONTENT[country] ?? CONTENT.Zambia;
}

/* --------------------------
   App state (no profiles)
   -------------------------- */
let state = {
  country: "Zambia",
  lang: "en",
  topicKey: null,
  index: 0,
  unlocks: {},     // only for the quiz gate inside this device
  soundOn: true,
  carouselIndex: 0
};

function loadState(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return;
    const saved = JSON.parse(raw);
    if(saved && typeof saved === "object"){
      state = { ...state, ...saved };
    }
  }catch(e){}
}
function saveState(){
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

/* --------------------------
   Views
   -------------------------- */
function showView(view){
  els.homeView.classList.remove("isVisible");
  els.courseView.classList.remove("isVisible");
  view.classList.add("isVisible");
  window.scrollTo({top:0, behavior:"smooth"});
}
function setActiveTopNav(route){
  document.querySelectorAll(".navBtn").forEach(btn=>{
    btn.classList.toggle("isActive", btn.dataset.route === route);
  });
}
function openModal(){
  els.modal.classList.add("isOpen");
  els.modal.setAttribute("aria-hidden", "false");
}
function closeModal(){
  els.modal.classList.remove("isOpen");
  els.modal.setAttribute("aria-hidden", "true");
}

/* --------------------------
   Avatar moods
   -------------------------- */
function avatarSVG(mood="happy"){
  const mouth = mood === "happy"
    ? `<path d="M95 78 C105 88 115 88 125 78" stroke="#dfe5ff" stroke-width="4" fill="none" stroke-linecap="round"/>`
    : mood === "concerned"
      ? `<path d="M95 84 C105 76 115 76 125 84" stroke="#dfe5ff" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : `<path d="M103 86 C108 92 112 92 117 86" stroke="#dfe5ff" stroke-width="4" fill="none" stroke-linecap="round"/>`;

  const brows = mood === "confused"
    ? `<path d="M80 50 C92 44 100 46 110 50" stroke="#0f1020" stroke-width="4" fill="none" stroke-linecap="round"/>
       <path d="M140 50 C128 44 120 46 110 50" stroke="#0f1020" stroke-width="4" fill="none" stroke-linecap="round"/>`
    : mood === "concerned"
      ? `<path d="M80 50 C92 54 100 54 110 50" stroke="#0f1020" stroke-width="4" fill="none" stroke-linecap="round"/>
         <path d="M140 50 C128 54 120 54 110 50" stroke="#0f1020" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : `<path d="M80 50 C92 48 100 48 110 50" stroke="#0f1020" stroke-width="4" fill="none" stroke-linecap="round"/>
         <path d="M140 50 C128 48 120 48 110 50" stroke="#0f1020" stroke-width="4" fill="none" stroke-linecap="round"/>`;

  return `
  <svg viewBox="0 0 220 260" width="240" height="240" role="img" aria-label="Character illustration">
    <defs>
      <linearGradient id="shirt" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#6a5cff"/>
        <stop offset="1" stop-color="#4a3cff"/>
      </linearGradient>
      <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#33343b"/>
        <stop offset="1" stop-color="#1f2026"/>
      </linearGradient>
    </defs>

    <circle cx="110" cy="60" r="40" fill="url(#skin)"/>
    <path d="M70,55 C75,20 145,20 150,55 C145,35 75,35 70,55Z" fill="#14151a"/>
    ${brows}
    <rect x="78" y="55" width="36" height="22" rx="8" fill="none" stroke="#0f1020" stroke-width="3"/>
    <rect x="116" y="55" width="36" height="22" rx="8" fill="none" stroke="#0f1020" stroke-width="3"/>
    <line x1="114" y1="66" x2="116" y2="66" stroke="#0f1020" stroke-width="3"/>
    <circle cx="96" cy="66" r="3.5" fill="#dfe5ff"/>
    <circle cx="134" cy="66" r="3.5" fill="#dfe5ff"/>
    ${mouth}

    <path d="M65,120 C80,95 140,95 155,120 L170,175 C152,195 68,195 50,175 Z" fill="url(#shirt)"/>
    <rect x="70" y="145" width="80" height="45" rx="8" fill="#0f1020"/>
    <polygon points="108,162 116,176 100,176" fill="#dfe5ff" opacity="0.85"/>
    <path d="M75,190 L95,250 L115,250 L105,190 Z" fill="#1b1c22"/>
    <path d="M125,190 L135,250 L155,250 L145,190 Z" fill="#1b1c22"/>
    <rect x="88" y="244" width="34" height="12" rx="6" fill="#0f1020"/>
    <rect x="132" y="244" width="34" height="12" rx="6" fill="#0f1020"/>
  </svg>`;
}

function setAvatar(mood, bubbleText){
  els.avatarWrap.innerHTML = avatarSVG(mood);
  if(bubbleText) els.avatarBubble.textContent = bubbleText;
}

/* --------------------------
   Carousel
   -------------------------- */
let carouselTimer = null;

function slidesPerView(){
  const w = window.innerWidth;
  if(w <= 800) return 1;
  if(w <= 1100) return 2;
  return 3;
}
function pageCount(){
  const slides = getCountryData(state.country).carousel.length;
  const per = slidesPerView();
  return Math.max(1, Math.ceil(slides / per));
}
function applyCarouselTransform(){
  els.carouselTrack.style.transform = `translateX(-${state.carouselIndex * 100}%)`;
}
function renderCarouselDots(){
  const pages = pageCount();
  els.carouselDots.innerHTML = "";
  for(let i=0;i<pages;i++){
    const b = document.createElement("button");
    b.className = "cdot" + (i === state.carouselIndex ? " isActive" : "");
    b.type = "button";
    b.addEventListener("click", ()=>{
      state.carouselIndex = i;
      saveState();
      applyCarouselTransform();
      renderCarouselDots();
      restartCarouselAutoplay();
    });
    els.carouselDots.appendChild(b);
  }
}
function renderCarousel(){
  const slides = getCountryData(state.country).carousel;
  els.carouselTrack.innerHTML = slides.map(s => `
    <div class="slide">
      <h3 class="slideTitle">${escapeHtml(s.title)}</h3>
      <p class="slideSub">${escapeHtml(s.sub)}</p>
    </div>
  `).join("");

  state.carouselIndex = 0;
  saveState();
  applyCarouselTransform();
  renderCarouselDots();
}
function restartCarouselAutoplay(){
  if(carouselTimer) clearInterval(carouselTimer);
  carouselTimer = setInterval(()=>{
    const pages = pageCount();
    state.carouselIndex = (state.carouselIndex + 1) % pages;
    saveState();
    applyCarouselTransform();
    renderCarouselDots();
  }, 4500);
}

/* --------------------------
   Course helpers
   -------------------------- */
function topicCards(topicKey){
  return getCountryData(state.country).topics[topicKey] ?? [];
}
function dotCount(topicKey){
  return topicCards(topicKey).length;
}
function unlockKey(topicKey, index){
  return `${state.country}:${state.lang}:${topicKey}:${index}`;
}
function isUnlocked(topicKey, index){
  return !!state.unlocks[unlockKey(topicKey, index)];
}
function currentItem(){
  return topicCards(state.topicKey)[state.index];
}
function canGoNext(){
  const item = currentItem();
  if(!item) return false;
  if(item.type !== "quiz") return true;
  return isUnlocked(state.topicKey, state.index);
}
function renderDots(){
  const total = dotCount(state.topicKey);
  els.progressDots.innerHTML = "";
  for(let i=0;i<total;i++){
    const d = document.createElement("div");
    d.className = "dot";
    if(i === state.index) d.classList.add("isActive");
    if(i < state.index) d.classList.add("isDone");
    els.progressDots.appendChild(d);
  }
}
function renderProgressBar(){
  const total = dotCount(state.topicKey) || 1;
  els.tinyFill.style.width = `${Math.round(((state.index+1)/total)*100)}%`;
}
function renderNavButtons(){
  els.prevBtn.disabled = state.index === 0;
  els.nextBtn.disabled = !canGoNext();
  els.nextBtn.textContent = (state.index === dotCount(state.topicKey)-1) ? "Finish" : "Next";
  els.hintText.textContent = (currentItem()?.type === "quiz" && !canGoNext()) ? t("tipUnlock") : t("tipNav");
}

/* --------------------------
   Sound (ding)
   -------------------------- */
let audioCtx = null;
function ensureAudio(){
  if(!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}
function playDing(){
  if(!state.soundOn) return;
  ensureAudio();
  const t0 = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(880, t0);
  o.frequency.exponentialRampToValueAtTime(1320, t0 + 0.08);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(t0); o.stop(t0 + 0.2);
}

/* --------------------------
   Render flashcard (UN style)
   -------------------------- */
function shapesHtml(){
  // quick random-ish positions (static but looks playful)
  return `
    <div class="cardShapes" aria-hidden="true">
      <div class="shapeDot" style="top:18px; left:22px;"></div>
      <div class="shapeDot" style="top:38px; left:58px; opacity:.6;"></div>
      <div class="shapeRing" style="top:22px; right:24px;"></div>
      <div class="shapeRing" style="bottom:24px; left:26px; width:34px; height:34px;"></div>
      <div class="shapeSpark" style="top:86px; right:62px;"></div>
      <div class="shapeSpark" style="bottom:70px; right:28px; opacity:.6;"></div>
    </div>
  `;
}

function renderCard(){
  const item = currentItem();
  if(!item) return;

  const bubble = item.type === "quiz" ? t("quickCheck")
               : item.type === "story" ? t("storyTime")
               : t("keepGoing");
  setAvatar(item.mood || "happy", bubble);

  renderDots();
  renderProgressBar();

  if(item.type === "card"){
    els.flashCard.innerHTML = `
      ${shapesHtml()}
      <div class="cardInner">
        <div class="cardLabel">• ${escapeHtml(item.label)}</div>
        <div class="bigWord">${escapeHtml(item.bigWord)}</div>
        <div class="pillHeadline">${escapeHtml(item.pillHeadline)}</div>
        <p class="cardBody" style="margin-top:12px;">${escapeHtml(item.body)}</p>
        ${item.tip ? `<div class="cardTip"><strong>Tip:</strong> ${escapeHtml(item.tip)}</div>` : ""}
      </div>
    `;
  }
  else if(item.type === "story"){
    els.flashCard.innerHTML = `
      ${shapesHtml()}
      <div class="cardInner">
        <div class="cardLabel">• ${escapeHtml(item.label)}</div>
        <h3 class="cardTitle">${escapeHtml(item.title)}</h3>

        <div class="storyRow">
          <div class="storyAvatar" aria-hidden="true">${avatarSVG(item.mood || "concerned")}</div>
          <div class="storyMeta">
            <p class="storyName">${escapeHtml(item.character)}</p>
            <p class="storyScene">${escapeHtml(item.scene)}</p>
            <p class="cardBody">${escapeHtml(item.body)}</p>
            <div class="storyPrompt">${escapeHtml(t("counsellorSays"))} ${escapeHtml(item.counsellorTip)}</div>
          </div>
        </div>
      </div>
    `;
  }
  else {
    const unlocked = isUnlocked(state.topicKey, state.index);
    els.flashCard.innerHTML = `
      ${shapesHtml()}
      <div class="cardInner">
        <div class="cardLabel">• ${escapeHtml(item.label)}</div>
        <h3 class="cardTitle">${escapeHtml(item.question)}</h3>

        <div class="quiz">
          <p class="quizQ">${escapeHtml(t("pickOne"))}</p>
          <div class="optGrid" id="optGrid"></div>
          <div class="quizMsg ${unlocked ? "good" : ""}" id="quizMsg">
            ${unlocked ? escapeHtml(t("correct")) : ""}
          </div>
        </div>
      </div>
    `;

    const grid = document.getElementById("optGrid");
    const msg = document.getElementById("quizMsg");

    item.options.forEach((opt, idx)=>{
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "optBtn";
      btn.textContent = opt;

      btn.addEventListener("click", ()=>{
        const correct = idx === item.correctIndex;

        grid.querySelectorAll(".optBtn").forEach(b=>{
          b.classList.remove("isCorrect","isWrong");
          b.disabled = false;
        });

        if(correct){
          btn.classList.add("isCorrect");
          msg.textContent = t("correct");
          msg.className = "quizMsg good";
          state.unlocks[unlockKey(state.topicKey, state.index)] = true;
          saveState();
          playDing();
        } else {
          btn.classList.add("isWrong");
          msg.textContent = t("tryAgain");
          msg.className = "quizMsg bad";
        }
        renderNavButtons();
      });

      grid.appendChild(btn);
    });
  }

  renderNavButtons();
}

/* --------------------------
   Navigation
   -------------------------- */
function startTopic(topicKey){
  state.topicKey = topicKey;
  state.index = 0;

  const meta = TOPIC_META[topicKey];
  els.courseTitle.textContent = meta?.title ?? "Topic";
  els.courseKicker.textContent = meta?.kicker ?? "MY KNOWLEDGE";
  els.courseMeta.textContent = t("courseMeta", state.country, dotCount(topicKey), state.lang);

  saveState();
  showView(els.courseView);
  renderCard();
}

function next(){
  const items = topicCards(state.topicKey);
  if(state.index >= items.length-1){
    showView(els.homeView);
    setAvatar("happy", t("finished"));
    return;
  }
  if(!canGoNext()) return;
  state.index += 1;
  saveState();
  renderCard();
}

function prev(){
  if(state.index <= 0) return;
  state.index -= 1;
  saveState();
  renderCard();
}

/* --------------------------
   Settings (Country + Language)
   -------------------------- */
function setCountry(country){
  state.country = country;
  renderCarousel();
  setAvatar("happy", t("countrySet", country));

  if(state.topicKey){
    state.index = 0;
    els.courseMeta.textContent = t("courseMeta", state.country, dotCount(state.topicKey), state.lang);
    saveState();
    renderCard();
  } else {
    saveState();
  }
}

function setLang(lang){
  state.lang = lang;
  // refresh current screen text
  if(state.topicKey){
    els.courseMeta.textContent = t("courseMeta", state.country, dotCount(state.topicKey), state.lang);
    renderCard();
  } else {
    setAvatar("happy", "Hi 👋 Pick a topic!");
  }
  saveState();
}

/* --------------------------
   Export progress (optional)
   -------------------------- */
function exportProgress(){
  const payload = {
    country: state.country,
    lang: state.lang,
    topicKey: state.topicKey,
    index: state.index,
    unlocks: state.unlocks,
    soundOn: state.soundOn,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "tuneme-progress.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

/* --------------------------
   Events
   -------------------------- */
function wireEvents(){
  document.querySelectorAll(".topicTile").forEach(tile=>{
    tile.addEventListener("click", ()=> startTopic(tile.dataset.topic));
  });

  els.startBtn.addEventListener("click", ()=> startTopic("relationships"));
  els.backHomeBtn.addEventListener("click", ()=>{
    showView(els.homeView);
    setActiveTopNav("home");
    setAvatar("happy", "Pick a topic 👇");
  });

  els.nextBtn.addEventListener("click", next);
  els.prevBtn.addEventListener("click", prev);

  els.howBtn.addEventListener("click", openModal);
  els.closeModalBtn.addEventListener("click", closeModal);
  els.modal.addEventListener("click", (e)=>{ if(e.target === els.modal) closeModal(); });

  document.querySelectorAll(".navBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      setActiveTopNav(btn.dataset.route);
      showView(els.homeView);
    });
  });

  window.addEventListener("scroll", ()=>{
    els.backToTopBtn.classList.toggle("isVisible", window.scrollY > 500);
  });
  els.backToTopBtn.addEventListener("click", ()=> window.scrollTo({top:0, behavior:"smooth"}));

  els.downloadBtn.addEventListener("click", exportProgress);

  els.countrySelect.addEventListener("change", (e)=> setCountry(e.target.value));
  els.langSelect.addEventListener("change", (e)=> setLang(e.target.value));

  els.soundBtn.addEventListener("click", ()=>{
    state.soundOn = !state.soundOn;
    els.soundBtn.setAttribute("aria-pressed", String(state.soundOn));
    els.soundBtn.textContent = state.soundOn ? t("soundOn") : t("soundOff");
    saveState();
    if(state.soundOn) ensureAudio();
  });

  window.addEventListener("keydown", (e)=>{
    if(!els.courseView.classList.contains("isVisible")) return;
    if(e.key === "ArrowRight") next();
    if(e.key === "ArrowLeft") prev();
  });

  window.addEventListener("resize", ()=>{
    renderCarouselDots();
    applyCarouselTransform();
  });
}

/* --------------------------
   Utils
   -------------------------- */
function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* --------------------------
   Init
   -------------------------- */
(function init(){
  loadState();

  els.countrySelect.value = state.country;
  els.langSelect.value = state.lang;

  els.soundBtn.setAttribute("aria-pressed", String(state.soundOn));
  els.soundBtn.textContent = state.soundOn ? t("soundOn") : t("soundOff");

  renderCarousel();
  restartCarouselAutoplay();

  setAvatar("happy", "Hi 👋 Pick a topic!");
  wireEvents();

  if(state.topicKey && TOPIC_META[state.topicKey]){
    startTopic(state.topicKey);
  } else {
    showView(els.homeView);
  }
})();
