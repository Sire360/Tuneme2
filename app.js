/* TuneMe-style interactive micro-course
   - 4 topics
   - Flashcards with progress dots
   - Quizzes (TF + MCQ) that must be answered to proceed
   - LocalStorage progress
*/

const els = {
  homeView: document.getElementById("homeView"),
  courseView: document.getElementById("courseView"),
  flashCard: document.getElementById("flashCard"),
  progressDots: document.getElementById("progressDots"),
  tinyFill: document.getElementById("tinyFill"),
  hintText: document.getElementById("hintText"),
  courseTitle: document.getElementById("courseTitle"),
  courseKicker: document.getElementById("courseKicker"),
  backHomeBtn: document.getElementById("backHomeBtn"),
  nextBtn: document.getElementById("nextBtn"),
  prevBtn: document.getElementById("prevBtn"),
  startBtn: document.getElementById("startBtn"),
  howBtn: document.getElementById("howBtn"),
  modal: document.getElementById("modal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  backToTopBtn: document.getElementById("backToTopBtn"),
  downloadBtn: document.getElementById("downloadBtn"),
};

const TOPIC_META = {
  trueStories: { title: "True Stories", kicker: "MY KNOWLEDGE" },
  yourBody: { title: "Your Body", kicker: "MY KNOWLEDGE" },
  sex: { title: "Sex", kicker: "MY KNOWLEDGE" },
  relationships: { title: "Relationships", kicker: "MY KNOWLEDGE" },
};

// Safe, youth-appropriate sample content (non-explicit)
const TOPICS = {
  trueStories: [
    card("TRUE STORY", "A choice moment", 
      "Someone felt pressured to “keep up” with friends. Later, they realized the best decision is the one that protects your peace and future.",
      "Real talk: Pressure isn’t proof of love or maturity. Respect is."),
    quizTF("TRUE STORY CHECK", "True or False: Real friends respect your boundaries.", true),
    card("TRUE STORY", "What you can learn",
      "Stories help us recognize patterns: pressure, manipulation, and disrespect can look “normal” until you name them.",
      "Tip: If it feels wrong, pause. Talk to someone you trust."),
    quizMCQ("TRUE STORY CHECK", "Which option is the healthiest response to pressure?",
      ["Go along to avoid conflict", "Say no and set a boundary", "Share private info to prove trust", "Stay silent and hope it ends"],
      1)
  ],

  yourBody: [
    card("YOUR BODY", "Puberty timelines are different",
      "Bodies grow at different speeds. Some changes come early, some later — and that’s normal.",
      "Tip: Comparing your body to others can mess with confidence."),
    quizTF("YOUR BODY CHECK", "True or False: Everyone goes through puberty at exactly the same time.", false),
    card("YOUR BODY", "Stress shows up in the body",
      "When stress is high, sleep, appetite, mood, and energy can change. It’s not “dramatic”—it’s human.",
      "Tip: Rest + support + healthy routines help."),
    quizMCQ("YOUR BODY CHECK", "Which is a healthy way to handle stress?",
      ["Never talk about it", "Get support from someone you trust", "Stay online all night to forget", "Skip sleep to work more"],
      1)
  ],

  sex: [
    card("SEX TALK 101", "Consent = clear and willing",
      "Consent means someone freely agrees — without pressure. Silence or fear is not consent.",
      "Tip: You can change your mind at any time."),
    quizTF("SEX CHECK", "True or False: If someone feels pressured, that still counts as consent.", false),
    card("SEX TALK 101", "Protection is responsibility",
      "Protecting your health includes accurate info, safer choices, and knowing where to get support.",
      "Tip: Getting facts from trusted sources beats rumors."),
    quizMCQ("SEX CHECK", "Which is the best source for health info?",
      ["Rumors from friends", "Random anonymous posts", "A trusted health service/provider", "Guessing"],
      2)
  ],

  relationships: [
    card("RELATIONSHIPS", "Healthy love feels safe",
      "In healthy relationships, you feel respected, heard, and free to be yourself — online and offline.",
      "Tip: Control and fear aren’t love."),
    quizTF("RELATIONSHIPS CHECK", "True or False: Jealousy and control are signs of love.", false),
    card("RELATIONSHIPS", "Boundaries are normal",
      "Boundaries are how you protect your time, body, privacy, and feelings. Respectful people don’t punish you for having them.",
      "Tip: If someone crosses your boundary, you can step back."),
    quizMCQ("RELATIONSHIPS CHECK", "Someone demands your passwords. What’s the best move?",
      ["Share them to prove trust", "Say no and protect your privacy", "Post about it publicly", "Ignore it forever"],
      1)
  ],
};

function card(label, title, body, tip){
  return { type:"card", label, title, body, tip };
}

function quizTF(label, question, answerTrue){
  return {
    type:"quiz",
    label,
    question,
    options: ["True", "False"],
    correctIndex: answerTrue ? 0 : 1
  };
}

function quizMCQ(label, question, options, correctIndex){
  return { type:"quiz", label, question, options, correctIndex };
}

let state = {
  topicKey: null,
  index: 0,
  // track answered quizzes per topic+index
  unlocks: {},
};

const LS_KEY = "tuneme_course_state_v1";

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

function topicCards(topicKey){
  return TOPICS[topicKey] ?? [];
}

function dotCount(topicKey){
  return topicCards(topicKey).length;
}

function unlockKey(topicKey, index){
  return `${topicKey}:${index}`;
}

function isUnlocked(topicKey, index){
  // Cards always accessible; quizzes must be answered to proceed *past* them.
  // We’ll treat “unlocked” as quiz answered correctly.
  return !!state.unlocks[unlockKey(topicKey, index)];
}

function currentItem(){
  const items = topicCards(state.topicKey);
  return items[state.index];
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
  const items = topicCards(state.topicKey);
  const total = items.length || 1;
  const pct = Math.round(((state.index+1)/total)*100);
  els.tinyFill.style.width = `${pct}%`;
}

function canGoNext(){
  const item = currentItem();
  if(!item) return false;
  if(item.type !== "quiz") return true;
  return isUnlocked(state.topicKey, state.index);
}

function renderNavButtons(){
  els.prevBtn.disabled = state.index === 0;
  els.nextBtn.disabled = !canGoNext();
  els.nextBtn.textContent = state.index === dotCount(state.topicKey)-1 ? "Finish" : "Next";
  els.hintText.textContent = (currentItem()?.type === "quiz" && !canGoNext())
    ? "Tip: Choose an answer to unlock Next."
    : "Tip: Use Next/Back to move through the cards.";
}

function renderCard(){
  const item = currentItem();
  if(!item) return;

  renderDots();
  renderProgressBar();

  if(item.type === "card"){
    els.flashCard.innerHTML = `
      <div class="cardInner">
        <div class="cardLabel">• ${escapeHtml(item.label)}</div>
        <h3 class="cardTitle">${escapeHtml(item.title)}</h3>
        <p class="cardBody">${escapeHtml(item.body)}</p>
        ${item.tip ? `<div class="cardTip"><strong>Tip:</strong> ${escapeHtml(item.tip.replace(/^Tip:\s*/,""))}</div>` : ""}
      </div>
    `;
  } else {
    // quiz
    const unlocked = isUnlocked(state.topicKey, state.index);
    els.flashCard.innerHTML = `
      <div class="cardInner">
        <div class="cardLabel">• ${escapeHtml(item.label)}</div>
        <h3 class="cardTitle">${escapeHtml(item.question)}</h3>

        <div class="quiz">
          <p class="quizQ">Pick one:</p>
          <div class="optGrid" id="optGrid"></div>
          <div class="quizMsg ${unlocked ? "good" : ""}" id="quizMsg">
            ${unlocked ? "Nice! You can go Next." : ""}
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
        // lock in answer feedback
        const correct = idx === item.correctIndex;

        // reset styles
        grid.querySelectorAll(".optBtn").forEach(b=>{
          b.classList.remove("isCorrect","isWrong");
          b.disabled = false;
        });

        if(correct){
          btn.classList.add("isCorrect");
          msg.textContent = "Correct ✅ — you can go Next.";
          msg.className = "quizMsg good";
          state.unlocks[unlockKey(state.topicKey, state.index)] = true;
          saveState();
        } else {
          btn.classList.add("isWrong");
          msg.textContent = "Not quite. Try again 💡";
          msg.className = "quizMsg bad";
        }
        renderNavButtons();
      });
      grid.appendChild(btn);
    });
  }

  renderNavButtons();
}

function startTopic(topicKey){
  state.topicKey = topicKey;
  state.index = 0;

  const meta = TOPIC_META[topicKey];
  els.courseTitle.textContent = meta?.title ?? "Topic";
  els.courseKicker.textContent = meta?.kicker ?? "MY KNOWLEDGE";

  saveState();
  showView(els.courseView);
  renderCard();
}

function next(){
  const items = topicCards(state.topicKey);
  if(state.index >= items.length-1){
    // finish
    showView(els.homeView);
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

function wireEvents(){
  // topic tiles
  document.querySelectorAll(".topicTile").forEach(tile=>{
    tile.addEventListener("click", ()=> startTopic(tile.dataset.topic));
  });

  els.startBtn.addEventListener("click", ()=> startTopic("sex"));
  els.backHomeBtn.addEventListener("click", ()=>{
    showView(els.homeView);
    setActiveTopNav("home");
  });

  els.nextBtn.addEventListener("click", next);
  els.prevBtn.addEventListener("click", prev);

  // modal
  els.howBtn.addEventListener("click", openModal);
  els.closeModalBtn.addEventListener("click", closeModal);
  els.modal.addEventListener("click", (e)=>{
    if(e.target === els.modal) closeModal();
  });

  // top nav cosmetic
  document.querySelectorAll(".navBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      setActiveTopNav(btn.dataset.route);
      // simple: route to home for now
      showView(els.homeView);
    });
  });

  // back to top
  window.addEventListener("scroll", ()=>{
    const show = window.scrollY > 500;
    els.backToTopBtn.classList.toggle("isVisible", show);
  });
  els.backToTopBtn.addEventListener("click", ()=>{
    window.scrollTo({top:0, behavior:"smooth"});
  });

  // download button = export progress JSON
  els.downloadBtn.addEventListener("click", ()=>{
    const payload = {
      topicKey: state.topicKey,
      index: state.index,
      unlocks: state.unlocks,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tuneme-progress.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // keyboard nav
  window.addEventListener("keydown", (e)=>{
    if(!els.courseView.classList.contains("isVisible")) return;
    if(e.key === "ArrowRight") next();
    if(e.key === "ArrowLeft") prev();
  });
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

(function init(){
  loadState();
  wireEvents();

  // If user had an active topic, you can choose to resume.
  // We'll resume only if topicKey exists.
  if(state.topicKey && TOPICS[state.topicKey]){
    startTopic(state.topicKey);
  } else {
    showView(els.homeView);
  }
})();
