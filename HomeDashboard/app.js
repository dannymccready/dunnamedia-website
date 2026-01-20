const els = {
  dashboard: document.getElementById("dashboard"),
  userName: document.getElementById("userName"),
  tabs: document.getElementById("tabs"),
  widgets: document.getElementById("widgets"),
  editToggle: document.getElementById("editToggle"),
  modal: document.getElementById("modal"),
  modalBackdrop: document.getElementById("modalBackdrop"),
  modalCloseBtn: document.getElementById("modalCloseBtn"),
  modalTitle: document.getElementById("modalTitle"),
  modalBody: document.getElementById("modalBody"),
  modalFooter: document.getElementById("modalFooter"),
  stickyLayer: null,
};

const USER = {
  name: document.body.dataset.username || "User",
};

const SYSTEM_APPS = [
  { id: "fleet", name: "Fleet Tracker" },
  { id: "finance", name: "Finance Hub" },
  { id: "people", name: "People Ops" },
  { id: "ops", name: "Operations" },
];

const DEMO_CHATS = {
  mates: [
    { id: "u1", name: "Liam Carter", last: "Got it, thanks." },
    { id: "u2", name: "Priya Singh", last: "On my way." },
    { id: "u3", name: "Jacob Price", last: "Shared the docs." },
    { id: "u4", name: "Nina Lopez", last: "Will update shortly." },
    { id: "u5", name: "Aaron Blake", last: "Looks good to me." },
  ],
  crews: [
    { id: "c1", name: "Tunnel Boys", last: "Shift starts at 6." },
    { id: "c2", name: "Chobham Crew", last: "Material drop at noon." },
    { id: "c3", name: "Eastline Ops", last: "Checklist complete." },
    { id: "c4", name: "Concrete Squad", last: "Pour scheduled Fri." },
    { id: "c5", name: "Night Shift", last: "Lights repaired." },
    { id: "c6", name: "Groundworks", last: "Excavator booked." },
  ],
};

const DEMO_CREW_MEMBERS = [
  { id: "m1", name: "Ava Morris", role: "Supervisor" },
  { id: "m2", name: "Noah Reed", role: "Operator" },
  { id: "m3", name: "Isla Grant", role: "Foreman" },
  { id: "m4", name: "Leo Hayes", role: "Engineer" },
  { id: "m5", name: "Mia Patel", role: "Safety" },
  { id: "m6", name: "Ethan Cole", role: "Driver" },
];

const LARGE_COLS = 4;
const STICKY_COLORS = [
  { id: "yellow", label: "Yellow", hex: "#fde68a" },
  { id: "pink", label: "Pink", hex: "#fbcfe8" },
  { id: "blue", label: "Blue", hex: "#bfdbfe" },
  { id: "green", label: "Green", hex: "#bbf7d0" },
  { id: "orange", label: "Orange", hex: "#fdba74" },
  { id: "purple", label: "Purple", hex: "#e9d5ff" },
];
const HEADLINES_FEED_SOURCES = [
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://feeds.skynews.com/feeds/rss/world.xml",
  "https://www.nasa.gov/rss/dyn/breaking_news.rss",
];
const HEADLINES_ROTATE_MS = 12000;
const HEADLINES_REFRESH_MS = 120000;

const WIDGET_CATALOG = {
  hide: { label: "Hide", seed: () => ({}) },
  stats: { label: "Metrics", seed: () => ({
    items: [
      { label: "Active projects", value: "24", delta: "+8%" },
      { label: "Open tasks", value: "312", delta: "+4%" },
      { label: "Revenue", value: "$42.9k", delta: "+12%" },
    ],
  }) },
  chart: { label: "Chart", seed: () => ({ hint: "Engagement" }) },
  list: { label: "List", seed: () => ({
    items: [
      { title: "New contract signed", meta: "2 hours ago" },
      { title: "Quarterly review added", meta: "Yesterday" },
      { title: "New dashboard draft", meta: "Mon" },
    ],
  }) },
  timeline: { label: "Timeline", seed: () => ({ items: ["Kickoff", "Build", "QA", "Launch"] }) },
  note: { label: "Note", seed: () => ({ text: "Add a longer note here for context.", mode: "text" }) },
  quicknote: { label: "Quick note", seed: () => ({ text: "Quick note..." }) },
  todo: { label: "Todo list", seed: () => ({
    items: [
      { id: rid("t"), text: "Review vehicle alerts", done: false },
      { id: rid("t"), text: "Approve new hires", done: true },
      { id: rid("t"), text: "Send weekly report", done: false },
    ],
  }) },
  calculator: { label: "Calculator", seed: () => ({ display: "0", expr: "" }) },
  projects: { label: "Projects", seed: () => ({ title: "Projects", pins: 8 }) },
  fleetmap: { label: "Fleet", seed: () => ({ title: "Fleet", pins: 6 }) },
  button: { label: "Action button", seed: () => ({
    label: "Open app",
    mode: "app",
    url: "https://example.com",
    appId: "fleet",
    imageUrl: "",
  }) },
  sticky: { label: "Sticky note", seed: () => ({ text: "", color: "yellow" }) },
  leave: { label: "Leave request", seed: () => ({ from: "", to: "", reason: "" }) },
  onsite: { label: "Number on site", seed: () => ({
    count: 76,
    projects: [
      { name: "Warehouse 14", count: 18 },
      { name: "Bridge retrofit", count: 22 },
      { name: "City rail", count: 16 },
      { name: "River tunnels", count: 20 },
    ],
  }) },
  snag: { label: "Snag lists", seed: () => ({
    count: 5,
    items: [
      { name: "Office Snag list" },
      { name: "Chobham snags" },
      { name: "Lee Rd snag list" },
      { name: "Monties Snags" },
      { name: "Bishops lane Snag list" },
    ],
  }) },
  fleet: { label: "Fleet notice", seed: () => ({
    items: [
      { label: "Speed alerts", value: 0 },
      { label: "Insurance", value: 1 },
      { label: "MOT", value: 3 },
    ],
  }) },
  onsiteTall: { label: "On site", seed: () => ({
    selected: "all",
    projects: [
      { id: "all", name: "All Projects" },
      { id: "p1", name: "Riverside Retrofit" },
      { id: "p2", name: "Station North" },
      { id: "p3", name: "Hillside Campus" },
      { id: "p4", name: "Docklands Hub" },
      { id: "p5", name: "Westline Depot" },
    ],
    workers: [
      { name: "Ava Morris", projectId: "p1", time: "06:42" },
      { name: "Noah Reed", projectId: "p1", time: "06:55" },
      { name: "Isla Grant", projectId: "p1", time: "07:05" },
      { name: "Leo Hayes", projectId: "p1", time: "07:12" },
      { name: "Mia Patel", projectId: "p1", time: "06:58" },
      { name: "Ethan Cole", projectId: "p1", time: "07:20" },
      { name: "Grace Miller", projectId: "p1", time: "06:49" },
      { name: "Oliver Shaw", projectId: "p1", time: "07:08" },
      { name: "Harper Wells", projectId: "p1", time: "07:01" },
      { name: "Jack Turner", projectId: "p1", time: "06:46" },
      { name: "Ella Brooks", projectId: "p1", time: "07:14" },
      { name: "Luca Evans", projectId: "p1", time: "06:52" },
      { name: "Ruby Clarke", projectId: "p2", time: "06:47" },
      { name: "Mason Lewis", projectId: "p2", time: "06:59" },
      { name: "Freya Price", projectId: "p2", time: "07:03" },
      { name: "Callum Frost", projectId: "p2", time: "06:51" },
      { name: "Zara Hill", projectId: "p2", time: "07:09" },
      { name: "Theo Adams", projectId: "p2", time: "06:44" },
      { name: "Poppy Allen", projectId: "p2", time: "07:11" },
      { name: "Arthur James", projectId: "p2", time: "06:56" },
      { name: "Lily Ward", projectId: "p2", time: "07:06" },
      { name: "Logan Cook", projectId: "p2", time: "06:53" },
      { name: "Sophie King", projectId: "p2", time: "06:48" },
      { name: "Ben Carter", projectId: "p2", time: "07:15" },
      { name: "Nina Lopez", projectId: "p2", time: "06:45" },
      { name: "Jacob Price", projectId: "p2", time: "07:18" },
      { name: "Elliot Fox", projectId: "p3", time: "06:50" },
      { name: "Aria Stone", projectId: "p3", time: "07:02" },
      { name: "Oscar Drake", projectId: "p3", time: "07:16" },
      { name: "Ivy Palmer", projectId: "p3", time: "06:54" },
      { name: "Hugo Woods", projectId: "p3", time: "07:04" },
      { name: "Evie Hall", projectId: "p3", time: "06:57" },
      { name: "Finn Page", projectId: "p3", time: "07:10" },
      { name: "Maisie Ross", projectId: "p3", time: "06:43" },
      { name: "Kai Lewis", projectId: "p3", time: "07:13" },
      { name: "Maya Rose", projectId: "p3", time: "06:52" },
      { name: "Rory Bell", projectId: "p3", time: "07:07" },
      { name: "Alice Hart", projectId: "p3", time: "06:49" },
      { name: "Toby Lane", projectId: "p3", time: "07:19" },
      { name: "Jade Cole", projectId: "p3", time: "06:41" },
      { name: "Sam Perez", projectId: "p4", time: "07:05" },
      { name: "Chloe Wood", projectId: "p4", time: "06:55" },
      { name: "Liam Carter", projectId: "p4", time: "07:12" },
      { name: "Priya Singh", projectId: "p4", time: "06:46" },
      { name: "Jacob Price", projectId: "p4", time: "07:08" },
      { name: "Nina Lopez", projectId: "p4", time: "06:50" },
      { name: "Aaron Blake", projectId: "p4", time: "07:01" },
      { name: "Zoe Knight", projectId: "p4", time: "06:58" },
      { name: "Elijah West", projectId: "p4", time: "07:14" },
      { name: "Mila Scott", projectId: "p4", time: "06:43" },
      { name: "Owen Cross", projectId: "p4", time: "07:16" },
      { name: "Ruby Lane", projectId: "p4", time: "06:52" },
      { name: "Harvey Lowe", projectId: "p4", time: "07:09" },
      { name: "Eleanor Park", projectId: "p4", time: "06:47" },
      { name: "Theo Mills", projectId: "p4", time: "07:17" },
      { name: "Isabelle Reed", projectId: "p5", time: "06:53" },
      { name: "George Hall", projectId: "p5", time: "07:02" },
      { name: "Daisy Stone", projectId: "p5", time: "06:45" },
      { name: "Adam Cox", projectId: "p5", time: "07:06" },
      { name: "Florence Gray", projectId: "p5", time: "06:51" },
      { name: "Samuel Reid", projectId: "p5", time: "07:11" },
      { name: "Mila Ross", projectId: "p5", time: "06:58" },
      { name: "Archie Webb", projectId: "p5", time: "07:15" },
      { name: "Esme Ward", projectId: "p5", time: "06:42" },
      { name: "Henry Brown", projectId: "p5", time: "07:04" },
      { name: "Olivia Nash", projectId: "p5", time: "06:49" },
      { name: "Isaac Cole", projectId: "p5", time: "07:18" },
    ],
  }) },
  target: { label: "Targets", seed: () => ({
    items: [
      { label: "Development target", value: 55 },
      { label: "Mobile app target", value: 80 },
      { label: "Marketing web target", value: 15 },
    ],
  }) },
  add: { label: "Add", seed: () => ({ text: "Add widget" }) },
  profile: { label: "Profile", seed: () => ({
    name: "Amelie Laurent",
    role: "UX Designer",
    location: "Paris, France",
    email: "amelie@company.com",
    phone: "+33 1 70 36 93 90",
    handle: "@amelie.design",
    company: "FundView",
    status: "Online",
    followers: "12.4k",
    following: "326",
    posts: "128",
    bio: "Designing calm, data-rich experiences for teams.",
    avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=240&auto=format&fit=crop",
    stats: [
      { label: "Paid Leave", value: "12/23", pct: 52 },
      { label: "Sick leave", value: "3/9", pct: 33 },
      { label: "Unpaid Leave", value: "4", pct: 18 },
    ],
  }) },
};

