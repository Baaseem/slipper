// script.js
// Malayalam MCQs and site logic

const questions = [
  {
    q: "1) ഇന്ന് നീ എന്ത് പ്രശ്നം ഉണ്ടാക്കി??",
    opts: ["ചെറുത്", "മാസ്സ് പണി", "വലിയൊരു പ്രശ്നം", "അമ്പരപ്പിക്കുന്ന ഒരു പ്രശ്നം"],
  },
  { q: "2) അമ്മയുടെ അടുത്ത് നീ പറഞ്ഞോ?", opts: ["പറഞ്ഞില്ല", "കുറച്ച് പറഞ്ഞു", "സത്യം പറഞ്ഞു", "പറയാൻ മടിയുണ്ട്"] },
  { q: "3) അമ്മയുടെ മൂഡ് ഏത് നിലയിലാണ്?", opts: ["സന്തോഷം", "നൊമ്പരം", "സുഖമില്ല", "കോപം"] },
  { q: "4) ചപ്പൽ എവിടെയാണ്?", opts: ["കാലിൽ", "വശത്തുണ്ട്", "കാണുന്നില്ല", "മറന്നു പോയി"] },
  { q: "5) നീ ഇന്ന് ക്ഷമയോടെയുണ്ടോ?", opts: ["അതെ", "ചിലഭാഗം", "അല്പം മാത്രം", "ഒന്നും ഇല്ല"] },
  { q: "6) സ്കൂൾ/ജോബ് ബന്ധമുണ്ടോ?", opts: ["yes", "no", "maybe", "അനാവശ്യമാണ്"] },
  { q: "7) മാപ്പ് ചോദിച്ചോ?", opts: ["ഒന്നു പറഞ്ഞു", "പറയാൻ മടിയാണ്", "ഇല്ല", "ശ്രമം ചെയ്തില്ല"] },
  { q: "8) ഈ സംഭവം പുനരാവർത്തിക്കുമോ?", opts: ["സാദ്ധ്യത കൂടുതലാണ്", "ശകലഭാഗം", "കുറച്ച് മാത്രം", "ഒരിക്കലും ഇല്ല"] },
  { q: "9) നേരം എടുത്തോ?", opts: ["അതെ", "നിരന്തരമായി", "ഇപ്പോഴോ", "അല്ല"] },
  { q: "10) ചുണ്ടിൽ ഒരു ചിരി ഉണ്ടോ ആ സംഭവത്തിൽ?", opts: ["വളരെ ചിരി", "ചെറു ചിരി", "ഇല്ല", "കണ്ട് പിടിക്കാം"] },
];

// slide logic
let current = 1;
const slides = Array.from(document.querySelectorAll(".slide"));

function showSlide(n) {
  slides.forEach(s => s.hidden = true);
  const sel = slides.find(s => +s.dataset.slide === n);
  if (sel) sel.hidden = false;
  current = n;
}
showSlide(1);

// populate quiz
const quizEl = document.getElementById("quiz");
questions.forEach((item, i) => {
  const div = document.createElement("div");
  div.className = "q";
  const qh = document.createElement("p");
  qh.textContent = item.q;
  div.appendChild(qh);
  item.opts.forEach((opt, j) => {
    const id = `q${i}_o${j}`;
    const label = document.createElement("label");
    label.style.display = "block";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = `q${i}`;
    radio.value = j; // we'll map to score
    radio.id = id;
    if (j===0) {
      // no default — leave none selected
    }
    label.appendChild(radio);
    const span = document.createElement("span");
    span.textContent = "  " + opt;
    label.appendChild(span);
    div.appendChild(label);
  });
  quizEl.appendChild(div);
});

// buttons
document.getElementById("toQ").onclick = () => showSlide(2);
document.getElementById("backTo1").onclick = (e)=>{ e.preventDefault(); showSlide(1); };
document.getElementById("backTo2").onclick = (e)=>{ e.preventDefault(); showSlide(2); };

