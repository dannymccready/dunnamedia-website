const els = {
  tabs: document.getElementById("tabs"),
  widgets: document.getElementById("widgets"),
  editToggle: document.getElementById("editToggle"),
  modal: document.getElementById("modal"),
  modalBackdrop: document.getElementById("modalBackdrop"),
  modalCloseBtn: document.getElementById("modalCloseBtn"),
  modalTitle: document.getElementById("modalTitle"),
  modalBody: document.getElementById("modalBody"),
  modalFooter: document.getElementById("modalFooter"),
  headerRows: Array.from(document.querySelectorAll(".header-message__row")),
};

const SYSTEM_APPS = [
  { id: "fleet", name: "Fleet Tracker" },
  { id: "finance", name: "Finance Hub" },
  { id: "people", name: "People Ops" },
  { id: "ops", name: "Operations" },
];

const WIDGET_CATALOG = {
  hide: { label: "Hide", seed: () => ({}) },
  pdf: { label: "PDF", seed: () => ({ template: "cms-news", src: "./new.pdf" }) },
  news: { label: "News", seed: () => ({
    items: [
      { title: "Quarterly update posted", meta: "2 hours ago" },
      { title: "New hiring plan approved", meta: "Yesterday" },
      { title: "Design review scheduled", meta: "Mon" },
      { title: "Operations checklist updated", meta: "Fri" },
    ],
  }) },
  banner: { label: "Banner", seed: () => ({
    template: "notify",
    title: "Notice",
    currentText: "System maintenance scheduled at 6 PM.",
    items: [
      { title: "Action required: Review draft policy", meta: "Today" },
      { title: "New message from Operations", meta: "1 hour ago" },
      { title: "System maintenance scheduled", meta: "Tomorrow" },
    ],
    events: [
      { date: "Mar 12", title: "Town hall", meta: "10:00 AM" },
      { date: "Mar 15", title: "Design review", meta: "2:00 PM" },
      { date: "Mar 19", title: "Ops sync", meta: "9:30 AM" },
    ],
  }) },
  stats: { label: "Metrics", seed: () => ({
    items: [
      { label: "Active projects", value: "24", delta: "+8%" },
      { label: "Open tasks", value: "312", delta: "+4%" },
      { label: "Revenue", value: "$42.9k", delta: "+12%" },
    ],
  }) },
  chart: { label: "Chart", seed: () => ({ hint: "Engagement" }) },
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
    label: "Open page",
    mode: "page",
    url: "https://example.com",
    pageId: "overview",
    imageUrl: "",
  }) },
  add: { label: "Add", seed: () => ({ text: "Add widget" }) },
  message: { label: "Message", seed: () => ({
    header: "Announcement",
    text: "This is an important message for the team.",
    imageUrl: "",
  }) },
  notice: { label: "Notice", seed: () => ({
    title: "Notice",
    currentText: "Type a notice...",
  }) },
  poll: { label: "Poll", seed: () => ({
    question: "What's your favorite feature?",
    options: [
      { id: rid("opt"), text: "Option 1", votes: 0 },
      { id: rid("opt"), text: "Option 2", votes: 0 },
      { id: rid("opt"), text: "Option 3", votes: 0 },
    ],
  }) },
  yoursay: { label: "Your say", seed: () => ({
    question: "What improvements would you like to see in our dashboard?",
    responses: [
      { id: rid("resp"), author: "Sarah Chen", text: "I think we should add more customization options for the widgets. The current layout is good but could be more flexible.", time: "2 hours ago" },
      { id: rid("resp"), author: "Mike Johnson", text: "Would love to see dark mode support! Also, the notification system could be improved.", time: "1 day ago" },
      { id: rid("resp"), author: "Emma Wilson", text: "The dashboard is great overall. Maybe add some analytics widgets to track usage?", time: "2 days ago" },
      { id: rid("resp"), author: "David Lee", text: "I agree with Sarah about customization. Also, can we have more widget templates?", time: "3 days ago" },
    ],
  }) },
  birthday: { label: "Birthday Shouts", seed: () => {
    const today = new Date();
    const todayStr = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return {
      employees: [
        { name: "Jordan Lee", birthDate: todayStr, role: "Design" },
        { name: "Alex Morgan", birthDate: todayStr, role: "Engineering" },
        { name: "Sam Taylor", birthDate: "03-15", role: "Product" },
        { name: "Casey Kim", birthDate: "07-04", role: "Marketing" },
        { name: "Riley Jones", birthDate: "12-25", role: "Support" },
      ],
    };
  } },
  profile: { label: "Profile", seed: () => ({
    name: "Amelie Laurent",
    role: "UX Designer",
    location: "Paris, France",
    email: "amelie@company.com",
    phone: "+33 1 70 36 93 90",
    stats: [
      { label: "Business trips", value: "58 days", pct: 70 },
      { label: "Sick leave", value: "4 days", pct: 15 },
    ],
  }) },
};