const TEMPLATES = [
  {
    id: "tpl-home",
    name: "Home",
    widgets: () => baseHomeWidgets(),
  },
  {
    id: "tpl-bmbt",
    name: "BMBT",
    widgets: () => {
      const widgets = [];
      // Row 1: buttons in all columns (10 half-columns), skip E/F
      for (let i = 0; i < 10; i++) {
        if (i === 4 || i === 5) continue;
        const w = widget("button", `Button ${i + 1}`, 1, 1, { label: "", mode: "app", appId: "fleet", url: "" });
        w.place = { col: i + 1, row: 1, w: 1, h: 1 };
        widgets.push(w);
      }
      // Row 1: medium at E1
      const mediumTop = widget("stats", "Medium Top", 2, 2, WIDGET_CATALOG.stats.seed());
      mediumTop.place = { col: 5, row: 1, w: 2, h: 2 };
      widgets.push(mediumTop);

      // Row 2: banner, button, button, banner
      const bannerLeft = widget("note", "Banner 1", 4, 1, { text: "Banner" });
      bannerLeft.place = { col: 1, row: 2, w: 4, h: 1 };
      widgets.push(bannerLeft);

      const bannerRight = widget("note", "Banner 2", 4, 1, { text: "Banner" });
      bannerRight.place = { col: 7, row: 2, w: 4, h: 1 };
      widgets.push(bannerRight);

      // Row 3: 5 mediums
      const mediumCols = [1, 3, 5, 7, 9];
      mediumCols.forEach((col, idx) => {
        const m = widget(idx % 2 === 0 ? "stats" : "list", `Medium ${idx + 1}`, 2, 2, WIDGET_CATALOG.stats.seed());
        m.place = { col, row: 3, w: 2, h: 2 };
        widgets.push(m);
      });
      // Row 5: 5 talls (1 column wide, 4 rows high)
      mediumCols.forEach((col, idx) => {
        const t = widget("list", `Tall ${idx + 1}`, 2, 4, WIDGET_CATALOG.list.seed());
        t.place = { col, row: 5, w: 2, h: 4 };
        widgets.push(t);
      });
      return widgets;
    },
  },
  {
    id: "tpl-big-boy",
    name: "Big Boy",
    widgets: () => {
      const widgets = [];
      // A1: large
      const largeA1 = widget("projects", "Large A1", LARGE_COLS, 4, WIDGET_CATALOG.projects.seed());
      largeA1.place = { col: 1, row: 1, w: LARGE_COLS, h: 4 };
      widgets.push(largeA1);

      // G1: large
      const largeG1 = widget("projects", "Large G1", LARGE_COLS, 4, WIDGET_CATALOG.projects.seed());
      largeG1.place = { col: 7, row: 1, w: LARGE_COLS, h: 4 };
      widgets.push(largeG1);

      // E1-F4: buttons
      const buttonSlots = [
        { label: "E1", col: 5, row: 1 },
        { label: "F1", col: 6, row: 1 },
        { label: "E2", col: 5, row: 2 },
        { label: "F2", col: 6, row: 2 },
        { label: "E3", col: 5, row: 3 },
        { label: "F3", col: 6, row: 3 },
        { label: "E4", col: 5, row: 4 },
        { label: "F4", col: 6, row: 4 },
      ];
      buttonSlots.forEach((slot) => {
        const b = widget("button", `Button ${slot.label}`, 1, 1, { label: "", mode: "app", appId: "fleet", url: "" });
        b.place = { col: slot.col, row: slot.row, w: 1, h: 1 };
        widgets.push(b);
      });

      // A5: large
      const largeA5 = widget("projects", "Large A5", LARGE_COLS, 4, WIDGET_CATALOG.projects.seed());
      largeA5.place = { col: 1, row: 5, w: LARGE_COLS, h: 4 };
      widgets.push(largeA5);

      // E5: tall
      const tallE5 = widget("list", "Tall E5", 2, 4, WIDGET_CATALOG.list.seed());
      tallE5.place = { col: 5, row: 5, w: 2, h: 4 };
      widgets.push(tallE5);

      // G5: large
      const largeG5 = widget("projects", "Large G5", LARGE_COLS, 4, WIDGET_CATALOG.projects.seed());
      largeG5.place = { col: 7, row: 5, w: LARGE_COLS, h: 4 };
      widgets.push(largeG5);

      return widgets;
    },
  },
];

