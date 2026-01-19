const els = {
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
  note: { label: "Note", seed: () => ({ text: "Add a longer note here for context." }) },
  quicknote: { label: "Quick note", seed: () => ({ text: "Quick note..." }) },
  todo: { label: "Todo list", seed: () => ({
    items: [
      { id: rid("t"), text: "Review vehicle alerts", done: false },
      { id: rid("t"), text: "Approve new hires", done: true },
      { id: rid("t"), text: "Send weekly report", done: false },
    ],
  }) },
  calculator: { label: "Calculator", seed: () => ({ display: "0", expr: "" }) },
  map: { label: "Live map", seed: () => ({ title: "Vehicle tracker" }) },
  button: { label: "Action button", seed: () => ({
    label: "Open app",
    mode: "app",
    url: "https://example.com",
    appId: "fleet",
    imageUrl: "",
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
      const largeA1 = widget("map", "Large A1", LARGE_COLS, 4, { title: "Large widget" });
      largeA1.place = { col: 1, row: 1, w: LARGE_COLS, h: 4 };
      widgets.push(largeA1);

      // G1: large
      const largeG1 = widget("map", "Large G1", LARGE_COLS, 4, { title: "Large widget" });
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
      const largeA5 = widget("map", "Large A5", LARGE_COLS, 4, { title: "Large widget" });
      largeA5.place = { col: 1, row: 5, w: LARGE_COLS, h: 4 };
      widgets.push(largeA5);

      // E5: tall
      const tallE5 = widget("list", "Tall E5", 2, 4, WIDGET_CATALOG.list.seed());
      tallE5.place = { col: 5, row: 5, w: 2, h: 4 };
      widgets.push(tallE5);

      // G5: large
      const largeG5 = widget("map", "Large G5", LARGE_COLS, 4, { title: "Large widget" });
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
    widget("map", "Vehicle tracker", 4, 4, { title: "Vehicle tracker" }),
    // Medium widgets
    widget("stats", "Medium A", 2, 2, WIDGET_CATALOG.stats.seed()),
    widget("list", "Medium B", 2, 2, WIDGET_CATALOG.list.seed()),
    widget("stats", "Medium C", 2, 2, WIDGET_CATALOG.stats.seed()),
    widget("list", "Medium D", 2, 2, WIDGET_CATALOG.list.seed()),
    widget("list", "Medium G", 2, 2, WIDGET_CATALOG.list.seed()),
    widget("stats", "Medium H", 2, 2, WIDGET_CATALOG.stats.seed()),
    // Tall widgets
    widget("list", "Tall A", 2, 4, WIDGET_CATALOG.list.seed()),
    widget("list", "Tall B", 2, 4, WIDGET_CATALOG.list.seed()),
    // Row 4: banner
    widget("note", "Banner", 4, 1, { text: "Banner message..." }),
    // Profile (right column)
    widget("profile", "Profile", 2, 6, WIDGET_CATALOG.profile.seed()),
    // Add widget (below profile)
    widget("add", "Add widget", 2, 2, { text: "Add widget" }),
  ];

  const profile = items.find((w) => w.type === "profile");
  const addWidget = items.find((w) => w.type === "add");
  const map = items.find((w) => w.type === "map");
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
      if (w.type === "map") w.place = { col: 1, row: 1, w: 3, h: 4 };
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
    if (w.span?.h === 1) return `<div class="centered"><div class="banner">${escapeHtml(w.data.text)}</div></div>`;
    return `<div class="note">${escapeHtml(w.data.text)}</div>`;
  }
  if (w.type === "quicknote") {
    return `<div class="note">${escapeHtml(w.data.text)}</div>`;
  }
  if (w.type === "todo") {
    return `
      <div class="todo">
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
  if (w.type === "map") {
    return `
      <div class="centered">
        <div class="map">
          <div class="map__pin"></div>
          ${escapeHtml(w.data.title || "Map")}
        </div>
      </div>
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
    body.querySelector("#noteText").value = widget.data.text;
    const save = button("Save", "btn btn--primary", () => {
      widget.data.text = body.querySelector("#noteText").value.trim();
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
    const row = document.createElement("div");
    row.innerHTML = `
      <div class="label">Todo items (one per line)</div>
      <textarea id="todoLines"></textarea>
    `;
    body.appendChild(row);
    body.querySelector("#todoLines").value = (widget.data.items || []).map((i) => i.text).join("\n");
    const save = button("Save", "btn btn--primary", () => {
      const lines = body
        .querySelector("#todoLines")
        .value.split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      widget.data.items = lines.map((text) => ({ id: rid("t"), text, done: false }));
      closeModal();
      renderWidgets();
    });
    const cancel = button("Cancel", "btn", closeModal);
    openModal(`Edit: ${widget.title}`, body, [cancel, save]);
    return;
  }

  if (widget.type === "map") {
    const row = document.createElement("div");
    row.innerHTML = `
      <div class="label">Map label</div>
      <input type="text" id="mapTitle" />
    `;
    body.appendChild(row);
    body.querySelector("#mapTitle").value = widget.data.title || "Vehicle tracker";
    const save = button("Save", "btn btn--primary", () => {
      widget.data.title = body.querySelector("#mapTitle").value.trim() || "Vehicle tracker";
      closeModal();
      renderWidgets();
    });
    const cancel = button("Cancel", "btn", closeModal);
    openModal(`Edit: ${widget.title}`, body, [cancel, save]);
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
    medium: ["stats", "list", "timeline", "note", "calculator", "todo", "button", "hide"],
    large: ["map", "chart", "list", "stats", "todo", "note", "hide"],
    tall: ["profile", "list", "todo", "note", "map", "hide"],
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
    if (w.type === "calculator") return "Calculator";
    if (w.type === "todo") return "Todo";
    if (w.type === "map") return "Large";
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

init();