const TEMPLATES = [
  {
    id: "tpl-home",
    name: "Base",
    widgets: () => baseHomeWidgets(),
  },
  {
    id: "tpl-bmbt",
    name: "News",
    widgets: () => {
      const widgets = [];
      // Row 1: buttons in all columns (8 half-columns)
      for (let i = 0; i < 8; i++) {
        const w = widget("button", `Button ${i + 1}`, 1, 1, { label: "", mode: "app", appId: "fleet", url: "" });
        w.place = { col: i + 1, row: 1, w: 1, h: 1 };
        widgets.push(w);
      }
      // Row 2: 2 banners (4 columns wide each)
      const bannerCols = [1, 5];
      bannerCols.forEach((col, idx) => {
        const b = widget("note", `Banner ${idx + 1}`, 4, 1, { text: "Banner" });
        b.place = { col, row: 2, w: 4, h: 1 };
        widgets.push(b);
      });
      // Row 3: 4 mediums (1 column wide each)
      const mediumCols = [1, 3, 5, 7];
      mediumCols.forEach((col, idx) => {
        const m = widget("poll", `Medium ${idx + 1}`, 2, 2, WIDGET_CATALOG.poll.seed());
        m.place = { col, row: 3, w: 2, h: 2 };
        widgets.push(m);
      });
      // Row 5: 4 talls (1 column wide, 4 rows high)
      mediumCols.forEach((col, idx) => {
        const t = widget("poll", `Tall ${idx + 1}`, 2, 4, WIDGET_CATALOG.poll.seed());
        t.place = { col, row: 5, w: 2, h: 4 };
        widgets.push(t);
      });
      return widgets;
    },
  },
  {
    id: "tpl-big-boy",
    name: "Events",
    widgets: () => {
      const widgets = [];
      // Row 1: 6 mediums
      const mediumCols = [1, 3, 5, 7];
      mediumCols.forEach((col, idx) => {
        const m = widget("poll", `Medium ${idx + 1}`, 2, 2, WIDGET_CATALOG.poll.seed());
        m.place = { col, row: 1, w: 2, h: 2 };
        widgets.push(m);
      });
      // Row 3: 2 mediums, 4 buttons
      const m1 = widget("poll", "Medium A", 2, 2, WIDGET_CATALOG.poll.seed());
      m1.place = { col: 1, row: 3, w: 2, h: 2 };
      const m2 = widget("poll", "Medium B", 2, 2, WIDGET_CATALOG.poll.seed());
      m2.place = { col: 3, row: 3, w: 2, h: 2 };
      widgets.push(m1, m2);
      const btnCols = [5, 6, 7, 8];
      btnCols.forEach((col, idx) => {
        const b = widget("button", `Button ${idx + 1}`, 1, 1, { label: "", mode: "app", appId: "fleet", url: "" });
        b.place = { col, row: 3, w: 1, h: 1 };
        widgets.push(b);
      });
      // Row 4: banner at E4
      const banner = widget("note", "Banner", 4, 1, { text: "Banner" });
      banner.place = { col: 5, row: 4, w: 4, h: 1 };
      widgets.push(banner);
      // Row 5: 2 larges
      const largeCols = [1, 5];
      largeCols.forEach((col, idx) => {
        const l = widget("map", `Large ${idx + 1}`, 4, 4, { title: "Large widget" });
        l.place = { col, row: 5, w: 4, h: 4 };
        widgets.push(l);
      });
      return widgets;
    },
  },
];

function getTemplateWidgets(templateId) {
  const t = TEMPLATES.find((tpl) => tpl.id === templateId) || TEMPLATES[0];
  return t.widgets();
}

function cloneWidgets(widgets) {
  const out = structuredClone(widgets || []);
  out.forEach((w) => { w.id = rid("w"); });
  return out;
}

function baseHomeWidgets() {
  const items = [
    // Row 1: buttons
    widget("button", "Button 1", 1, 1, { label: "", mode: "app", appId: "fleet", url: "" }),
    widget("button", "Button 2", 1, 1, { label: "", mode: "app", appId: "finance", url: "" }),
    widget("button", "Button 3", 1, 1, { label: "", mode: "app", appId: "people", url: "" }),
    widget("button", "Button 4", 1, 1, { label: "", mode: "app", appId: "ops", url: "" }),
    // PDF (large)
    widget("pdf", "PDF", 4, 7, WIDGET_CATALOG.pdf.seed()),
    // Banner (wide)
    widget("banner", "Banner", 4, 1, WIDGET_CATALOG.banner.seed()),
    // Medium / tall widgets
    widget("birthday", "Birthday Shouts", 2, 4, WIDGET_CATALOG.birthday.seed()),
    widget("poll", "Medium B", 2, 2, WIDGET_CATALOG.poll.seed()),
    widget("poll", "Tall C", 2, 4, WIDGET_CATALOG.poll.seed()),
    widget("message", "Announcements", 2, 2, {
      header: "Announcements",
      text: "Add your announcement here. Customise this in Edit mode for everyone to see.",
      imageUrl: "",
    }),
  ];

  const pdf = items.find((w) => w.type === "pdf");
  const banner = items.find((w) => w.type === "banner");
  const birthdayA4 = items.find((w) => w.title === "Birthday Shouts");
  const medB = items.find((w) => w.title === "Medium B");
  const tallC = items.find((w) => w.title === "Tall C");
  const announcementsC2 = items.find((w) => w.title === "Announcements");

  const buttons = items.filter((w) => w.type === "button");
  if (buttons[0]) buttons[0].place = { col: 1, row: 2, w: 1, h: 1 };
  if (buttons[1]) buttons[1].place = { col: 2, row: 2, w: 1, h: 1 };
  if (buttons[2]) buttons[2].place = { col: 1, row: 3, w: 1, h: 1 };
  if (buttons[3]) buttons[3].place = { col: 2, row: 3, w: 1, h: 1 };

  if (banner) banner.place = { col: 1, row: 1, w: 4, h: 1 };
  if (pdf) pdf.place = { col: 5, row: 1, w: 4, h: 7 };
  if (birthdayA4) birthdayA4.place = { col: 1, row: 4, w: 2, h: 4 };
  if (medB) medB.place = { col: 3, row: 4, w: 2, h: 2 };
  if (announcementsC2) announcementsC2.place = { col: 3, row: 2, w: 2, h: 2 };
  if (tallC) tallC.place = { col: 3, row: 4, w: 2, h: 4 };
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
  defaultHomeTemplateId: "tpl-home",
  headerMessageFields: [
    {
      text: "Welcome to the team dashboard.",
      font: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial',
      color: "#111827",
      bold: true,
      italic: false,
      underline: false,
    },
    {
      text: "Add updates, priorities, or a quick note here.",
      font: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial',
      color: "#111827",
      bold: false,
      italic: false,
      underline: false,
    },
    {
      text: "This area is editable in Edit mode.",
      font: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial',
      color: "#111827",
      bold: false,
      italic: true,
      underline: false,
    },
    {
      text: "Use the toolbar to style each line.",
      font: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial',
      color: "#111827",
      bold: false,
      italic: false,
      underline: true,
    },
  ],
  pages: [
    {
      id: "overview",
      name: "Base",
      templateId: "balanced",
      widgets: baseHomeWidgets(),
    },
  ],
};