function baseHomeWidgets() {
  const items = [
    // Row 1: buttons
    widget("button", "Button 1", 1, 1, { label: "", mode: "app", appId: "fleet", url: "" }),
    widget("button", "Button 2", 1, 1, { label: "", mode: "app", appId: "finance", url: "" }),
    widget("button", "Button 3", 1, 1, { label: "", mode: "app", appId: "people", url: "" }),
    widget("button", "Button 4", 1, 1, { label: "Mates", mode: "app", appId: "mates", url: "" }),
    // Large
    widget("projects", "Projects", 4, 4, WIDGET_CATALOG.projects.seed()),
    // Medium widgets
    widget("sticky", "Medium A", 2, 2, WIDGET_CATALOG.sticky.seed()),
    widget("leave", "Medium B", 2, 2, WIDGET_CATALOG.leave.seed()),
    widget("onsite", "Medium C", 2, 2, WIDGET_CATALOG.onsite.seed()),
    widget("target", "Medium D", 2, 2, WIDGET_CATALOG.target.seed()),
    widget("fleet", "Medium G", 2, 2, WIDGET_CATALOG.fleet.seed()),
    widget("snag", "Medium H", 2, 2, WIDGET_CATALOG.snag.seed()),
    // Tall widgets
    widget("onsiteTall", "Tall A", 2, 4, WIDGET_CATALOG.onsiteTall.seed()),
    widget("todo", "Tall B", 2, 4, WIDGET_CATALOG.todo.seed()),
    // Row 4: banner
    widget("note", "Banner", 4, 1, { text: "Banner message...", mode: "headlines" }),
    // Profile (right column)
    widget("profile", "Profile", 2, 6, WIDGET_CATALOG.profile.seed()),
    // Add widget (below profile)
    widget("add", "Add widget", 2, 2, { text: "Add widget" }),
  ];

  const profile = items.find((w) => w.type === "profile");
  const addWidget = items.find((w) => w.type === "add");
  const map = items.find((w) => w.type === "projects" || w.type === "fleetmap");
  const banner = items.find((w) => w.type === "note");
  const medA = items.find((w) => w.title === "Medium A");
  const medB = items.find((w) => w.title === "Medium B");
  const medC = items.find((w) => w.title === "Medium C");
  const medD = items.find((w) => w.title === "Medium D");
  const medG = items.find((w) => w.title === "Medium G");
  const medH = items.find((w) => w.title === "Medium H");
  const tallA = items.find((w) => w.title === "Tall A");
  const tallB = items.find((w) => w.title === "Tall B");

  items.forEach((w, idx) => {
    if (w.type === "button") w.place = { col: idx + 1, row: 1, w: 1, h: 1 };
  });

  if (medA) medA.place = { col: 1, row: 2, w: 2, h: 2 };
  if (medB) medB.place = { col: 3, row: 2, w: 2, h: 2 };
  if (banner) banner.place = { col: 1, row: 4, w: 4, h: 1 };
  if (map) map.place = { col: 5, row: 1, w: 4, h: 4 };
  if (tallA) tallA.place = { col: 1, row: 5, w: 2, h: 4 };
  if (tallB) tallB.place = { col: 3, row: 5, w: 2, h: 4 };
  if (medC) medC.place = { col: 5, row: 5, w: 2, h: 2 };
  if (medD) medD.place = { col: 7, row: 5, w: 2, h: 2 };
  if (medG) medG.place = { col: 5, row: 7, w: 2, h: 2 };
  if (medH) medH.place = { col: 7, row: 7, w: 2, h: 2 };
  if (profile) profile.place = { col: 9, row: 1, w: 2, h: 6 };
  if (addWidget) addWidget.place = { col: 9, row: 7, w: 2, h: 2 };
  return items;
}

function withHomePlacement(widgets) {
  return widgets.map((w, idx) => {
    if (idx <= 4) w.row = 1;
    else if (idx <= 7) w.row = 2;
    else if (idx <= 9) w.row = 3;
    else if (idx === 10) w.row = 4;
    else w.row = 0;
    w.span = { w: w.w, h: w.h };
    if (w.row === 1) {
      w.place = { col: idx + 1, row: 1, w: 1, h: 1 };
    }
    if (w.row === 2) {
      if (w.type === "projects" || w.type === "fleetmap") w.place = { col: 1, row: 1, w: 3, h: 4 };
      if (w.title === "Medium 1") w.place = { col: 4, row: 1, w: 2, h: 2 };
      if (w.title === "Medium 2") w.place = { col: 4, row: 3, w: 2, h: 2 };
    }
    if (w.row === 3) {
      if (w.type === "todo") w.place = { col: 1, row: 1, w: 2, h: 2 };
      if (w.type === "calculator") w.place = { col: 3, row: 1, w: 2, h: 2 };
    }
    if (w.row === 4) {
      w.place = { col: 1, row: 1, w: 5, h: 1 };
    }
    return w;
  });
}

let state = {
  editMode: false,
  activePageId: "overview",
  stickyNotes: [],
  headlines: {
    items: [],
    idx: 0,
    lastUpdated: 0,
  },
  pages: [
    {
      id: "overview",
      name: "Home",
      templateId: "balanced",
      widgets: baseHomeWidgets(),
    },
  ],
};

function init() {
  els.userName.textContent = USER.name;
  loadStickyNotes();
  ensureStickyLayer();
  initHeadlinesFeed();
  wireUI();
  render();
  // time/date widgets removed
}

function wireUI() {
  els.editToggle.addEventListener("click", () => {
    state.editMode = !state.editMode;
    render();
  });
  els.modalBackdrop.addEventListener("click", closeModal);
  els.modalCloseBtn.addEventListener("click", closeModal);
}

function render() {
  document.body.classList.toggle("edit-mode", state.editMode);
  els.editToggle.innerHTML = state.editMode ? "💾" : "✏️";

  renderTabs();
  renderWidgets();
  renderStickyNotes();
}

function renderTabs() {
  const pageEls = state.pages
    .map((p) => {
      const isHome = p.id === "home" || p.name === "Home";
      const active = p.id === state.activePageId ? "tab--active" : "";
      const home = isHome ? "tab--home" : "";
      const del =
        state.editMode && !isHome
          ? `<span class="tab__delete" data-action="delete-page" data-page-id="${escapeAttr(p.id)}" title="Delete">✕</span>`
          : "";
      return `<button class="tab ${active} ${home}" data-page-id="${escapeAttr(p.id)}">
        <span class="tab__label">${escapeHtml(p.name)}</span>
        ${del}
      </button>`;
    })
    .join("");

  const addBtn = state.editMode
    ? `<button class="tab tab--add" data-action="add-page">+ Add page</button>`
    : "";

  els.tabs.innerHTML = pageEls + addBtn;

  els.tabs.querySelectorAll("[data-page-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activePageId = btn.getAttribute("data-page-id");
      render();
    });
  });

  els.tabs.querySelectorAll("[data-action='delete-page']").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-page-id");
      if (!state.editMode) return;
      const page = state.pages.find((p) => p.id === id);
      if (!page || page.name === "Home" || page.id === "home") return;
      const ok = confirm(`Delete page "${page.name}"?`);
      if (!ok) return;
      state.pages = state.pages.filter((p) => p.id !== id);
      if (state.activePageId === id) {
        state.activePageId = state.pages[0]?.id || "home";
      }
      render();
    });
  });

  const add = els.tabs.querySelector("[data-action='add-page']");
  add?.addEventListener("click", () => openAddPageModal());
}

