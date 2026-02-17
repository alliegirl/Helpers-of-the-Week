// ---------- Storage helpers ----------
const STORAGE_KEY = "jobChartLists_v1";

function parseNames(text) {
  return text
    .split("\n")
    .map(n => n.trim())
    .filter(Boolean);
}

function saveLists(thirdNames, secondNames) {
  const payload = { third: thirdNames, second: secondNames };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadLists() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { third: [], second: [] };
  try {
    const parsed = JSON.parse(raw);
    return {
      third: Array.isArray(parsed.third) ? parsed.third : [],
      second: Array.isArray(parsed.second) ? parsed.second : []
    };
  } catch {
    return { third: [], second: [] };
  }
}

// ---------- Random helpers (NO "used students" / NO forgetting) ----------
function pickOne(arr) {
  if (!arr.length) return null;
  const i = Math.floor(Math.random() * arr.length);
  return arr[i];
}

function pickTwoDistinct(arr) {
  if (arr.length === 0) return [null, null];
  if (arr.length === 1) return [arr[0], arr[0]]; // if only one name, it will repeat
  const firstIndex = Math.floor(Math.random() * arr.length);
  let secondIndex = Math.floor(Math.random() * arr.length);
  while (secondIndex === firstIndex) {
    secondIndex = Math.floor(Math.random() * arr.length);
  }
  return [arr[firstIndex], arr[secondIndex]];
}

function setLines(elementId, lines) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = "";

  if (!lines || lines.length === 0 || lines.every(x => !x)) {
    el.textContent = "—";
    return;
  }

  lines.filter(Boolean).forEach(name => {
    const span = document.createElement("span");
    span.className = "line";
    span.textContent = name;
    el.appendChild(span);
  });
}

// ---------- Job assignment logic ----------
function assignJobs() {
  const third = parseNames(document.getElementById("thirdList").value);
  const second = parseNames(document.getElementById("secondList").value);

  if (third.length === 0 && second.length === 0) {
    alert("Please enter at least one student in either list.");
    return;
  }

  // combined pool for jobs that can be either grade
  const combined = [...third, ...second];

  // Paper Passers: 2 students (from combined list)
  const [pp1, pp2] = pickTwoDistinct(combined);

  // Messenger: 1 student (from combined list)
  const messenger = pickOne(combined);

  // Weekly Helper 1: 3rd grade only
  const weekly1 = pickOne(third);

  // Weekly Helper 2: 2nd grade only
  const weekly2 = pickOne(second);

  setLines("paperPassers", [pp1, pp2]);
  setLines("messenger", [messenger]);
  setLines("weeklyHelper1", [weekly1]);
  setLines("weeklyHelper2", [weekly2]);

  // Save lists so you don't lose them
  saveLists(third, second);
}

// ---------- Wire up UI ----------
function init() {
  const thirdListEl = document.getElementById("thirdList");
  const secondListEl = document.getElementById("secondList");

  // Load saved lists on open
  const saved = loadLists();
  thirdListEl.value = saved.third.join("\n");
  secondListEl.value = saved.second.join("\n");

  document.getElementById("saveBtn").addEventListener("click", () => {
    const third = parseNames(thirdListEl.value);
    const second = parseNames(secondListEl.value);
    saveLists(third, second);
    alert("Lists saved!");
  });

  document.getElementById("assignBtn").addEventListener("click", assignJobs);

  document.getElementById("clearBtn").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    thirdListEl.value = "";
    secondListEl.value = "";
    setLines("paperPassers", []);
    setLines("messenger", []);
    setLines("weeklyHelper1", []);
    setLines("weeklyHelper2", []);
    alert("Saved lists cleared.");
  });
}

init();