function init() {
  // Load default home template and apply to overview page
  state.defaultHomeTemplateId = localStorage.getItem("defaultHomeTemplateId") || "tpl-home";
  const overview = state.pages.find((p) => p.id === "overview");
  if (overview) {
    const pageSource = state.pages.find((p) => p.id === state.defaultHomeTemplateId);
    if (pageSource) {
      overview.widgets = cloneWidgets(pageSource.widgets);
    } else {
      overview.widgets = getTemplateWidgets(state.defaultHomeTemplateId || "tpl-home");
    }
  }

  syncHeaderFields();
  wireUI();
  render();
  // time/date widgets removed
}

function wireUI() {
  els.editToggle.addEventListener("click", () => {
    state.editMode = !state.editMode;
    render();
  });

  const defaultTplSelect = document.getElementById("defaultTplSelect");
  if (defaultTplSelect) {
    defaultTplSelect.addEventListener("change", () => {
      const pageId = defaultTplSelect.value;
      state.defaultHomeTemplateId = pageId;
      localStorage.setItem("defaultHomeTemplateId", pageId);
      const ov = state.pages.find((p) => p.id === "overview");
      const src = state.pages.find((p) => p.id === pageId);
      if (ov && src && src.id !== ov.id) {
        ov.widgets = cloneWidgets(src.widgets);
      }
      render();
    });
  }
  els.modalBackdrop.addEventListener("click", closeModal);
  els.modalCloseBtn.addEventListener("click", closeModal);
  els.headerRows.forEach((row, idx) => {
    const field = row.querySelector(".header-message__field");
    const fontSelect = row.querySelector(".header-message__font");
    const colorPicker = row.querySelector(".header-message__color");
    const boldBtn = row.querySelector(".header-message__bold");
    const italicBtn = row.querySelector(".header-message__italic");
    const underlineBtn = row.querySelector(".header-message__underline");
    if (!field || !fontSelect || !colorPicker || !boldBtn || !italicBtn || !underlineBtn) return;

    field.addEventListener("input", (event) => {
      const target = event.target;
      const item = state.headerMessageFields[idx];
      if (item) item.text = target.value;
    });

    fontSelect.addEventListener("change", (event) => {
      const item = state.headerMessageFields[idx];
      if (!item) return;
      item.font = event.target.value;
      applyHeaderFieldStyles(idx);
      updateHeaderRowControls(idx);
    });
    colorPicker.addEventListener("input", (event) => {
      const item = state.headerMessageFields[idx];
      if (!item) return;
      item.color = event.target.value;
      applyHeaderFieldStyles(idx);
      updateHeaderRowControls(idx);
    });
    boldBtn.addEventListener("click", () => {
      toggleHeaderStyle(idx, "bold");
    });
    italicBtn.addEventListener("click", () => {
      toggleHeaderStyle(idx, "italic");
    });
    underlineBtn.addEventListener("click", () => {
      toggleHeaderStyle(idx, "underline");
    });
  });
}

function render() {
  document.body.classList.toggle("edit-mode", state.editMode);
  els.editToggle.innerHTML = state.editMode ? "💾" : "✏️";

  const defaultTplSelect = document.getElementById("defaultTplSelect");
  if (defaultTplSelect && state.pages.length > 0) {
    defaultTplSelect.innerHTML = state.pages
      .map((p) => `<option value="${escapeAttr(p.id)}">${escapeHtml(p.name)}</option>`)
      .join("");
    const validId = state.pages.some((p) => p.id === state.defaultHomeTemplateId)
      ? state.defaultHomeTemplateId
      : (state.pages.find((p) => p.id === "overview")?.id || state.pages[0]?.id || "");
    defaultTplSelect.value = validId || "";
  }

  els.headerRows.forEach((row, idx) => {
    const field = row.querySelector(".header-message__field");
    if (!field) return;
    field.readOnly = !state.editMode;
    if (field.value !== state.headerMessageFields[idx]?.text) {
      field.value = state.headerMessageFields[idx]?.text ?? "";
    }
    row.classList.toggle("header-message__row--disabled", !state.editMode);
  });
  updateHeaderRowControls();

  renderTabs();
  renderWidgets();
}