function renderWidgets() {
  const page = state.pages.find((p) => p.id === state.activePageId) || state.pages[0];
  els.widgets.innerHTML = "";

  if (page.id === "home") {
    renderHomeLayout(page);
  } else {
    page.widgets.forEach((w) => {
      const node = document.createElement("article");
      const hiddenClass = w.type === "hide" ? "widget--hidden" : "";
      const noPadClass = w.type === "add" ? "widget--no-pad" : "";
      const typeClass = w.type ? `widget--${w.type}` : "";
      node.className = `widget ${hiddenClass} ${noPadClass} ${typeClass} ${w.type === "profile" ? "widget--profile widget--fixed-profile" : ""}`;
      if (w.place) {
        node.style.gridColumn = `${w.place.col} / span ${w.place.w}`;
        node.style.gridRow = `${w.place.row} / span ${w.place.h}`;
      } else if (w.type === "profile") {
        const startCol = Math.max(1, 11 - (w.w || 2));
        node.style.gridColumn = `${startCol} / span ${w.w || 2}`;
        node.style.gridRow = `1 / span ${w.h || 6}`;
      } else {
        node.style.gridColumn = `span ${w.w}`;
        node.style.gridRow = `span ${w.h}`;
      }

      const overlayHtml = state.editMode && !["profile", "add"].includes(w.type)
        ? `<div class="widget__overlay">
            <button class="widget__overlay-btn" data-action="edit-widget" data-widget-id="${escapeAttr(w.id)}" title="Edit">✏️</button>
          </div>`
        : "";

      if (w.type === "button") {
        node.setAttribute("data-action", "open-button");
        node.setAttribute("data-widget-id", w.id);
      }

      node.innerHTML = `
        ${overlayHtml}
        <div class="widget__body">${renderWidgetBody(w)}</div>
      `;

      els.widgets.appendChild(node);
    });
  }

  els.widgets.querySelectorAll("[data-action='edit-widget']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-widget-id");
      openWidgetEditor(id);
    });
  });

  els.widgets.querySelectorAll("[data-action='open-button']").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.editMode) return;
      const id = btn.getAttribute("data-widget-id");
      const widget = findWidget(id);
      if (!widget) return;
      if (widget.data.mode === "url") {
        if (!widget.data.url) return toast("Add a URL in Edit mode.");
        window.open(widget.data.url, "_blank", "noopener,noreferrer");
        return;
      }
      const app = SYSTEM_APPS.find((a) => a.id === widget.data.appId);
      openSystemApp(app?.name || "System app");
    });
  });

  els.widgets.querySelectorAll("[data-action='open-chat']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-chat") || "mates";
      openChatModal(mode);
    });
  });

  els.widgets.querySelectorAll("[data-action='calc-btn']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-widget-id");
      const value = btn.getAttribute("data-value");
      onCalcInput(id, value);
    });
  });

  els.widgets.querySelectorAll("[data-action='todo-toggle']").forEach((box) => {
    box.addEventListener("change", () => {
      const id = box.getAttribute("data-widget-id");
      const todoId = box.getAttribute("data-todo-id");
      const widget = findWidget(id);
      const item = widget?.data?.items?.find((i) => i.id === todoId);
      if (!item) return;
      item.done = box.checked;
    });
  });

  els.widgets.querySelectorAll("[data-action='todo-add']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-widget-id");
      const widget = findWidget(id);
      if (!widget) return;
      const input = els.widgets.querySelector(`[data-action="todo-input"][data-widget-id="${id}"]`);
      const value = input?.value?.trim();
      if (!value) return;
      widget.data.items = widget.data.items || [];
      widget.data.items.push({ id: rid("t"), text: value, done: false });
      input.value = "";
      renderWidgets();
    });
  });

  els.widgets.querySelectorAll("[data-action='onsite-select']").forEach((sel) => {
    sel.addEventListener("change", () => {
      const id = sel.getAttribute("data-widget-id");
      const widget = findWidget(id);
      if (!widget) return;
      widget.data.selected = sel.value;
      renderWidgets();
    });
  });

  els.widgets.querySelectorAll("[data-action='sticky-text']").forEach((input) => {
    input.addEventListener("input", () => {
      const id = input.getAttribute("data-widget-id");
      const widget = findWidget(id);
      if (!widget) return;
      widget.data.text = input.value;
    });
  });

  els.widgets.querySelectorAll("[data-action='sticky-color']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-widget-id");
      const color = btn.getAttribute("data-color");
      const widget = findWidget(id);
      if (!widget) return;
      widget.data.color = color;
      renderWidgets();
    });
  });

  els.widgets.querySelectorAll("[data-action='sticky-create']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-widget-id");
      const widget = findWidget(id);
      if (!widget) return;
      const text = (widget.data.text || "").trim();
      if (!text) return toast("Add some text for the sticky note.");
      addStickyNote(text, widget.data.color || "yellow");
    });
  });
}

function renderHomeLayout(page) {
  const profile = page.widgets.find((w) => w.type === "profile") || seedHomeProfile(page);
  const addWidget = page.widgets.find((w) => w.type === "add");
  const row1 = page.widgets.filter((w) => w.row === 1);
  const row2 = page.widgets.filter((w) => w.row === 2);
  const row3 = page.widgets.filter((w) => w.row === 3);
  const row4 = page.widgets.filter((w) => w.row === 4);

  const wrap = document.createElement("div");
  wrap.className = "home-layout";
  wrap.innerHTML = `
    <div class="home-row" data-row="1"></div>
    <div class="home-row" data-row="2"></div>
    <div class="home-row" data-row="3"></div>
    <div class="home-row" data-row="4"></div>
    <div class="home-profile"></div>
  `;

  const rowEls = {
    1: wrap.querySelector("[data-row='1']"),
    2: wrap.querySelector("[data-row='2']"),
    3: wrap.querySelector("[data-row='3']"),
    4: wrap.querySelector("[data-row='4']"),
  };

  row1.forEach((w) => rowEls[1].appendChild(renderTile(w)));
  row2.forEach((w) => rowEls[2].appendChild(renderTile(w)));
  row3.forEach((w) => rowEls[3].appendChild(renderTile(w)));
  row4.forEach((w) => rowEls[4].appendChild(renderTile(w)));

  const profileCol = wrap.querySelector(".home-profile");
  profileCol.appendChild(renderTile(profile, { forceTall: true }));

  if (addWidget) {
    const addTile = renderTile(addWidget, { noPad: true });
    addTile.style.gridRow = "span 2";
    profileCol.appendChild(addTile);
  } else {
    const addBox = document.createElement("div");
    addBox.className = "add-widget";
    addBox.style.gridRow = "span 2";
    addBox.innerHTML = `<div><b>Add widget</b><br/>Drop a widget here in Edit mode.</div>`;
    profileCol.appendChild(addBox);
  }

  els.widgets.appendChild(wrap);
}

function renderTile(w, opts = {}) {
  const node = document.createElement("article");
  const hiddenClass = w.type === "hide" ? "widget-tile--hidden" : "";
  const typeClass = w.type ? `widget-tile--${w.type}` : "";
  const noPadClass = w.type === "add" || opts.noPad ? "widget-tile--no-pad" : "";
  node.className = `widget-tile ${hiddenClass} ${noPadClass} ${typeClass} ${w.type === "profile" ? "widget--profile" : ""}`;
  if (w.place) {
    node.style.gridColumn = `${w.place.col} / span ${w.place.w}`;
    node.style.gridRow = `${w.place.row} / span ${w.place.h}`;
  } else if (w.span) {
    node.style.gridColumn = `span ${w.span.w}`;
    node.style.gridRow = `span ${w.span.h}`;
  } else {
    node.style.gridColumn = `span ${w.w}`;
    node.style.gridRow = `span ${w.h}`;
  }
  if (opts.forceTall) node.style.gridRow = "span 6";

  if (w.type === "button") {
    node.setAttribute("data-action", "open-button");
    node.setAttribute("data-widget-id", w.id);
  }

  node.innerHTML = `
    ${state.editMode && !["profile", "add"].includes(w.type) ? `<div class="widget__overlay">
      <button class="widget__overlay-btn" data-action="edit-widget" data-widget-id="${escapeAttr(w.id)}" title="Edit">✏️</button>
    </div>` : ""}
    <div class="widget-tile__body">${renderWidgetBody(w)}</div>
  `;
  return node;
}

function seedHomeProfile(page) {
  const w = widget("profile", "Profile", 3, 6, WIDGET_CATALOG.profile.seed());
  w.row = 0;
  page.widgets.push(w);
  return w;
}