document.getElementById("toCalc").onclick = (e) => {
  e.preventDefault();
  // compute a vishamam base from quiz answers
  let totalScore = 0;
  let answered = 0;
  questions.forEach((__, i) => {
    const sel = document.querySelector(`input[name=q${i}]:checked`);
    if (sel) {
      const val = parseInt(sel.value,10);
      // map option index (0..3) to small numeric stress
      const score = val + 0; // 0..3
      totalScore += score;
      answered++;
    }
  });
  // map to 1..10
  let vish = 5;
  if (answered > 0) {
    // average option * scale
    const avg = totalScore / answered; // 0..3
    vish = Math.round((avg / 3) * 9) + 1; // 1..10
  }
  // set slider
  const vishEl = document.getElementById("vishamam");
  vishEl.value = vish;
  document.getElementById("vVal").textContent = vish;
  showSlide(3);
};

const vish = document.getElementById("vishamam");
const vVal = document.getElementById("vVal");
vish.oninput = ()=> vVal.textContent = vish.value;

const aEl = document.getElementById("ammaAnger");
const aVal = document.getElementById("aVal");
aEl.oninput = ()=> aVal.textContent = aEl.value;

const lEl = document.getElementById("laziness");
const lVal = document.getElementById("lVal");
lEl.oninput = ()=> lVal.textContent = lEl.value;

document.getElementById("calcBtn").onclick = (e)=>{
  e.preventDefault();
  const v = parseFloat(document.getElementById("vishamam").value) || 1;
  const a = parseFloat(document.getElementById("ammaAnger").value) || 1;
  const ch = parseFloat(document.getElementById("chappalType").value) || 1;
  const lz = Math.max(0.1, parseFloat(document.getElementById("laziness").value) || 1);

  // formula and scaling
  let raw = (v * a * ch) / lz;
  // scale to a 'fun' distance number (in centimeters)
  const distanceCm = Math.round(raw * 120); // tweak multiplier for fun
  const distanceMeters = (distanceCm/100).toFixed(2);

  // mother mood based on distance
  let mood = "";
  let suggestion = "";
  if (distanceCm >= 1200) {
    mood = "🔥 അമ്മ വളരെ കോപത്തിലാണ്! (ഒരു ഷെൽട്ടർ കണ്ടെത്തൂ!)";
    suggestion = "സാധാരണയായി: സ്റ്റോപ്പ്, കിടക്കുക, ചപ്പൽ കവർ ചെയ്യുക.";
  } else if (distanceCm >= 600) {
    mood = "😠 അമ്മ കോപത്തിലാണ് — ജാഗ്രത വേണം!";
    suggestion = "തിയ്യതി ചോദിച്ച് മാപ്പ് ചോദിക്കുക.";
  } else if (distanceCm >= 200) {
    mood = "😐 അമ്മ അല്പം നിരുത്സാഹത്തിലാഴ്‌ചയുണ്ട്.";
    suggestion = "ഹൈ, ഒരു ചെറിയ ചാക്കോലേറ്റ് ആണോ?";
  } else {
    mood = "😅 അമ്മ സുഖത്തിലാണ് — സംശയം തീർന്നു!";
    suggestion = "ഒരു ചെറിയ ചുംബനം നൽകൂ (ഒപ്പം ചക്കരാപ്പേരണം!)";
  }

  const mischief = document.getElementById("mischiefText").value || "വിവരം ലഭ്യമല്ല";

  const resultBox = document.getElementById("resultBox");
  resultBox.innerHTML = `
    <p><strong>താങ്കളുടെ പാളി:</strong> ${escapeHtml(mischief)}</p>
    <p><strong>Distance (cm):</strong> ${distanceCm} cm ≈ ${distanceMeters} m</p>
    <p><strong>അവസ്ഥ:</strong> ${mood}</p>
    <p><em>${suggestion}</em></p>
    <hr />
    <p style="font-size:0.9em;opacity:0.9">നോട്ട്: ഇത് തമാശയ്ക്കാണ്. സാധാരണ ജീവിതത്തില്‍ ചപ്പൽ ഉപയോഗിച്ച് ആളുകളെ ടാർഗെറ്റ് ചെയ്യണ്ട.</p>
  `;

  showSlide(4);
};

// restart
document.getElementById("restart").onclick = ()=> {
  location.reload();
};

// small helper
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}