function renderTabs() {
  const pageEls = state.pages
    .map((p) => {
      const isHome = p.id === "home" || p.id === "overview" || p.name === "Home";
      const active = p.id === state.activePageId ? "tab--active" : "";
      const home = isHome ? "tab--home" : "";
      const del =
        state.editMode && state.pages.length > 1
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
      if (state.pages.length <= 1) return; // always keep at least one
      const page = state.pages.find((p) => p.id === id);
      if (!page) return;
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

function applyHeaderFieldStyles(idx) {
  const item = state.headerMessageFields[idx];
  const field = els.headerRows[idx]?.querySelector(".header-message__field");
  if (!item || !field) return;
  field.style.fontFamily = item.font;
  field.style.color = item.color;
  field.style.fontWeight = item.bold ? "800" : "600";
  field.style.fontStyle = item.italic ? "italic" : "normal";
  field.style.textDecoration = item.underline ? "underline" : "none";
}

function syncHeaderFields() {
  state.headerMessageFields.forEach((item, idx) => {
    const field = els.headerRows[idx]?.querySelector(".header-message__field");
    if (!field) return;
    field.value = item.text;
    applyHeaderFieldStyles(idx);
  });
  updateHeaderRowControls();
}

function toggleHeaderStyle(idx, styleKey) {
  const item = state.headerMessageFields[idx];
  if (!item) return;
  item[styleKey] = !item[styleKey];
  applyHeaderFieldStyles(idx);
  updateHeaderRowControls(idx);
}

function updateHeaderRowControls(targetIdx) {
  const rows = typeof targetIdx === "number" ? [els.headerRows[targetIdx]] : els.headerRows;
  rows.forEach((row, idx) => {
    if (!row) return;
    const item = state.headerMessageFields[idx];
    if (!item) return;
    const fontSelect = row.querySelector(".header-message__font");
    const colorPicker = row.querySelector(".header-message__color");
    const boldBtn = row.querySelector(".header-message__bold");
    const italicBtn = row.querySelector(".header-message__italic");
    const underlineBtn = row.querySelector(".header-message__underline");
    if (fontSelect) fontSelect.value = item.font;
    if (colorPicker) colorPicker.value = item.color;
    boldBtn?.classList.toggle("is-active", Boolean(item.bold));
    italicBtn?.classList.toggle("is-active", Boolean(item.italic));
    underlineBtn?.classList.toggle("is-active", Boolean(item.underline));
  });
}

function renderWidgets() {
  const page = state.pages.find((p) => p.id === state.activePageId) || state.pages[0];
  // Completely clear widgets container - remove all children
  while (els.widgets.firstChild) {
    els.widgets.removeChild(els.widgets.firstChild);
  }
  els.widgets.innerHTML = "";
  // Force a reflow to ensure DOM is completely cleared
  void els.widgets.offsetHeight;

  if (page.id === "home") {
    renderHomeLayout(page);
  } else {
    page.widgets.forEach((w) => {
      const node = document.createElement("article");
      const hiddenClass = w.type === "hide" ? "widget--hidden" : "";
      node.className = `widget widget--${w.type} ${hiddenClass} ${w.type === "profile" ? "widget--profile widget--fixed-profile" : ""}`;
      if (w.place) {
        node.style.gridColumn = `${w.place.col} / span ${w.place.w}`;
        node.style.gridRow = `${w.place.row} / span ${w.place.h}`;
      } else if (w.type === "profile") {
        const startCol = Math.max(1, 13 - (w.w || 2));
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

      const widgetBodyHtml = renderWidgetBody(w);
      node.innerHTML = `
        ${overlayHtml}
        <div class="widget__body">${widgetBodyHtml}</div>
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
      const id = btn.getAttribute("data-widget-id");
      const widget = findWidget(id);
      if (!widget) return;
      if (widget.data.mode === "url") {
        if (!widget.data.url) return toast("Add a URL in Edit mode.");
        window.open(widget.data.url, "_blank", "noopener,noreferrer");
        return;
      }
      if (widget.data.mode === "page") {
        const pageId = widget.data.pageId || state.pages[0]?.id;
        if (!pageId) return;
        state.activePageId = pageId;
        render();
        return;
      }
    });
  });

  els.widgets.querySelectorAll("[data-action='calc-btn']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-widget-id");
      const value = btn.getAttribute("data-value");
      onCalcInput(id, value);
    });
  });

  els.widgets.querySelectorAll(".notify").forEach((notifyEl) => {
    const selectAll = notifyEl.querySelector("[data-role='select-all']");
    const userBoxes = Array.from(notifyEl.querySelectorAll("[data-role='user']"));
    const closeBtn = notifyEl.querySelector(".notify__close");
    const dropdown = notifyEl.querySelector(".notify__dropdown");
    const sendBtn = notifyEl.querySelector(".notify__send");
    const input = notifyEl.querySelector(".notify__input");
    if (!selectAll || userBoxes.length === 0) return;

    const syncSelectAll = () => {
      selectAll.checked = userBoxes.every((box) => box.checked);
    };

    selectAll.addEventListener("change", () => {
      const checked = selectAll.checked;
      userBoxes.forEach((box) => {
        box.checked = checked;
      });
    });

    userBoxes.forEach((box) => {
      box.addEventListener("change", syncSelectAll);
    });

    notifyEl.querySelectorAll(".notify__close").forEach((btn) => {
      btn.addEventListener("click", () => {
        dropdown?.removeAttribute("open");
      });
    });

    sendBtn?.addEventListener("click", () => {
      const text = input?.value.trim();
      if (!text) return toast("Enter a notice to send.");
      const ok = confirm("Send this notice?");
      if (!ok) return;
      const widgetId = notifyEl.closest("[data-widget-id]")?.getAttribute("data-widget-id");
      const widget = widgetId ? findWidget(widgetId) : null;
      if (widget?.data) {
        widget.data.currentText = text;
      }
      if (input) {
        input.value = "";
        input.placeholder = text;
      }
      toast("Notice sent.");
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

  els.widgets.querySelectorAll("[data-action='poll-vote']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-widget-id");
      const optionId = btn.getAttribute("data-option-id");
      const widget = findWidget(id);
      if (!widget) return;
      const option = widget.data?.options?.find((o) => o.id === optionId);
      if (!option) return;
      option.votes = (option.votes || 0) + 1;
      renderWidgets();
    });
  });

  els.widgets.querySelectorAll("[data-action='yoursay-submit']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-widget-id");
      const widget = findWidget(id);
      if (!widget) return;
      const input = btn.parentElement?.querySelector(".yoursay__input");
      const text = input?.value.trim();
      if (!text) return;
      if (!widget.data.responses) widget.data.responses = [];
      widget.data.responses.push({
        id: rid("resp"),
        author: "You",
        text,
        time: "Just now",
      });
      if (input) input.value = "";
      renderWidgets();
    });
  });

  els.widgets.querySelectorAll(".yoursay__input").forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const widgetId = input.closest(".yoursay")?.getAttribute("data-widget-id");
        if (!widgetId) return;
        const widget = findWidget(widgetId);
        if (!widget) return;
        const text = input.value.trim();
        if (!text) return;
        if (!widget.data.responses) widget.data.responses = [];
        widget.data.responses.push({
          id: rid("resp"),
          author: "You",
          text,
          time: "Just now",
        });
        input.value = "";
        renderWidgets();
      }
    });
  });
}

function renderHomeLayout(page) {
  const profile = page.widgets.find((w) => w.type === "profile") || seedHomeProfile(page);
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

  const addBox = document.createElement("div");
  addBox.className = "add-widget";
  addBox.style.gridRow = "span 2";
  addBox.innerHTML = `<div><b>Add widget</b><br/>Drop a widget here in Edit mode.</div>`;
  profileCol.appendChild(addBox);

  els.widgets.appendChild(wrap);
}

function renderTile(w, opts = {}) {
  const node = document.createElement("article");
  const hiddenClass = w.type === "hide" ? "widget-tile--hidden" : "";
  node.className = `widget-tile widget-tile--${w.type} ${hiddenClass} ${w.type === "profile" ? "widget--profile" : ""}`;
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

  const widgetBodyHtml = renderWidgetBody(w);
  node.innerHTML = `
    ${state.editMode && !["profile", "add"].includes(w.type) ? `<div class="widget__overlay">
      <button class="widget__overlay-btn" data-action="edit-widget" data-widget-id="${escapeAttr(w.id)}" title="Edit">✏️</button>
    </div>` : ""}
    <div class="widget-tile__body">${widgetBodyHtml}</div>
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
  // Ensure we're rendering based on the current widget type
  const widgetType = w.type || "hide";
  
  if (widgetType === "hide") {
    return "";
  }
  if (widgetType === "pdf") {
    const tpl = w.data?.template || "cms-news";
    const src = tpl === "pdf-upload" && w.data?.uploadedSrc
      ? w.data.uploadedSrc
      : (tpl === "cms-news" ? "./new.pdf" : (w.data?.uploadedSrc || ""));
    if (tpl === "pdf-upload" && !w.data?.uploadedSrc) {
      return `
        <div class="pdf-viewer pdf-viewer--placeholder">
          <div class="pdf-viewer__placeholder">Upload a PDF in Edit mode</div>
        </div>
      `;
    }
    return `
      <div class="pdf-viewer">
        <iframe class="pdf-viewer__iframe" src="${escapeAttr(src)}" type="application/pdf"></iframe>
      </div>
    `;
  }
  if (widgetType === "news") {
    return `
      <div class="news">
        <iframe class="news__viewer" src="./new.pdf" type="application/pdf"></iframe>
      </div>
    `;
  }
  if (widgetType === "banner") {
    const template = w.data?.template || "notify";
    if (template === "events") {
      return `
        <div class="news events">
          <div class="events__title">Events</div>
          <div class="events__list">
            ${(w.data?.events || [])
              .map(
                (item) => `
            <div class="events__item">
              <div class="events__date">${escapeHtml(item.date)}</div>
              <div class="events__content">
                <div class="events__name">${escapeHtml(item.title)}</div>
                <div class="events__meta">${escapeHtml(item.meta)}</div>
              </div>
            </div>
          `
              )
              .join("")}
          </div>
        </div>
      `;
    }
    return `
      <div class="news notify notify--banner" data-widget-id="${escapeAttr(w.id)}">
        <div class="notify__header">
          <span class="news__title">${escapeHtml(w.data.title || "Notice")}</span>
          <span class="notify__hint">Notices will be sent to all users' desktop and mobile apps as a notification.</span>
        </div>
        <div class="notify__row">
          <input class="notify__input" type="text" placeholder="${escapeHtml(w.data.currentText || "Type a notice...")}" />
          <details class="notify__dropdown">
            <summary class="notify__dropdown-label">Send to</summary>
            <div class="notify__options">
              <button class="notify__close notify__close--top" type="button">Done</button>
              <label class="notify__option">
                <input type="checkbox" data-role="select-all" />
                <span>Select all</span>
              </label>
              <label class="notify__option">
                <input type="checkbox" data-role="user" />
                <span>Avery Parker</span>
              </label>
              <label class="notify__option">
                <input type="checkbox" data-role="user" />
                <span>Jordan Lee</span>
              </label>
              <label class="notify__option">
                <input type="checkbox" data-role="user" />
                <span>Priya Shah</span>
              </label>
              <label class="notify__option">
                <input type="checkbox" data-role="user" />
                <span>Miguel Santos</span>
              </label>
              <button class="notify__close" type="button">Done</button>
            </div>
          </details>
          <button class="notify__send" type="button">Send</button>
        </div>
      </div>
    `;
  }
  if (widgetType === "notice") {
    return `
      <div class="notify notify--medium" data-widget-id="${escapeAttr(w.id)}">
        <div class="notify__header">
          <span class="notify__title">${escapeHtml(w.data?.title || "Notice")}</span>
          <span class="notify__hint">Notices will be sent to all users' desktop and mobile apps as a notification.</span>
        </div>
        <textarea class="notify__input notify__input--area" rows="3" placeholder="${escapeHtml(w.data?.currentText || "Type a notice...")}"></textarea>
        <div class="notify__actions">
          <details class="notify__dropdown">
            <summary class="notify__dropdown-label">Send to</summary>
            <div class="notify__options">
              <button class="notify__close notify__close--top" type="button">Done</button>
              <label class="notify__option">
                <input type="checkbox" data-role="select-all" />
                <span>Select all</span>
              </label>
              <label class="notify__option">
                <input type="checkbox" data-role="user" />
                <span>Avery Parker</span>
              </label>
              <label class="notify__option">
                <input type="checkbox" data-role="user" />
                <span>Jordan Lee</span>
              </label>
              <label class="notify__option">
                <input type="checkbox" data-role="user" />
                <span>Priya Shah</span>
              </label>
              <label class="notify__option">
                <input type="checkbox" data-role="user" />
                <span>Miguel Santos</span>
              </label>
              <button class="notify__close" type="button">Done</button>
            </div>
          </details>
          <button class="notify__send" type="button">Send</button>
        </div>
      </div>
    `;
  }
  if (widgetType === "message") {
    return `
      <div class="message">
        <div class="message__header">${escapeHtml(w.data?.header || "Message")}</div>
        <div class="message__content">
          ${w.data?.imageUrl ? `<img class="message__image" src="${escapeAttr(w.data.imageUrl)}" alt="" />` : ""}
          <div class="message__text">${escapeHtml(w.data?.text || "")}</div>
        </div>
      </div>
    `;
  }
  if (widgetType === "poll") {
    const totalVotes = (w.data?.options || []).reduce((sum, opt) => sum + (opt.votes || 0), 0);
    return `
      <div class="poll" data-widget-id="${escapeAttr(w.id)}">
        <div class="poll__question">${escapeHtml(w.data?.question || "Poll question")}</div>
        <div class="poll__options">
          ${(w.data?.options || [])
            .map(
              (opt) => {
                const pct = totalVotes > 0 ? Math.round((opt.votes || 0) / totalVotes * 100) : 0;
                return `
              <div class="poll__option">
                <button class="poll__vote-btn" data-action="poll-vote" data-widget-id="${escapeAttr(w.id)}" data-option-id="${escapeAttr(opt.id)}">
                  ${escapeHtml(opt.text || "Option")}
                </button>
                <div class="poll__results">
                  <div class="poll__bar">
                    <div class="poll__bar-fill" style="width: ${pct}%"></div>
                  </div>
                  <div class="poll__percentage">${pct}%</div>
                </div>
              </div>
            `;
              }
            )
            .join("")}
        </div>
      </div>
    `;
  }
  if (widgetType === "yoursay") {
    return `
      <div class="yoursay" data-widget-id="${escapeAttr(w.id)}">
        <div class="yoursay__question">${escapeHtml(w.data?.question || "What are your thoughts?")}</div>
        <div class="yoursay__input-area">
          <textarea class="yoursay__input" placeholder="Add your comment..." rows="2"></textarea>
          <button class="yoursay__submit" data-action="yoursay-submit" data-widget-id="${escapeAttr(w.id)}">Submit</button>
        </div>
        <div class="yoursay__responses">
          ${(w.data?.responses || [])
            .map(
              (resp) => `
            <div class="yoursay__response">
              <div class="yoursay__response-author">${escapeHtml(resp.author || "Anonymous")}</div>
              <div class="yoursay__response-text">${escapeHtml(resp.text || "")}</div>
              <div class="yoursay__response-time">${escapeHtml(resp.time || "Just now")}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }
  if (widgetType === "birthday") {
    const today = new Date();
    const todayStr = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const employees = w.data?.employees || [];
    const birthdayToday = employees.filter((emp) => (emp.birthDate || "") === todayStr);
    return `
      <div class="birthday">
        <div class="birthday__title">Birthday Shouts</div>
        <div class="birthday__subtitle">Happy birthday to our colleagues celebrating today!</div>
        <div class="birthday__list">
          ${birthdayToday.length === 0
            ? `<div class="birthday__empty">No birthdays today. Check back tomorrow!</div>`
            : birthdayToday
                .map(
                  (emp) => `
            <div class="birthday__card">
              <div class="birthday__icon">🎂</div>
              <div class="birthday__name">${escapeHtml(emp.name || "Colleague")}</div>
              ${emp.role ? `<div class="birthday__role">${escapeHtml(emp.role)}</div>` : ""}
              <div class="birthday__wish">Happy Birthday!</div>
            </div>
          `
                )
                .join("")}
        </div>
      </div>
    `;
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
    return `<div class="centered">
      <img src="https://cmsdesk-storage.b-cdn.net/client/none/1757088833.8158.png" alt="Add widget" style="width:100%; height:100%; object-fit:contain; object-position:top center; display:block; border-radius:1px;" />
    </div>`;
  }
  if (w.type === "button") {
    const imageHtml = w.data?.imageUrl
      ? `<img class="button-widget__image" src="${escapeAttr(w.data.imageUrl)}" alt="" />`
      : `<div class="button-widget__label">${escapeHtml(w.data.label || "Open")}</div>`;
    return `
      <div class="centered">
        <div class="button-widget" data-action="open-button" data-widget-id="${escapeAttr(w.id)}">
          <div class="button-widget__btn">
            ${imageHtml}
          </div>
        </div>
      </div>
    `;
  }
  if (w.type === "profile") {
    return `
      <div class="profile">
        <div class="profile__header">
          <div class="profile__avatar">${escapeHtml(initials(w.data.name))}</div>
          <div>
            <div class="profile__name">${escapeHtml(w.data.name)}</div>
            <div class="profile__role">${escapeHtml(w.data.role)}</div>
          </div>
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
      { col: 1, row: 1, w: 4, h: 1 },
      { col: 1, row: 2, w: 1, h: 1 },
      { col: 1, row: 3, w: 1, h: 1 },
      { col: 1, row: 4, w: 2, h: 4 },
      { col: 2, row: 2, w: 1, h: 1 },
      { col: 2, row: 3, w: 1, h: 1 },
      { col: 3, row: 2, w: 2, h: 2 },
      { col: 3, row: 4, w: 2, h: 4 },
      { col: 5, row: 1, w: 4, h: 7, accent: true },
 
    ];
  }
  if (id === "tpl-bmbt") {
    return [
      { col: 1, row: 1, w: 1, h: 1 },
      { col: 2, row: 1, w: 1, h: 1 },
      { col: 3, row: 1, w: 1, h: 1 },
      { col: 4, row: 1, w: 1, h: 1 },
      { col: 1, row: 2, w: 4, h: 1 },
      { col: 1, row: 3, w: 2, h: 2 },
      { col: 3, row: 3, w: 2, h: 2 },
      { col: 1, row: 5, w: 2, h: 4 },
      { col: 3, row: 5, w: 2, h: 4 },

      { col: 5, row: 1, w: 1, h: 1 },
      { col: 6, row: 1, w: 1, h: 1 },
      { col: 7, row: 1, w: 1, h: 1 },
      { col: 8, row: 1, w: 1, h: 1 },
      { col: 5, row: 2, w: 4, h: 1 },
      { col: 5, row: 3, w: 2, h: 2 },
      { col: 7, row: 3, w: 2, h: 2 },
      { col: 5, row: 5, w: 2, h: 4 },
      { col: 7, row: 5, w: 2, h: 4 },
    ];
  }
  if (id === "tpl-big-boy") {
    return [
      { col: 1, row: 1, w: 2, h: 2 },
      { col: 3, row: 1, w: 2, h: 2 },
      { col: 5, row: 1, w: 2, h: 2 },
      { col: 7, row: 1, w: 2, h: 2 },
      { col: 1, row: 3, w: 2, h: 2 },
      { col: 3, row: 3, w: 2, h: 2 },
      { col: 5, row: 3, w: 1, h: 1 },
      { col: 6, row: 3, w: 1, h: 1 },
      { col: 7, row: 3, w: 1, h: 1 },
      { col: 8, row: 3, w: 1, h: 1 },
      { col: 5, row: 4, w: 4, h: 1 },
      { col: 1, row: 5, w: 4, h: 4, accent: true },
      { col: 5, row: 5, w: 4, h: 4, accent: true },
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
  const formFields = document.createElement("div");
  formFields.id = "widgetFormFields";
  body.appendChild(formFields);

  const renderFormFields = () => {
    // Clear all existing form fields completely
    while (formFields.firstChild) {
      formFields.removeChild(formFields.firstChild);
    }
    formFields.innerHTML = "";
    
    if (widget.type === "banner") {
      const row = document.createElement("div");
      row.innerHTML = `
        <div class="label">Banner template</div>
        <select id="bannerTemplate">
          <option value="notify">Notify</option>
          <option value="events">Events</option>
        </select>
      `;
      formFields.appendChild(row);
      formFields.querySelector("#bannerTemplate").value = widget.data.template || "notify";
      return;
    }
    if (widget.type === "message") {
      const row = document.createElement("div");
      row.innerHTML = `
        <div>
          <div class="label">Header</div>
          <input type="text" id="msgHeader" />
        </div>
        <div>
          <div class="label">Text body</div>
          <textarea id="msgText" rows="4"></textarea>
        </div>
        <div>
          <div class="label">Image URL (optional)</div>
          <input type="text" id="msgImage" placeholder="https://example.com/image.jpg" />
        </div>
      `;
      formFields.appendChild(row);
      formFields.querySelector("#msgHeader").value = widget.data.header || "";
      formFields.querySelector("#msgText").value = widget.data.text || "";
      formFields.querySelector("#msgImage").value = widget.data.imageUrl || "";
      return;
    }
    if (widget.type === "poll") {
      // Determine widget size to limit options
      const bucket = sizeBucket(widget);
      const maxOptions = bucket === "tall" ? 6 : 3;
      
      const row = document.createElement("div");
      row.innerHTML = `
        <div>
          <div class="label">Question</div>
          <input type="text" id="pollQuestion" />
        </div>
        <div>
          <div class="label">Options</div>
          <div id="pollOptionsContainer" style="display: grid; gap: 8px;"></div>
        </div>
      `;
      formFields.appendChild(row);
      
      const questionInput = formFields.querySelector("#pollQuestion");
      questionInput.value = widget.data.question || "";
      
      const optionsContainer = formFields.querySelector("#pollOptionsContainer");
      const existingOptions = widget.data.options || [];
      
      // Create individual input fields for each option
      for (let i = 0; i < maxOptions; i++) {
        const optionDiv = document.createElement("div");
        optionDiv.innerHTML = `
          <input type="text" id="pollOption${i}" placeholder="Option ${i + 1}" />
        `;
        optionsContainer.appendChild(optionDiv);
        
        const input = optionDiv.querySelector(`#pollOption${i}`);
        if (existingOptions[i]) {
          input.value = existingOptions[i].text || "";
        }
      }
      
      return;
    }
    if (widget.type === "yoursay") {
      const row = document.createElement("div");
      row.innerHTML = `
        <div>
          <div class="label">Question</div>
          <input type="text" id="yoursayQuestion" />
        </div>
      `;
      formFields.appendChild(row);
      formFields.querySelector("#yoursayQuestion").value = widget.data.question || "";
      return;
    }
    if (widget.type === "notice") {
      const row = document.createElement("div");
      row.innerHTML = `
        <div>
          <div class="label">Title</div>
          <input type="text" id="noticeTitle" />
        </div>
      `;
      formFields.appendChild(row);
      formFields.querySelector("#noticeTitle").value = widget.data?.title || "Notice";
      return;
    }
    if (widget.type === "note" || widget.type === "quicknote") {
      const row = document.createElement("div");
      row.innerHTML = `
        <div class="label">Note text</div>
        <textarea id="noteText"></textarea>
      `;
      formFields.appendChild(row);
      formFields.querySelector("#noteText").value = widget.data.text || "";
      return;
    }
    if (widget.type === "button") {
      const pageOptions = [...state.pages]
        .sort((a, b) => {
          if (a.id === "overview") return -1;
          if (b.id === "overview") return 1;
          return a.name.localeCompare(b.name);
        })
        .map((p) => `<option value="${escapeAttr(p.id)}">${escapeHtml(p.name)}</option>`)
        .join("");
      const row = document.createElement("div");
      row.innerHTML = `
        <div>
          <div class="label">Button label</div>
          <input type="text" id="btnLabel" />
        </div>
        <div>
          <div class="label">Button image URL (optional)</div>
          <input type="text" id="btnImage" placeholder="https://example.com/logo.png" />
        </div>
        <div>
          <div class="label">Action type</div>
          <select id="btnMode">
            <option value="page">Page</option>
            <option value="url">External URL</option>
          </select>
        </div>
        <div id="btnPageRow">
          <div class="label">Page</div>
          <select id="btnPage">
            ${pageOptions}
          </select>
        </div>
        <div id="btnUrlRow">
          <div class="label">URL</div>
          <input type="text" id="btnUrl" placeholder="https://example.com" />
        </div>
      `;
      formFields.appendChild(row);
      formFields.querySelector("#btnLabel").value = widget.data.label || "Open";
      formFields.querySelector("#btnImage").value = widget.data.imageUrl || "";
      formFields.querySelector("#btnMode").value = widget.data.mode || "page";
      formFields.querySelector("#btnUrl").value = widget.data.url || "";
      formFields.querySelector("#btnPage").value = widget.data.pageId || state.pages[0]?.id || "overview";
      const sync = () => {
        const mode = formFields.querySelector("#btnMode").value;
        formFields.querySelector("#btnPageRow").style.display = mode === "page" ? "" : "none";
        formFields.querySelector("#btnUrlRow").style.display = mode === "url" ? "" : "none";
      };
      formFields.querySelector("#btnMode").addEventListener("change", sync);
      sync();
      return;
    }
    if (widget.type === "todo") {
      const row = document.createElement("div");
      row.innerHTML = `
        <div class="label">Todo items (one per line)</div>
        <textarea id="todoLines"></textarea>
      `;
      formFields.appendChild(row);
      formFields.querySelector("#todoLines").value = (widget.data.items || []).map((i) => i.text).join("\n");
      return;
    }
    if (widget.type === "map") {
      const row = document.createElement("div");
      row.innerHTML = `
        <div class="label">Map label</div>
        <input type="text" id="mapTitle" />
      `;
      formFields.appendChild(row);
      formFields.querySelector("#mapTitle").value = widget.data.title || "Vehicle tracker";
      return;
    }
    if (widget.type === "pdf") {
      const row = document.createElement("div");
      row.innerHTML = `
        <div>
          <div class="label">PDF template</div>
          <select id="pdfTemplate">
            <option value="cms-news">CMS News</option>
            <option value="pdf-upload">PDF upload</option>
          </select>
        </div>
        <div id="pdfUploadRow" style="display: none;">
          <div class="label">Upload PDF</div>
          <input type="file" id="pdfFile" accept="application/pdf" />
          <span id="pdfFileLabel" class="pdf-upload__hint"></span>
        </div>
      `;
      formFields.appendChild(row);
      formFields.querySelector("#pdfTemplate").value = widget.data.template || "cms-news";

      const pdfTemplate = formFields.querySelector("#pdfTemplate");
      const pdfUploadRow = formFields.querySelector("#pdfUploadRow");
      const pdfFile = formFields.querySelector("#pdfFile");
      const pdfFileLabel = formFields.querySelector("#pdfFileLabel");

      const syncPdfUpload = () => {
        const isUpload = pdfTemplate.value === "pdf-upload";
        pdfUploadRow.style.display = isUpload ? "block" : "none";
        if (isUpload && widget.data?.uploadedSrc) pdfFileLabel.textContent = "PDF loaded";
        else if (!isUpload) pdfFileLabel.textContent = "";
        else pdfFileLabel.textContent = "No file chosen";
      };
      syncPdfUpload();
      pdfTemplate.addEventListener("change", () => {
        widget.data.template = pdfTemplate.value;
        syncPdfUpload();
      });

      pdfFile.addEventListener("change", () => {
        const file = pdfFile.files?.[0];
        if (file && file.type === "application/pdf") {
          const r = new FileReader();
          r.onload = () => {
            widget.data.uploadedSrc = r.result;
            pdfFileLabel.textContent = file.name || "PDF loaded";
          };
          r.readAsDataURL(file);
        } else {
          widget.data.uploadedSrc = "";
          pdfFileLabel.textContent = "No file chosen";
        }
      });
      if (widget.data?.uploadedSrc) pdfFileLabel.textContent = "PDF loaded";
      return;
    }
  };

  const saveForm = () => {
    if (widget.type === "banner") {
      widget.data.template = formFields.querySelector("#bannerTemplate")?.value || "notify";
    } else if (widget.type === "message") {
      widget.data.header = formFields.querySelector("#msgHeader")?.value.trim() || "";
      widget.data.text = formFields.querySelector("#msgText")?.value.trim() || "";
      widget.data.imageUrl = formFields.querySelector("#msgImage")?.value.trim() || "";
    } else if (widget.type === "poll") {
      const question = formFields.querySelector("#pollQuestion")?.value.trim() || "";
      widget.data.question = question || "Poll question";
      
      // Determine widget size to get max options
      const bucket = sizeBucket(widget);
      const maxOptions = bucket === "tall" ? 6 : 3;
      
      // Read options from individual input fields
      const options = [];
      for (let i = 0; i < maxOptions; i++) {
        const input = formFields.querySelector(`#pollOption${i}`);
        const text = input?.value.trim() || "";
        if (text) {
          options.push(text);
        }
      }
      
      // Preserve existing votes
      const existingVotes = {};
      (widget.data.options || []).forEach((opt) => {
        existingVotes[opt.text] = opt.votes || 0;
      });
      
      widget.data.options = options.map((text) => ({
        id: rid("opt"),
        text,
        votes: existingVotes[text] || 0,
      }));
    } else if (widget.type === "yoursay") {
      widget.data.question = formFields.querySelector("#yoursayQuestion")?.value.trim() || "What are your thoughts?";
    } else if (widget.type === "notice") {
      widget.data.title = formFields.querySelector("#noticeTitle")?.value.trim() || "Notice";
    } else if (widget.type === "note" || widget.type === "quicknote") {
      widget.data.text = formFields.querySelector("#noteText")?.value.trim() || "";
    } else if (widget.type === "button") {
      widget.data.label = formFields.querySelector("#btnLabel")?.value.trim() || "Open";
      widget.data.imageUrl = formFields.querySelector("#btnImage")?.value.trim() || "";
      widget.data.mode = formFields.querySelector("#btnMode")?.value || "page";
      widget.data.url = formFields.querySelector("#btnUrl")?.value.trim() || "";
      widget.data.pageId = formFields.querySelector("#btnPage")?.value || state.pages[0]?.id || "overview";
    } else if (widget.type === "todo") {
      const lines = (formFields.querySelector("#todoLines")?.value || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      widget.data.items = lines.map((text) => ({ id: rid("t"), text, done: false }));
    } else if (widget.type === "map") {
      widget.data.title = formFields.querySelector("#mapTitle")?.value.trim() || "Vehicle tracker";
    } else if (widget.type === "pdf") {
      widget.data.template = formFields.querySelector("#pdfTemplate")?.value || "cms-news";
      // uploadedSrc is already set by the file input's change handler
    }
    closeModal();
    renderWidgets();
  };

  const typeSelect = typeRow.querySelector("#widgetTypeSelect");
  if (widget.type === "banner") {
    typeSelect.innerHTML = `
      <option value="notify">Notify</option>
      <option value="events">Events</option>
    `;
    typeSelect.value = widget.data.template || "notify";
    typeSelect.addEventListener("change", () => {
      widget.data.template = typeSelect.value;
      renderFormFields();
    });
  } else {
    typeSelect.addEventListener("change", () => {
      const nextType = typeSelect.value;
      // Update widget type immediately
      widget.type = nextType;
      widget.title = WIDGET_CATALOG[nextType]?.label || "Widget";
      // Reset data when switching types to ensure clean state
      widget.data = seedData(nextType);
      renderFormFields();
      // Use setTimeout to ensure widget state is fully updated before re-rendering
      setTimeout(() => {
        // Completely re-render all widgets to ensure clean replacement
        renderWidgets();
      }, 0);
    });
  }

  renderFormFields();
  const save = button("Save", "btn btn--primary", saveForm);
  const cancel = button("Cancel", "btn", closeModal);
  openModal(`Edit: ${widget.title}`, body, [cancel, save]);
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
    tiny: ["button", "quicknote", "banner", "hide"],
    small: ["button", "quicknote", "todo", "hide"],
    medium: ["poll", "message", "yoursay", "notice", "hide"],
    large: ["pdf", "birthday", "hide"],
    tall: ["poll", "message", "yoursay", "birthday", "hide"],
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
    if (w.type === "banner") return "Banner";
    if (w.type === "profile") return "Profile";
    if (w.type === "add") return "Add";
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