function renderWidgetBody(w) {
  if (w.type === "hide") {
    return "";
  }
  if (w.type === "stats") {
    return `
      <div class="stat-grid">
        ${w.data.items
          .map(
            (item) => `
          <div class="stat-card">
            <div class="stat-card__label">${escapeHtml(item.label)}</div>
            <div class="stat-card__value">${escapeHtml(item.value)}</div>
            <div class="stat-card__delta">${escapeHtml(item.delta)}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }
  if (w.type === "chart") {
    return `<div class="centered"><div class="chart">${escapeHtml(w.data.hint || "Chart")}</div></div>`;
  }
  if (w.type === "list") {
    return `
      <div class="list">
        ${w.data.items
          .map(
            (item) => `
          <div class="list-item">
            <div>${escapeHtml(item.title)}</div>
            <div class="list-item__meta">${escapeHtml(item.meta)}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }
  if (w.type === "timeline") {
    return `
      <div class="list">
        ${w.data.items
          .map(
            (item, idx) => `
          <div class="list-item">
            <div>${escapeHtml(item)}</div>
            <span class="tag">Step ${idx + 1}</span>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }
  if (w.type === "note") {
    if (w.span?.h === 1 || w.h === 1) {
      if (w.data?.mode === "headlines") {
        const item = state.headlines.items[state.headlines.idx];
        const headline = item?.title || "Unable to load headlines right now.";
        const link = item?.link || "";
        return `
          <div class="headlines-banner">
            <div class="headlines-banner__badge">New headlines</div>
            <div class="headlines-banner__text">${escapeHtml(headline)}</div>
            ${
              link
                ? `<a class="headlines-banner__link" href="${escapeAttr(link)}" target="_blank" rel="noopener noreferrer">Read more</a>`
                : ""
            }
          </div>
        `;
      }
      return `<div class="centered"><div class="banner">${escapeHtml(w.data.text)}</div></div>`;
    }
    return `<div class="note">${escapeHtml(w.data.text)}</div>`;
  }
  if (w.type === "quicknote") {
    return `<div class="note">${escapeHtml(w.data.text)}</div>`;
  }
  if (w.type === "todo") {
    return `
      <div class="todo">
        <div class="todo-input">
          <input type="text" placeholder="Add a task..." data-action="todo-input" data-widget-id="${escapeAttr(w.id)}" />
          <button class="btn btn--primary btn--sm" data-action="todo-add" data-widget-id="${escapeAttr(w.id)}">Add</button>
        </div>
        ${w.data.items
          .map(
            (item) => `
          <label class="todo-item">
            <input type="checkbox" data-action="todo-toggle" data-widget-id="${escapeAttr(w.id)}" data-todo-id="${escapeAttr(item.id)}" ${
              item.done ? "checked" : ""
            } />
            <span>${escapeHtml(item.text)}</span>
          </label>
        `
          )
          .join("")}
      </div>
    `;
  }
  if (w.type === "calculator") {
    return `
      <div class="calculator">
        <div class="calculator__display">${escapeHtml(w.data.display || "0")}</div>
        <div class="calculator__grid">
          ${["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"]
            .map(
              (v) => `
            <div class="calc-btn ${v === "=" ? "calc-btn--accent" : ""}" data-action="calc-btn" data-widget-id="${escapeAttr(
              w.id
            )}" data-value="${escapeAttr(v)}">${escapeHtml(v)}</div>
          `
            )
            .join("")}
          <div class="calc-btn" data-action="calc-btn" data-widget-id="${escapeAttr(w.id)}" data-value="C">C</div>
        </div>
      </div>
    `;
  }
  if (w.type === "projects") {
    return `
      <img class="projects-map" src="./projectsmap.png" alt="Projects map" />
    `;
  }
  if (w.type === "fleetmap") {
    return `
      <img class="projects-map" src="./vanmap.png" alt="Fleet map" />
    `;
  }
  if (w.type === "add") {
    return `
      <div class="ad-widget">
        <img class="ad-widget__img" src="./ad.png" alt="Ad" />
      </div>
    `;
  }
  if (w.type === "button") {
    const label = escapeHtml(w.data.label || "Open");
    const imageUrl = w.data.imageUrl ? escapeAttr(w.data.imageUrl) : "";
    const imageAlt = escapeAttr(w.data.label || "Button");
    return `
      <div class="centered">
        <div class="button-widget">
          <div class="button-widget__btn">
            ${imageUrl ? `<img class="button-widget__img" src="${imageUrl}" alt="${imageAlt}" />` : `<div>${label}</div>`}
          </div>
        </div>
      </div>
    `;
  }
  if (w.type === "sticky") {
    const text = escapeHtml(w.data.text || "");
    const selected = w.data.color || "yellow";
    return `
      <div class="sticky-widget">
        <textarea class="sticky-widget__input" data-action="sticky-text" data-widget-id="${escapeAttr(w.id)}" placeholder="Create a sticky note...">${text}</textarea>
        <div class="sticky-widget__actions">
          <div class="sticky-widget__colors">
            ${STICKY_COLORS.map(
              (c) => `
              <button class="sticky-color ${c.id === selected ? "sticky-color--selected" : ""}" data-action="sticky-color" data-widget-id="${escapeAttr(
                w.id
              )}" data-color="${escapeAttr(c.id)}" style="--sticky-color:${escapeAttr(c.hex)}" title="${escapeAttr(c.label)}"></button>
            `
            ).join("")}
          </div>
          <button class="btn btn--primary sticky-widget__btn" data-action="sticky-create" data-widget-id="${escapeAttr(w.id)}">Sticky</button>
        </div>
      </div>
    `;
  }
  if (w.type === "leave") {
    return `
      <div class="leave-widget">
        <div class="leave-widget__title">Leave request</div>
        <div class="leave-widget__row">
          <div>
            <div class="label">From</div>
            <input type="text" placeholder="YYYY-MM-DD" />
          </div>
          <div>
            <div class="label">To</div>
            <input type="text" placeholder="YYYY-MM-DD" />
          </div>
        </div>
        <div>
          <div class="label">Reason</div>
          <textarea placeholder="Add a reason..."></textarea>
        </div>
        <button class="btn btn--primary">Submit</button>
      </div>
    `;
  }
  if (w.type === "onsite") {
    const count = Number.isFinite(w.data?.count) ? w.data.count : 76;
    const projects = Array.isArray(w.data?.projects) && w.data.projects.length
      ? w.data.projects
      : [
        { name: "Warehouse 14", count: 18 },
        { name: "Bridge retrofit", count: 22 },
        { name: "City rail", count: 16 },
        { name: "River tunnels", count: 20 },
      ];
    return `
      <div class="onsite-widget">
        <div class="onsite-widget__left">
          <div class="onsite-widget__label">Number on site</div>
          <div class="onsite-widget__count">${escapeHtml(count)}</div>
          <div class="onsite-widget__sub">People clocked in</div>
        </div>
        <div class="onsite-widget__right">
          <div class="onsite-widget__title">Projects</div>
          <div class="onsite-widget__list">
            ${projects
              .map(
                (item) => `
              <div class="onsite-widget__item">
                <span>${escapeHtml(item.name)}</span>
                <b>${escapeHtml(String(item.count))}</b>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }
  if (w.type === "snag") {
    const count = Number.isFinite(w.data?.count) ? w.data.count : 5;
    const items = Array.isArray(w.data?.items) && w.data.items.length
      ? w.data.items
      : [
        { name: "Office Snag list" },
        { name: "Chobham snags" },
        { name: "Lee Rd snag list" },
        { name: "Monties Snags" },
        { name: "Bishops lane Snag list" },
      ];
    return `
      <div class="snag-widget">
        <div class="snag-widget__left">
          <div class="snag-widget__label">Active snags</div>
          <div class="snag-widget__count">${escapeHtml(count)}</div>
        </div>
        <div class="snag-widget__right">
          <div class="snag-widget__title">Snag lists</div>
          <div class="snag-widget__list">
            ${items
              .map(
                (item) => `
              <div class="snag-widget__item">${escapeHtml(item.name)}</div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }
  if (w.type === "fleet") {
    return `
      <div class="fleet-widget">
        <div class="fleet-widget__title">Fleet notice</div>
        <div class="fleet-widget__list">
          ${w.data.items
            .map(
              (item) => `
            <div class="fleet-widget__item">
              <span>${escapeHtml(item.label)}</span>
              <b>${escapeHtml(String(item.value))}</b>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }
  if (w.type === "onsiteTall") {
    const selected = w.data?.selected || "all";
    const projects = Array.isArray(w.data?.projects) ? w.data.projects : [];
    const workers = Array.isArray(w.data?.workers) ? w.data.workers : [];
    const visible = selected === "all"
      ? workers
      : workers.filter((wkr) => wkr.projectId === selected);
    return `
      <div class="onsite-tall">
        <select class="onsite-tall__select" data-action="onsite-select" data-widget-id="${escapeAttr(w.id)}">
          ${projects.map((p) => `<option value="${escapeAttr(p.id)}" ${p.id === selected ? "selected" : ""}>${escapeHtml(p.name)}</option>`).join("")}
        </select>
        <div class="onsite-tall__list">
          ${visible
            .map(
              (wkr) => `
            <div class="onsite-tall__item">
              <span>${escapeHtml(wkr.name)}</span>
              <span class="onsite-tall__time">${escapeHtml(wkr.time || "")}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }
  if (w.type === "target") {
    return `
      <div class="target-widget">
        <div class="target-widget__title">Targets</div>
        ${w.data.items
          .map(
            (item) => `
          <div class="target-widget__row">
            <div class="target-widget__label">${escapeHtml(item.label)}</div>
            <div class="target-widget__value">${escapeHtml(String(item.value))}%</div>
            <div class="target-widget__bar"><span style="width:${Number(item.value) || 0}%"></span></div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }
  if (w.type === "profile") {
    return `
      <div class="profile">
        <div class="profile__header">
          <div class="profile__avatar">
            ${w.data.avatarUrl ? `<img src="${escapeAttr(w.data.avatarUrl)}" alt="${escapeAttr(w.data.name)}" />` : escapeHtml(initials(w.data.name))}
          </div>
          <div>
            <div class="profile__name">${escapeHtml(w.data.name)}</div>
            <div class="profile__handle">${escapeHtml(w.data.handle || "")}</div>
          </div>
        </div>
        <div class="profile__meta">
          <span class="profile__badge">${escapeHtml(w.data.company || "Company")}</span>
          <span class="profile__badge profile__badge--online">${escapeHtml(w.data.status || "Online")}</span>
        </div>
        <div class="profile__bio">${escapeHtml(w.data.bio || "")}</div>
        <div class="profile__stats-row">
          <div><b>${escapeHtml(w.data.posts || "0")}</b><span>Posts</span></div>
          <div><b>${escapeHtml(w.data.followers || "0")}</b><span>Followers</span></div>
          <div><b>${escapeHtml(w.data.following || "0")}</b><span>Following</span></div>
        </div>
        <div class="profile__actions">
          <button class="profile__btn" data-action="open-chat" data-chat="mates">Mates</button>
          <button class="profile__btn profile__btn--ghost" data-action="open-chat" data-chat="crews">Crews</button>
        </div>
        <div class="profile__section">
          <div class="profile__row">
            <span class="profile__label">Location</span>
            <span class="profile__value">${escapeHtml(w.data.location)}</span>
          </div>
          <div class="profile__row">
            <span class="profile__label">Email</span>
            <span class="profile__value">${escapeHtml(w.data.email)}</span>
          </div>
          <div class="profile__row">
            <span class="profile__label">Phone</span>
            <span class="profile__value">${escapeHtml(w.data.phone)}</span>
          </div>
        </div>
        <div class="profile__section">
          <div class="profile__stats">
            ${w.data.stats
              .map(
                (s) => `
              <div>
                <div class="profile__row">
                  <span class="profile__label">${escapeHtml(s.label)}</span>
                  <span class="profile__value">${escapeHtml(s.value)}</span>
                </div>
                <div class="profile__bar"><span style="width:${Number(s.pct || 0)}%"></span></div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }
  return `<div class="note">Widget type not supported.</div>`;
}

function openAddPageModal() {
  const body = document.createElement("div");
  body.className = "form";
  body.innerHTML = `
    <div>
      <div class="label">Page name</div>
      <input type="text" id="pageName" placeholder="e.g., Sales dashboard" />
    </div>
    <div>
      <div class="label">Template</div>
      <div class="template-grid" id="templateGrid">
        ${TEMPLATES.map((t, idx) => templateTileHtml(t, idx === 0)).join("")}
      </div>
    </div>
  `;

  let selectedTemplateId = TEMPLATES[0]?.id;
  body.querySelectorAll("[data-template-id]").forEach((tile) => {
    tile.addEventListener("click", () => {
      body.querySelectorAll(".template-tile").forEach((el) => el.classList.remove("template-tile--selected"));
      tile.classList.add("template-tile--selected");
      selectedTemplateId = tile.getAttribute("data-template-id");
    });
  });

  const save = button("Create", "btn btn--primary", () => {
    const name = body.querySelector("#pageName").value.trim();
    const templateId = selectedTemplateId;
    if (!name) return alert("Enter a page name.");
    const tpl = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
    const id = rid("page");
    state.pages.push({
      id,
      name,
      templateId: tpl.id,
      widgets: tpl.widgets(),
    });
    state.activePageId = id;
    closeModal();
    render();
  });
  const cancel = button("Cancel", "btn", closeModal);
  openModal("Add page", body, [cancel, save]);
  setTimeout(() => body.querySelector("#pageName")?.focus(), 0);
}

function templateTileHtml(tpl, selected) {
  const blocks = templatePreviewBlocks(tpl.id);
  const preview = blocks
    .map(
      (b) =>
        `<div class="template-block ${b.accent ? "template-block--accent" : ""}" style="grid-column:${b.col}/span ${b.w}; grid-row:${b.row}/span ${b.h};"></div>`
    )
    .join("");
  return `
    <button class="template-tile ${selected ? "template-tile--selected" : ""}" data-template-id="${escapeAttr(tpl.id)}">
      <div class="template-title">${escapeHtml(tpl.name)}</div>
      <div class="template-preview">${preview}</div>
    </button>
  `;
}

function templatePreviewBlocks(id) {
  if (id === "tpl-home") {
    return [
      { col: 1, row: 1, w: 1, h: 1 },
      { col: 2, row: 1, w: 1, h: 1 },
      { col: 3, row: 1, w: 1, h: 1 },
      { col: 4, row: 1, w: 1, h: 1 },
      { col: 5, row: 1, w: 4, h: 4, accent: true },
      { col: 1, row: 5, w: 2, h: 4 },
      { col: 3, row: 5, w: 2, h: 4 },
      { col: 5, row: 5, w: 2, h: 2 },
      { col: 5, row: 7, w: 2, h: 2 },
      { col: 7, row: 5, w: 2, h: 2 },
      { col: 7, row: 7, w: 2, h: 2 },
      { col: 1, row: 2, w: 2, h: 2 },
      { col: 3, row: 2, w: 2, h: 2 },
      { col: 1, row: 4, w: 4, h: 1 },
      { col: 9, row: 1, w: 2, h: 6 },
      { col: 9, row: 7, w: 2, h: 2 },
    ];
  }
  if (id === "tpl-bmbt") {
    return [
      { col: 1, row: 1, w: 1, h: 1 },
      { col: 2, row: 1, w: 1, h: 1 },
      { col: 3, row: 1, w: 1, h: 1 },
      { col: 4, row: 1, w: 1, h: 1 },
      { col: 5, row: 1, w: 2, h: 2 },
      { col: 7, row: 1, w: 1, h: 1 },
      { col: 8, row: 1, w: 1, h: 1 },
      { col: 9, row: 1, w: 1, h: 1 },
      { col: 10, row: 1, w: 1, h: 1 },
      { col: 1, row: 2, w: 4, h: 1 },
      { col: 7, row: 2, w: 4, h: 1 },
      { col: 1, row: 3, w: 2, h: 2 },
      { col: 3, row: 3, w: 2, h: 2 },
      { col: 5, row: 3, w: 2, h: 2 },
      { col: 7, row: 3, w: 2, h: 2 },
      { col: 9, row: 3, w: 2, h: 2 },
      { col: 1, row: 5, w: 2, h: 4 },
      { col: 3, row: 5, w: 2, h: 4 },
      { col: 5, row: 5, w: 2, h: 4 },
      { col: 7, row: 5, w: 2, h: 4 },
      { col: 9, row: 5, w: 2, h: 4 },
    ];
  }
  if (id === "tpl-big-boy") {
    return [
      { col: 1, row: 1, w: LARGE_COLS, h: 4, accent: true },
      { col: 7, row: 1, w: LARGE_COLS, h: 4, accent: true },
      { col: 5, row: 1, w: 1, h: 1 },
      { col: 6, row: 1, w: 1, h: 1 },
      { col: 5, row: 2, w: 1, h: 1 },
      { col: 6, row: 2, w: 1, h: 1 },
      { col: 5, row: 3, w: 1, h: 1 },
      { col: 6, row: 3, w: 1, h: 1 },
      { col: 5, row: 4, w: 1, h: 1 },
      { col: 6, row: 4, w: 1, h: 1 },
      { col: 1, row: 5, w: LARGE_COLS, h: 4, accent: true },
      { col: 5, row: 5, w: 2, h: 4 },
      { col: 7, row: 5, w: LARGE_COLS, h: 4, accent: true },
    ];
  }
  return [];
}

function openWidgetEditor(widgetId) {
  const page = state.pages.find((p) => p.id === state.activePageId);
  const widget = page?.widgets.find((w) => w.id === widgetId);
  if (!widget) return;

  const body = document.createElement("div");
  body.className = "form";
  const typeRow = document.createElement("div");
  typeRow.innerHTML = `
    <div class="label">Widget content</div>
    <select id="widgetTypeSelect" class="widget__select">
      ${buildWidgetOptions(widget)}
    </select>
  `;
  body.appendChild(typeRow);
  const typeSelect = typeRow.querySelector("#widgetTypeSelect");
  typeSelect.addEventListener("change", () => {
    const nextType = typeSelect.value;
    widget.type = nextType;
    widget.title = WIDGET_CATALOG[nextType]?.label || "Widget";
    widget.data = seedData(nextType);
    closeModal();
    renderWidgets();
  });

  if (widget.type === "note" || widget.type === "quicknote") {
    const row = document.createElement("div");
    row.innerHTML = `
      <div class="label">Note text</div>
      <textarea id="noteText"></textarea>
    `;
    body.appendChild(row);
    const isBanner = widget.type === "note" && (widget.h === 1 || widget.span?.h === 1);
    if (isBanner) {
      const templateRow = document.createElement("div");
      templateRow.innerHTML = `
        <div class="label">Banner template</div>
        <select id="bannerTemplate">
          <option value="text">Text</option>
          <option value="headlines">Headlines</option>
        </select>
      `;
      body.insertBefore(templateRow, row);
      body.querySelector("#bannerTemplate").value = widget.data.mode || "text";
    }
    body.querySelector("#noteText").value = widget.data.text;
    const save = button("Save", "btn btn--primary", () => {
      widget.data.text = body.querySelector("#noteText").value.trim();
      if (isBanner) {
        widget.data.mode = body.querySelector("#bannerTemplate").value;
      }
      closeModal();
      renderWidgets();
    });
    const cancel = button("Cancel", "btn", closeModal);
    openModal(`Edit: ${widget.title}`, body, [cancel, save]);
    return;
  }

  if (widget.type === "button") {
    const row = document.createElement("div");
    row.innerHTML = `
      <div>
        <div class="label">Button label</div>
        <input type="text" id="btnLabel" />
      </div>
      <div>
        <div class="label">Button image (optional)</div>
        <input type="text" id="btnImage" placeholder="https://example.com/button.png" />
      </div>
      <div>
        <div class="label">Action type</div>
        <select id="btnMode">
          <option value="app">System app</option>
          <option value="url">External URL</option>
        </select>
      </div>
      <div id="btnAppRow">
        <div class="label">System app</div>
        <select id="btnApp">
          ${SYSTEM_APPS.map((a) => `<option value="${escapeAttr(a.id)}">${escapeHtml(a.name)}</option>`).join("")}
        </select>
      </div>
      <div id="btnUrlRow">
        <div class="label">URL</div>
        <input type="text" id="btnUrl" placeholder="https://example.com" />
      </div>
    `;
    body.appendChild(row);
    body.querySelector("#btnLabel").value = widget.data.label || "Open";
    body.querySelector("#btnImage").value = widget.data.imageUrl || "";
    body.querySelector("#btnMode").value = widget.data.mode || "app";
    body.querySelector("#btnUrl").value = widget.data.url || "";
    body.querySelector("#btnApp").value = widget.data.appId || SYSTEM_APPS[0].id;
    const sync = () => {
      const mode = body.querySelector("#btnMode").value;
      body.querySelector("#btnAppRow").style.display = mode === "app" ? "" : "none";
      body.querySelector("#btnUrlRow").style.display = mode === "url" ? "" : "none";
    };
    body.querySelector("#btnMode").addEventListener("change", sync);
    sync();
    const save = button("Save", "btn btn--primary", () => {
      widget.data.label = body.querySelector("#btnLabel").value.trim() || "Open";
      widget.data.imageUrl = body.querySelector("#btnImage").value.trim();
      widget.data.mode = body.querySelector("#btnMode").value;
      widget.data.url = body.querySelector("#btnUrl").value.trim();
      widget.data.appId = body.querySelector("#btnApp").value;
      closeModal();
      renderWidgets();
    });
    const cancel = button("Cancel", "btn", closeModal);
    openModal(`Edit: ${widget.title}`, body, [cancel, save]);
    return;
  }

  if (widget.type === "todo") {
    const note = document.createElement("div");
    note.className = "note";
    note.textContent = "Add and manage items directly in the widget.";
    body.appendChild(note);
    const close = button("Close", "btn btn--primary", closeModal);
    openModal(`Edit: ${widget.title}`, body, [close]);
    return;
  }

  if (widget.type === "projects" || widget.type === "fleetmap") {
    const note = document.createElement("div");
    note.className = "note";
    note.textContent = "Select the widget content from the dropdown above.";
    body.appendChild(note);
    const close = button("Close", "btn btn--primary", closeModal);
    openModal(`Edit: ${widget.title}`, body, [close]);
    return;
  }

  const note = document.createElement("div");
  note.className = "note";
  note.textContent = "Editing for this widget type is coming next. We will wire up custom fields later.";
  body.appendChild(note);
  const close = button("Close", "btn btn--primary", closeModal);
  openModal(`Edit: ${widget.title}`, body, [close]);
}

function openModal(title, bodyEl, footerButtons = []) {
  els.modalTitle.textContent = title;
  els.modalBody.innerHTML = "";
  els.modalBody.appendChild(bodyEl);
  els.modalFooter.innerHTML = "";
  footerButtons.forEach((b) => els.modalFooter.appendChild(b));
  els.modal.classList.remove("modal--hidden");
}

function closeModal() {
  els.modal.classList.add("modal--hidden");
  els.modalTitle.textContent = "";
  els.modalBody.innerHTML = "";
  els.modalFooter.innerHTML = "";
}

function openChatModal(mode) {
  const list = DEMO_CHATS[mode] || [];
  const body = document.createElement("div");
  body.className = "chat-modal";
  const memberPanel =
    mode === "crews"
      ? `
    <div class="chat-members">
      <div class="chat-title">Members</div>
      <div class="chat-list">
        ${DEMO_CREW_MEMBERS.map(
          (m) => `
          <div class="chat-member">
            <div class="chat-member__name">${escapeHtml(m.name)}</div>
            <div class="chat-member__role">${escapeHtml(m.role)}</div>
          </div>
        `
        ).join("")}
      </div>
    </div>
  `
      : "";
  body.innerHTML = `
    <div class="chat-sidebar">
      <div class="chat-title">${mode === "crews" ? "Crews" : "Mates"}</div>
      <div class="chat-list">
        ${list
          .map(
            (item, idx) => `
          <button class="chat-item ${idx === 0 ? "chat-item--active" : ""}">
            <div class="chat-item__name">${escapeHtml(item.name)}</div>
            <div class="chat-item__last">${escapeHtml(item.last)}</div>
          </button>
        `
          )
          .join("")}
      </div>
    </div>
    <div class="chat-main">
      <div class="chat-header">
        <div class="chat-header__title">${escapeHtml(list[0]?.name || "Conversation")}</div>
        <div class="chat-header__sub">${mode === "crews" ? "Group chat" : "Direct chat"}</div>
      </div>
      <div class="chat-messages">
        <div class="chat-bubble chat-bubble--left">Hey! Just checking in.</div>
        <div class="chat-bubble chat-bubble--left">Are we set for tomorrow?</div>
        <div class="chat-bubble chat-bubble--right">Yep, all set. I'll confirm the roster.</div>
        <div class="chat-bubble chat-bubble--left">Perfect, thank you.</div>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Type a message..." />
        <button class="btn btn--primary btn--icon">➤</button>
      </div>
    </div>
    ${memberPanel}
  `;
  const close = button("Close", "btn", closeModal);
  openModal(mode === "crews" ? "Crew Chat" : "Mates Chat", body, [close]);
}

function button(label, cls, onClick) {
  const b = document.createElement("button");
  b.className = cls;
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
}

function widget(type, title, w, h, data) {
  return { id: rid("w"), type, title, w, h, data };
}

function findWidget(id) {
  const page = state.pages.find((p) => p.id === state.activePageId);
  return page?.widgets.find((w) => w.id === id);
}

function sizeBucket(w) {
  if (w.w === 2 && w.h === 4) return "tall";
  if (w.h === 1) return "tiny";
  if (w.h === 2 && w.w === 1) return "small";
  if (w.w === 2 && w.h === 2) return "medium";
  if (w.w === 4 || w.h === 4) return "large";
  return "medium";
}

function buildWidgetOptions(w) {
  const bucket = sizeBucket(w);
  const allowed = {
    tiny: ["button", "quicknote", "hide"],
    small: ["button", "quicknote", "todo", "hide"],
    medium: ["sticky", "leave", "onsite", "snag", "fleet", "target", "hide"],
    large: ["projects", "fleetmap", "hide"],
    tall: ["todo", "onsiteTall", "calculator", "hide"],
  }[bucket];

  const types = allowed.includes(w.type) ? allowed : [w.type, ...allowed];
  return types
    .map((type) => {
      const label = WIDGET_CATALOG[type]?.label || type;
      const selected = type === w.type ? "selected" : "";
      return `<option value="${escapeAttr(type)}" ${selected}>${escapeHtml(label)}</option>`;
    })
    .join("");
}

function seedData(type) {
  return WIDGET_CATALOG[type]?.seed?.() ?? {};
}

function widgetTitle(w) {
  const typeLabel = (() => {
    if (w.type === "button") return "Button";
    if (w.type === "profile") return "Profile";
    if (w.type === "add") return "Add";
    if (w.type === "note" && (w.span?.h === 1 || w.h === 1)) return "Banner";
    if (w.type === "note" || w.type === "quicknote") return "Note";
    if (w.type === "leave") return "Leave request";
    if (w.type === "onsite") return "On site";
    if (w.type === "snag") return "Snag lists";
    if (w.type === "fleet") return "Fleet notice";
    if (w.type === "target") return "Targets";
    if (w.type === "onsiteTall") return "On site";
    if (w.type === "calculator") return "Calculator";
    if (w.type === "todo") return "Todo";
    if (w.type === "projects") return "Projects";
    if (w.type === "fleetmap") return "Fleet";
    const bucket = sizeBucket(w);
    return bucket.charAt(0).toUpperCase() + bucket.slice(1);
  })();
  const content = w.title || WIDGET_CATALOG[w.type]?.label || "Widget";
  return `${typeLabel} · ${content}`;
}

function onCalcInput(widgetId, value) {
  const widget = findWidget(widgetId);
  if (!widget) return;
  widget.data = widget.data || { display: "0", expr: "" };
  const expr = widget.data.expr || "";

  if (value === "C") {
    widget.data.display = "0";
    widget.data.expr = "";
    renderWidgets();
    return;
  }

  if (value === "=") {
    const cleaned = expr.replace(/[^0-9+\-*/.()]/g, "");
    try {
      const result = Function(`"use strict"; return (${cleaned || "0"})`)();
      widget.data.display = String(result);
      widget.data.expr = String(result);
    } catch {
      widget.data.display = "Error";
      widget.data.expr = "";
    }
    renderWidgets();
    return;
  }

  const nextExpr = `${expr}${value}`;
  widget.data.expr = nextExpr;
  widget.data.display = nextExpr;
  renderWidgets();
}

function openSystemApp(name) {
  toast(`Opening ${name}...`);
}

function toast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.left = "50%";
  t.style.bottom = "20px";
  t.style.transform = "translateX(-50%)";
  t.style.background = "rgba(17,24,39,0.92)";
  t.style.color = "white";
  t.style.padding = "10px 12px";
  t.style.borderRadius = "999px";
  t.style.fontSize = "13px";
  t.style.zIndex = "99";
  t.style.boxShadow = "0 10px 40px rgba(0,0,0,0.25)";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function rid(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2, 8)}`;
}

function initials(name) {
  const parts = String(name).split(" ").filter(Boolean);
  return (parts[0]?.[0] ?? "U") + (parts[1]?.[0] ?? "");
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(s) {
  return escapeHtml(s).replaceAll("`", "&#096;");
}

function ensureStickyLayer() {
  if (els.stickyLayer) return;
  const layer = document.createElement("div");
  layer.className = "sticky-layer";
  els.dashboard.appendChild(layer);
  els.stickyLayer = layer;
}

function addStickyNote(text, color) {
  const offset = 20 * (state.stickyNotes.length % 5);
  state.stickyNotes.push({
    id: rid("sticky"),
    text,
    color,
    x: 40 + offset,
    y: 40 + offset,
  });
  saveStickyNotes();
  renderStickyNotes();
}

function renderStickyNotes() {
  ensureStickyLayer();
  els.stickyLayer.innerHTML = "";
  state.stickyNotes.forEach((note) => {
    const el = document.createElement("div");
    const color = STICKY_COLORS.find((c) => c.id === note.color)?.hex || STICKY_COLORS[0].hex;
    el.className = "sticky-note";
    el.setAttribute("data-note-id", note.id);
    el.style.setProperty("--sticky-color", color);
    el.style.left = `${note.x}px`;
    el.style.top = `${note.y}px`;
    el.innerHTML = `
      <div class="sticky-note__bar">
        <span class="sticky-note__bar-text">drag'n'drop</span>
      </div>
      <button class="sticky-note__delete" data-action="sticky-delete" title="Delete">×</button>
      <div class="sticky-note__text">${escapeHtml(note.text)}</div>
    `;

    el.querySelector("[data-action='sticky-delete']").addEventListener("click", () => {
      const ok = confirm("Delete this sticky note?");
      if (!ok) return;
      state.stickyNotes = state.stickyNotes.filter((n) => n.id !== note.id);
      saveStickyNotes();
      renderStickyNotes();
    });

    el.addEventListener("pointerdown", (e) => {
      if (e.target.closest("[data-action='sticky-delete']")) return;
      beginStickyDrag(e, note.id, el);
    });

    els.stickyLayer.appendChild(el);
  });
}

let stickyDragState = null;

function beginStickyDrag(e, id, el) {
  const note = state.stickyNotes.find((n) => n.id === id);
  if (!note) return;
  e.preventDefault();
  el.classList.add("sticky-note--dragging");
  stickyDragState = {
    id,
    el,
    startX: e.clientX,
    startY: e.clientY,
    originX: note.x,
    originY: note.y,
  };
  document.addEventListener("pointermove", onStickyDragMove);
  document.addEventListener("pointerup", onStickyDragEnd, { once: true });
}

function onStickyDragMove(e) {
  if (!stickyDragState) return;
  const note = state.stickyNotes.find((n) => n.id === stickyDragState.id);
  if (!note) return;
  const dx = e.clientX - stickyDragState.startX;
  const dy = e.clientY - stickyDragState.startY;
  note.x = stickyDragState.originX + dx;
  note.y = stickyDragState.originY + dy;
  stickyDragState.el.style.left = `${note.x}px`;
  stickyDragState.el.style.top = `${note.y}px`;
  const rotation = Math.max(-6, Math.min(6, dx / 12));
  stickyDragState.el.style.transform = `rotate(${rotation}deg) scale(1.02)`;
}

function onStickyDragEnd() {
  document.removeEventListener("pointermove", onStickyDragMove);
  if (stickyDragState?.el) {
    stickyDragState.el.classList.remove("sticky-note--dragging");
    stickyDragState.el.style.transform = "";
  }
  if (stickyDragState) {
    saveStickyNotes();
  }
  stickyDragState = null;
}

const STICKY_STORAGE_KEY = "dashboard.stickyNotes";

function saveStickyNotes() {
  try {
    localStorage.setItem(STICKY_STORAGE_KEY, JSON.stringify(state.stickyNotes));
  } catch {
    // Ignore storage errors (private mode/quota)
  }
}

function loadStickyNotes() {
  try {
    const raw = localStorage.getItem(STICKY_STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return;
    state.stickyNotes = data
      .filter((n) => n && typeof n === "object")
      .map((n) => ({
        id: typeof n.id === "string" ? n.id : rid("sticky"),
        text: typeof n.text === "string" ? n.text : "",
        color: typeof n.color === "string" ? n.color : "yellow",
        x: Number.isFinite(n.x) ? n.x : 40,
        y: Number.isFinite(n.y) ? n.y : 40,
      }));
  } catch {
    // Ignore parse/storage errors
  }
}

function initHeadlinesFeed() {
  fetchHeadlines();
  setInterval(() => {
    rotateHeadline();
  }, HEADLINES_ROTATE_MS);
  setInterval(() => {
    fetchHeadlines();
  }, HEADLINES_REFRESH_MS);
}

function rotateHeadline() {
  if (!state.headlines.items.length) return;
  state.headlines.idx = (state.headlines.idx + 1) % state.headlines.items.length;
  renderWidgets();
}

function fetchHeadlines() {
  const tryFetch = (index) => {
    if (index >= HEADLINES_FEED_SOURCES.length) {
      if (!state.headlines.items.length) {
        state.headlines.items = [{ title: "Unable to load headlines right now.", link: "" }];
        state.headlines.idx = 0;
        renderWidgets();
      }
      return;
    }

    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(HEADLINES_FEED_SOURCES[index])}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Headlines fetch failed.");
        return res.text();
      })
      .then((text) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        if (xml.querySelector("parsererror")) throw new Error("Headlines parse failed.");
        const items = Array.from(xml.querySelectorAll("item"))
          .map((node) => {
            const title = node.querySelector("title")?.textContent?.trim();
            const link = node.querySelector("link")?.textContent?.trim();
            if (!title) return null;
            return { title, link: link || "" };
          })
          .filter(Boolean);
        if (!items.length) throw new Error("Headlines empty.");
        state.headlines.items = items.slice(0, 20);
        state.headlines.idx = 0;
        state.headlines.lastUpdated = Date.now();
        renderWidgets();
      })
      .catch(() => tryFetch(index + 1));
  };

  tryFetch(0);
}

init();

