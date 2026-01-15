// Demo Construction intranet editor (static, drop-in)
// State is stored in localStorage so this can run without a backend.

const STORAGE_KEY = "dc_intranet_v1";

/** @typedef {"header"|"news"|"notifications"|"documents"|"discussions"|"polls"|"events"|"button"|"image"|"text"} WidgetType */

const GRID = 24;
const CANVAS_PAD = 16;

const WIDGET_DEFS = /** @type {Record<WidgetType, {title: string, gw: number, gh: number, badge: string, fixed?: boolean}>} */ ({
  header: { title: "Company Header", gw: 36, gh: 6, badge: "Header", fixed: true },
  news: { title: "Company News", gw: 18, gh: 14, badge: "News" },
  notifications: { title: "Notifications", gw: 18, gh: 10, badge: "Comms" },
  documents: { title: "Documents", gw: 18, gh: 11, badge: "Docs" },
  discussions: { title: "Discussions", gw: 22, gh: 14, badge: "Board" },
  polls: { title: "Poll", gw: 15, gh: 11, badge: "Vote" },
  events: { title: "Events", gw: 22, gh: 15, badge: "Calendar" },
  button: { title: "Button", gw: 12, gh: 4, badge: "Link" },
  image: { title: "Image", gw: 18, gh: 10, badge: "Image" },
  text: { title: "Text", gw: 15, gh: 8, badge: "Text" },
});

const DEMO = {
  company: { name: "Demo Construction" },
  users: [
    { id: "u_hr", name: "Hannah Reed", role: "HR", canEdit: true },
    { id: "u_pm", name: "Paul Mason", role: "Project Manager", canEdit: false },
    { id: "u_site", name: "Sam Patel", role: "Site Supervisor", canEdit: false },
  ],
  projects: [
    { id: "p1", name: "Riverside Apartments", status: "On track", location: "Manchester" },
    { id: "p2", name: "Westgate Retail Fit-out", status: "At risk", location: "Leeds" },
    { id: "p3", name: "Eastbrook School Extension", status: "On track", location: "Sheffield" },
  ],
  documents: [
    { id: "d1", title: "HR Policy Handbook (2026)", folder: "HR", content: "Welcome to Demo Construction. This is a sample HR handbook for demo purposes." },
    { id: "d2", title: "Site Safety Checklist", folder: "Safety", content: "Sample checklist: PPE, permits, toolbox talk, equipment inspection." },
    { id: "d3", title: "Project Kickoff Pack", folder: "Projects", content: "Sample pack: kickoff agenda, RACI, comms plan, milestones." },
  ],
};

/**
 * @typedef {{
 *  id: string,
 *  type: WidgetType,
 *  gx: number, gy: number,
 *  gw: number, gh: number,
 *  data: any
 * }} Widget
 *
 * @typedef {{
 *  id: string,
 *  name: string,
 *  widgets: Widget[]
 * }} Page
 *
 * @typedef {{
 *  companyName: string,
 *  currentUserId: string,
 *  editMode: boolean,
 *  selectedWidgetId: string | null,
 *  activePageId: string,
 *  pages: Page[]
 * }} AppState
 */

const $ = (sel) => /** @type {HTMLElement} */ (document.querySelector(sel));
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const els = {
  toggleEditBtn: $("#toggleEditBtn"),
  canvas: $("#canvas"),
  toolbox: $("#toolbox"),
  toolboxHandle: $("#toolboxHandle"),
  addPageBtn: $("#addPageBtn"),
  cleanupBtn: $("#cleanupBtn"),
  pagesList: $("#pagesList"),
  modal: $("#modal"),
  modalBackdrop: $("#modalBackdrop"),
  modalCloseBtn: $("#modalCloseBtn"),
  modalTitle: $("#modalTitle"),
  modalBody: $("#modalBody"),
  modalFooter: $("#modalFooter"),
  blankPageBtn: $("#blankPageBtn"),
};

/** @returns {AppState} */
function defaultState() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  /** @type {Page[]} */
  const pages = [
    {
      id: "home",
      name: "Home",
      widgets: [
        {
          id: rid("w"),
          type: "header",
          gx: 0,
          gy: 0,
          gw: WIDGET_DEFS.header.gw,
          gh: WIDGET_DEFS.header.gh,
          data: {
            companyName: DEMO.company.name,
            subtitle: "Intranet",
            details: "Safety • Quality • Delivery",
            logoText: "DC",
            logoImageUrl: "demoicon.png",
          },
        },
        {
          id: rid("w"),
          type: "news",
          gx: 0,
          gy: 7,
          gw: WIDGET_DEFS.news.gw,
          gh: WIDGET_DEFS.news.gh,
          data: {
            posts: [
              {
                title: "Welcome to the new intranet",
                date: fmtDate(new Date()),
                body: "This is the default homepage template. HR can switch to Edit mode and drag widgets around.",
                imageUrl: "",
              },
              {
                title: "Riverside Apartments hits a milestone",
                date: fmtDate(new Date(Date.now() - 3 * 864e5)),
                body: "Phase 1 structural works are complete. Great work to everyone on site.",
                imageUrl: "",
              },
            ],
          },
        },
        {
          id: rid("w"),
          type: "notifications",
          gx: 19,
          gy: 7,
          gw: WIDGET_DEFS.notifications.gw,
          gh: WIDGET_DEFS.notifications.gh,
          data: {
            items: [
              { text: "Payroll cut-off is Friday 5pm.", date: fmtDate(new Date()) },
              { text: "New PPE supplier onboarding next week.", date: fmtDate(new Date(Date.now() - 864e5)) },
            ],
          },
        },
        {
          id: rid("w"),
          type: "documents",
          gx: 19,
          gy: 18,
          gw: WIDGET_DEFS.documents.gw,
          gh: WIDGET_DEFS.documents.gh,
          data: {
            links: DEMO.documents.slice(0, 3).map((d) => ({ docId: d.id })),
          },
        },
        {
          id: rid("w"),
          type: "events",
          gx: 0,
          gy: 22,
          gw: WIDGET_DEFS.events.gw,
          gh: WIDGET_DEFS.events.gh,
          data: {
            month,
            year,
            events: [
              { id: rid("e"), title: "Safety Stand-down", date: isoDate(addDays(new Date(), 4)) },
              { id: rid("e"), title: "HR Q&A Drop-in", date: isoDate(addDays(new Date(), 10)) },
            ],
          },
        },
        {
          id: rid("w"),
          type: "polls",
          gx: 23,
          gy: 30,
          gw: WIDGET_DEFS.polls.gw,
          gh: WIDGET_DEFS.polls.gh,
          data: {
            question: "Which training topic should we run next?",
            options: ["First aid refresher", "Fire marshal", "Manual handling", "Asbestos awareness"],
            votes: {}, // userId -> optionIndex
          },
        },
        {
          id: rid("w"),
          type: "text",
          gx: 0,
          gy: 38,
          gw: WIDGET_DEFS.text.gw,
          gh: WIDGET_DEFS.text.gh,
          data: {
            html: "<div><b>Tip:</b> This editor is intentionally simple. Start by adding widgets, then click a widget title to edit its content.</div>",
            fontSize: 13,
            color: "#1f2937",
          },
        },
      ],
    },
  ];

  return {
    companyName: DEMO.company.name,
    currentUserId: "u_hr",
    editMode: false,
    selectedWidgetId: null,
    activePageId: "home",
    pages,
  };
}

/** @type {AppState} */
let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** @returns {AppState} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = validateState(parsed) ? parsed : defaultState();
    return migrateState(base);
  } catch {
    return defaultState();
  }
}

/** @param {any} s */
function validateState(s) {
  return (
    s &&
    typeof s.companyName === "string" &&
    Array.isArray(s.pages) &&
    typeof s.activePageId === "string" &&
    typeof s.currentUserId === "string"
  );
}

function currentUser() {
  return DEMO.users.find((u) => u.id === state.currentUserId) ?? DEMO.users[0];
}

/** @returns {Page} */
function activePage() {
  const p = state.pages.find((p) => p.id === state.activePageId);
  return p ?? state.pages[0];
}

/** @param {Widget["id"]} id */
function findWidget(id) {
  for (const p of state.pages) {
    const w = p.widgets.find((x) => x.id === id);
    if (w) return w;
  }
  return null;
}

function init() {
  wireUI();
  render();
}

function wireUI() {
  els.toggleEditBtn.addEventListener("click", () => {
    const u = currentUser();
    if (!u.canEdit) {
      toast("You don't have edit permissions in this demo user.");
      return;
    }
    state.editMode = !state.editMode;
    state.selectedWidgetId = null;
    saveState();
    render();
  });

  els.modalBackdrop.addEventListener("click", closeModal);
  els.modalCloseBtn.addEventListener("click", closeModal);

  // click empty canvas -> clear selection
  els.canvas.addEventListener("pointerdown", (e) => {
    if (e.target === els.canvas) {
      state.selectedWidgetId = null;
      saveState();
      renderCanvas(); // fast re-render selection only
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();

    if (e.key === "Delete" && state.editMode && state.selectedWidgetId) {
      deleteWidget(state.selectedWidgetId);
    }
  });

  // Add widget buttons
  $$("[data-add-widget]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = /** @type {WidgetType} */ (btn.getAttribute("data-add-widget"));
      addWidget(type);
    });
  });

  els.addPageBtn?.addEventListener("click", () => openAddPageModal());
  els.cleanupBtn?.addEventListener("click", () => {
    if (!state.editMode) return;
    cleanupLayout(activePage());
    saveState();
    render();
  });

  // Blank page (currently only option that works)
  els.blankPageBtn.addEventListener("click", () => {
    if (!state.editMode) return;
    const page = activePage();
    // Keep fixed widgets (e.g., Company Header) so the page always has a title area.
    page.widgets = (page.widgets ?? []).filter((w) => WIDGET_DEFS[w.type]?.fixed);
    state.selectedWidgetId = null;
    saveState();
    render();
  });
}

function render() {
  els.toggleEditBtn.textContent = state.editMode ? "Done" : "Edit";

  document.body.classList.toggle("edit-mode", state.editMode);
  els.toolbox.classList.toggle("toolbox--hidden", !state.editMode);
  ensureToolboxPosition();
  $("#templatePageBtn").setAttribute("disabled", "true");

  renderPagesList();
  renderCanvas();
}

function renderPagesList() {
  if (!els.pagesList) return;
  els.pagesList.innerHTML = "";
  const pages = state.pages ?? [];

  for (const p of pages) {
    const row = document.createElement("div");
    row.className = `pagepill ${p.id === state.activePageId ? "pagepill--active" : ""}`;
    row.innerHTML = `
      <div class="pagepill__left">
        <span class="pagepill__dot" aria-hidden="true"></span>
        <span class="pagepill__name"></span>
      </div>
      <span class="pagepill__meta">${escapeHtml(String(p.widgets?.length ?? 0))}</span>
    `;
    row.querySelector(".pagepill__name").textContent = p.name;

    row.addEventListener("click", () => {
      state.activePageId = p.id;
      state.selectedWidgetId = null;
      saveState();
      render();
    });

    row.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (!state.editMode) return;
      openRenamePageModal(p.id);
    });

    els.pagesList.appendChild(row);
  }
}

function renderCanvas() {
  const page = activePage();
  els.canvas.innerHTML = "";
  updateCanvasHeight(page);

  for (const w of page.widgets) {
    const node = renderWidget(w);
    els.canvas.appendChild(node);
  }
}

/** @param {Widget} w */
function renderWidget(w) {
  const def = WIDGET_DEFS[w.type];
  const el = document.createElement("div");
  el.className = `widget ${state.selectedWidgetId === w.id ? "widget--selected" : ""}`;
  const px = gridToPx(w.gx, w.gy);
  el.style.left = `${px.x}px`;
  el.style.top = `${px.y}px`;
  el.style.width = `${w.gw * GRID}px`;
  el.style.height = `${w.gh * GRID}px`;
  el.setAttribute("data-widget-id", w.id);

  const body = document.createElement("div");
  body.className = "widget__body";
  body.appendChild(renderWidgetBody(w));

  // No title sections: just a small hover overlay for actions in edit mode.
  if (state.editMode) {
    const overlay = document.createElement("div");
    overlay.className = "widget__overlay";
    overlay.innerHTML = `
      <button class="iconbtn" data-act="edit" title="Edit" aria-label="Edit">✏️</button>
      ${!def.fixed ? `<button class="iconbtn iconbtn--danger" data-act="del" title="Delete" aria-label="Delete">🗑️</button>` : ""}
    `;
    overlay.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const act = btn.getAttribute("data-act");
        if (act === "edit") openWidgetEditor(w.id);
        if (act === "del") deleteWidget(w.id);
      });
    });
    el.appendChild(overlay);
  }

  el.appendChild(body);

  if (state.editMode && !def.fixed) {
    const rh = document.createElement("div");
    rh.className = "resize-handle";
    rh.title = "Resize";
    rh.textContent = "↘";
    rh.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      startResize(e, w.id);
    });
    el.appendChild(rh);
  }

  // Selection + drag from anywhere in the widget (full area), not just the header
  el.addEventListener("pointerdown", (e) => {
    const t = /** @type {HTMLElement} */ (e.target);
    if (t.closest("button, a, input, textarea, select, label, [data-no-drag='true']")) return;
    state.selectedWidgetId = w.id;
    saveState();
    renderCanvas();
    if (state.editMode && !def.fixed) startDrag(e, w.id);
  });

  return el;
}

/** @param {Widget} w */
function renderWidgetBody(w) {
  const wrap = document.createElement("div");

  if (w.type === "header") {
    const cn = w.data?.companyName ?? DEMO.company.name;
    const sub = w.data?.subtitle ?? "Intranet";
    const details = w.data?.details ?? "";
    const logoText = w.data?.logoText ?? "DC";
    const logoImageUrl = w.data?.logoImageUrl ?? "demoicon.png";
    wrap.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px">
        <div style="
          width:220px; height:64px; border-radius:18px;
          display:grid; place-items:center;
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(15,23,42,0.10);
          overflow:hidden;
        ">
          <img alt="" src="${escapeAttr(logoImageUrl)}"
            style="width:100%; height:100%; object-fit:contain; padding:6px; display:block"
            onerror="this.remove(); this.parentElement.textContent='${escapeAttr(logoText)}'; this.parentElement.style.background='linear-gradient(140deg, rgba(26,115,232,1), rgba(11,87,208,1))'; this.parentElement.style.color='white'; this.parentElement.style.fontWeight='900'; this.parentElement.style.letterSpacing='-0.6px';"
          />
        </div>
        <div style="display:flex; flex-direction:column; gap:4px">
          <div style="font-weight:900; font-size:18px; letter-spacing:-0.4px">${escapeHtml(cn)}</div>
          <div class="muted" style="font-size:13px">${escapeHtml(sub)}</div>
          <div class="muted" style="font-size:12px">${escapeHtml(details)}</div>
        </div>
      </div>
    `;
    return wrap;
  }

  if (w.type === "news") {
    const posts = w.data?.posts ?? [];
    wrap.innerHTML = `
      <div class="widget__list">
        ${posts
          .slice(0, 3)
          .map(
            (p) => `
              <div class="item">
                <div class="item__title">${escapeHtml(p.title)}</div>
                <div class="item__meta">${escapeHtml(p.date ?? "")}</div>
                <div>${escapeHtml(p.body ?? "")}</div>
                ${p.imageUrl ? `<img class="item__img" alt="" src="${escapeAttr(p.imageUrl)}">` : ""}
              </div>
            `
          )
          .join("")}
      </div>
    `;
    return wrap;
  }

  if (w.type === "notifications") {
    const items = w.data?.items ?? [];
    wrap.innerHTML = `
      <div class="widget__list">
        ${items
          .slice(0, 4)
          .map(
            (n) => `
              <div class="item">
                <div>${escapeHtml(n.text ?? "")}</div>
                <div class="item__meta">${escapeHtml(n.date ?? "")}</div>
              </div>
            `
          )
          .join("")}
      </div>
    `;
    return wrap;
  }

  if (w.type === "documents") {
    const links = w.data?.links ?? [];
    wrap.innerHTML = `
      <div class="widget__list">
        ${links
          .slice(0, 5)
          .map((l) => {
            const d = DEMO.documents.find((x) => x.id === l.docId);
            if (!d) return "";
            return `
              <button class="linkbtn" data-doc="${escapeAttr(d.id)}">
                <span class="linkbtn__left">
                  <span class="linkbtn__title">${escapeHtml(d.title)}</span>
                  <span class="linkbtn__sub">${escapeHtml(d.folder)}</span>
                </span>
                <span class="muted">Open</span>
              </button>
            `;
          })
          .join("")}
      </div>
    `;
    wrap.querySelectorAll("[data-doc]").forEach((b) => {
      b.addEventListener("click", () => openDocument(b.getAttribute("data-doc")));
    });
    return wrap;
  }

  if (w.type === "discussions") {
    const threads = w.data?.threads ?? [
      {
        id: "t1",
        title: "Welcome thread",
        posts: [{ user: "Hannah (HR)", text: "Say hi and share what you're working on!", date: fmtDate(new Date()) }],
      },
    ];
    wrap.innerHTML = `
      <div class="widget__list">
        ${threads
          .slice(0, 2)
          .map(
            (t) => `
              <div class="item">
                <div class="item__title">${escapeHtml(t.title)}</div>
                <div class="item__meta">${escapeHtml((t.posts?.[t.posts.length - 1]?.date) ?? "")}</div>
                <div class="muted">${escapeHtml((t.posts?.length ?? 0) + " replies")}</div>
              </div>
            `
          )
          .join("")}
      </div>
      <div class="muted" style="margin-top:10px">Open Edit to add threads/replies.</div>
    `;
    return wrap;
  }

  if (w.type === "polls") {
    const q = w.data?.question ?? "Poll";
    const options = w.data?.options ?? [];
    const votes = w.data?.votes ?? {};
    const u = currentUser();
    const picked = votes[u.id];

    const counts = options.map((_, idx) => Object.values(votes).filter((v) => v === idx).length);
    const total = counts.reduce((a, b) => a + b, 0) || 1;

    wrap.innerHTML = `
      <div>
        <div style="font-weight:750; margin-bottom:10px">${escapeHtml(q)}</div>
        <div class="widget__list">
          ${options
            .map((opt, idx) => {
              const pct = Math.round((counts[idx] / total) * 100);
              const chosen = picked === idx;
              return `
                <button class="linkbtn" data-vote="${idx}" style="justify-content:flex-start; gap:12px">
                  <span class="pill" style="min-width:64px; text-align:center">${pct}%</span>
                  <span style="font-weight:650">${escapeHtml(opt)}</span>
                  ${chosen ? `<span class="pill" style="margin-left:auto; border-color:rgba(76,175,80,0.4); background:rgba(76,175,80,0.10)">Your vote</span>` : ""}
                </button>
              `;
            })
            .join("")}
        </div>
        <div class="muted" style="margin-top:10px">${escapeHtml(String(Object.keys(votes).length))} responses</div>
      </div>
    `;

    wrap.querySelectorAll("[data-vote]").forEach((b) => {
      b.addEventListener("click", () => {
        const idx = Number(b.getAttribute("data-vote"));
        w.data.votes = w.data.votes ?? {};
        w.data.votes[u.id] = idx;
        saveState();
        renderCanvas();
      });
    });
    return wrap;
  }

  if (w.type === "events") {
    const month = w.data?.month ?? new Date().getMonth();
    const year = w.data?.year ?? new Date().getFullYear();
    const events = w.data?.events ?? [];
    const monthLabel = new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
    const days = buildMonthGrid(year, month);

    wrap.innerHTML = `
      <div class="pillrow">
        <span class="pill">${escapeHtml(monthLabel)}</span>
        <span class="pill">${escapeHtml(String(events.length))} events</span>
      </div>
      <div class="calendar" data-no-drag="true">
        ${days
          .map((d) => {
            const iso = isoDate(d.date);
            const has = events.some((e) => e.date === iso);
            return `
              <div class="calday" data-no-drag="true" data-date="${escapeAttr(iso)}" title="${escapeAttr(iso)}">
                <div class="calday__n">${d.inMonth ? d.day : ""}</div>
                ${has ? `<div class="calday__dot"></div>` : ""}
              </div>
            `;
          })
          .join("")}
      </div>
      <div class="muted" style="margin-top:10px">Open Edit to add events.</div>
    `;

    // Left-click event marker/day to see what it is
    wrap.querySelectorAll(".calday[data-date]").forEach((dayEl) => {
      dayEl.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const iso = dayEl.getAttribute("data-date");
        const list = events.filter((e) => e.date === iso);
        if (!list.length) return;
        openEventsListModal(iso, list);
      });
    });

    return wrap;
  }

  if (w.type === "button") {
    const mode = w.data?.mode ?? "text"; // "text" | "image"
    const label = w.data?.label ?? "Open";
    const img = w.data?.imageUrl ?? "";
    const linkType = w.data?.linkType ?? "url"; // "url" | "page"
    const url = w.data?.url ?? "";
    const pageId = w.data?.pageId ?? "home";

    const btn = document.createElement("div");
    btn.className = "item";
    btn.setAttribute("data-no-drag", "true");
    btn.style.height = "100%";
    btn.style.display = "grid";
    btn.style.placeItems = "center";
    btn.style.cursor = "pointer";
    btn.style.padding = "8px";

    if (mode === "image" && img) {
      btn.innerHTML = `<img alt="" src="${escapeAttr(img)}" style="width:100%; height:100%; object-fit:cover; border-radius:14px; border:1px solid rgba(15,23,42,0.10)">`;
    } else {
      btn.innerHTML = `<div style="font-weight:850; font-size:14px; padding: 8px 10px">${escapeHtml(label)}</div>`;
    }

    btn.addEventListener("click", () => {
      if (linkType === "url") {
        if (!url) return toast("No URL set.");
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      if (linkType === "page") {
        const p = state.pages.find((p) => p.id === pageId);
        if (!p) return toast("Page not found.");
        state.activePageId = p.id;
        state.selectedWidgetId = null;
        saveState();
        render();
        toast(`Opened page: ${p.name}`);
      }
    });

    wrap.appendChild(btn);
    return wrap;
  }

  if (w.type === "image") {
    const linkType = w.data?.linkType ?? "url"; // "url" | "page"
    const url = w.data?.url ?? "";
    const pageId = w.data?.pageId ?? "home";
    const img = w.data?.imageUrl ?? "";

    const tile = document.createElement("div");
    tile.className = "item";
    tile.setAttribute("data-no-drag", "true");
    tile.style.height = "100%";
    tile.style.padding = "0";
    tile.style.overflow = "hidden";
    tile.style.cursor = "pointer";

    if (img) {
      tile.innerHTML = `<img alt="" src="${escapeAttr(img)}" style="width:100%; height:100%; object-fit:cover; display:block">`;
    } else {
      tile.innerHTML = `<div class="muted" style="height:100%; display:grid; place-items:center">No image set (Edit ✏️)</div>`;
    }

    tile.addEventListener("click", () => {
      if (linkType === "url") {
        if (!url) return toast("No URL set.");
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      if (linkType === "page") {
        const p = state.pages.find((p) => p.id === pageId);
        if (!p) return toast("Page not found.");
        state.activePageId = p.id;
        state.selectedWidgetId = null;
        saveState();
        render();
        toast(`Opened page: ${p.name}`);
      }
    });

    wrap.appendChild(tile);
    return wrap;
  }

  if (w.type === "text") {
    const html = w.data?.html ?? "";
    const fontSize = w.data?.fontSize ?? 13;
    const color = w.data?.color ?? "#1f2937";
    wrap.className = "textblock";
    wrap.style.fontSize = `${fontSize}px`;
    wrap.style.color = color;
    wrap.innerHTML = html || `<span class="muted">Empty text box. Click Edit to add text.</span>`;
    return wrap;
  }

  wrap.textContent = "Unsupported widget.";
  return wrap;
}

/** @param {WidgetType} type */
function addWidget(type) {
  if (!state.editMode) return;
  const page = activePage();
  const def = WIDGET_DEFS[type];
  const id = rid("w");
  updateCanvasHeight(page);
  const base = nextFreeSpot(def.gw, def.gh);

  /** @type {Widget} */
  const w = {
    id,
    type,
    gx: base.gx,
    gy: base.gy,
    gw: def.gw,
    gh: def.gh,
    data: seedWidgetData(type),
  };
  page.widgets.push(w);
  state.selectedWidgetId = id;
  updateCanvasHeight(page);
  saveState();
  render();
}

/** @param {WidgetType} type */
function seedWidgetData(type) {
  if (type === "header")
    return {
      companyName: DEMO.company.name,
      subtitle: "Intranet",
      details: "Safety • Quality • Delivery",
      logoText: "DC",
      logoImageUrl: "demoicon.png",
    };
  if (type === "news") return { posts: [] };
  if (type === "notifications") return { items: [] };
  if (type === "documents") return { links: DEMO.documents.slice(0, 2).map((d) => ({ docId: d.id })) };
  if (type === "discussions") return { threads: [] };
  if (type === "polls") return { question: "New poll", options: ["Option 1", "Option 2"], votes: {} };
  if (type === "events") return { month: new Date().getMonth(), year: new Date().getFullYear(), events: [] };
  if (type === "button") return { mode: "text", label: "Open", linkType: "url", url: "", pageId: "home", imageUrl: "" };
  if (type === "image") return { linkType: "url", url: "", pageId: "home", imageUrl: "" };
  if (type === "text") return { html: "<div>New text</div>", fontSize: 14, color: "#1f2937" };
  return {};
}

/** @param {string} widgetId */
function deleteWidget(widgetId) {
  if (!state.editMode) return;
  const p = activePage();
  const w = p.widgets.find((x) => x.id === widgetId);
  if (w && WIDGET_DEFS[w.type]?.fixed) return;
  const before = p.widgets.length;
  p.widgets = p.widgets.filter((w) => w.id !== widgetId);
  if (p.widgets.length === before) return;
  if (state.selectedWidgetId === widgetId) state.selectedWidgetId = null;
  saveState();
  render();
}

// Dragging
const drag = {
  active: false,
  widgetId: "",
  startX: 0,
  startY: 0,
  origGX: 0,
  origGY: 0,
  pointerId: 0,
};

// Resizing
const resize = {
  active: false,
  widgetId: "",
  startX: 0,
  startY: 0,
  origGW: 0,
  origGH: 0,
  pointerId: 0,
};

/** @param {PointerEvent} e @param {string} widgetId */
function startDrag(e, widgetId) {
  const w = findWidget(widgetId);
  if (!w) return;

  drag.active = true;
  drag.widgetId = widgetId;
  drag.startX = e.clientX;
  drag.startY = e.clientY;
  drag.origGX = w.gx;
  drag.origGY = w.gy;
  drag.pointerId = e.pointerId;

  state.selectedWidgetId = widgetId;
  saveState();
  renderCanvas();

  els.canvas.setPointerCapture(e.pointerId);
  els.canvas.addEventListener("pointermove", onDragMove);
  els.canvas.addEventListener("pointerup", onDragEnd, { once: true });
  els.canvas.addEventListener("pointercancel", onDragEnd, { once: true });
}

/** @param {PointerEvent} e */
function onDragMove(e) {
  if (!drag.active) return;
  if (e.pointerId !== drag.pointerId) return;

  const w = findWidget(drag.widgetId);
  if (!w) return;
  const dx = e.clientX - drag.startX;
  const dy = e.clientY - drag.startY;

  // snap movement: widgets "click" into grid cells and never overlap
  const deltaGX = Math.round(dx / GRID);
  const deltaGY = Math.round(dy / GRID);
  const candGX = drag.origGX + deltaGX;
  const candGY = drag.origGY + deltaGY;

  const clamped = clampToCanvas(candGX, candGY, w.gw, w.gh);
  moveWithPush(w.id, clamped.gx, clamped.gy);
}

/** @param {PointerEvent} e */
function onDragEnd(e) {
  if (e.pointerId !== drag.pointerId) return;
  drag.active = false;
  els.canvas.releasePointerCapture(e.pointerId);
  els.canvas.removeEventListener("pointermove", onDragMove);
  saveState();
}

/** @param {PointerEvent} e @param {string} widgetId */
function startResize(e, widgetId) {
  const w = findWidget(widgetId);
  if (!w) return;
  updateCanvasHeight(activePage());

  resize.active = true;
  resize.widgetId = widgetId;
  resize.startX = e.clientX;
  resize.startY = e.clientY;
  resize.origGW = w.gw;
  resize.origGH = w.gh;
  resize.pointerId = e.pointerId;

  state.selectedWidgetId = widgetId;
  saveState();
  renderCanvas();

  els.canvas.setPointerCapture(e.pointerId);
  els.canvas.addEventListener("pointermove", onResizeMove);
  els.canvas.addEventListener("pointerup", onResizeEnd, { once: true });
  els.canvas.addEventListener("pointercancel", onResizeEnd, { once: true });
}

function onResizeMove(e) {
  if (!resize.active) return;
  if (e.pointerId !== resize.pointerId) return;
  const w = findWidget(resize.widgetId);
  if (!w) return;

  const dx = e.clientX - resize.startX;
  const dy = e.clientY - resize.startY;
  const dGW = Math.round(dx / GRID);
  const dGH = Math.round(dy / GRID);

  const { maxGX } = canvasGridBounds();
  const maxGW = Math.max(1, maxGX);

  const minGW = minSizeFor(w.type).gw;
  const minGH = minSizeFor(w.type).gh;

  const nextGW = clamp(resize.origGW + dGW, minGW, maxGW);
  const nextGH = clamp(resize.origGH + dGH, minGH, 9999);

  resizeWithPush(w.id, nextGW, nextGH);
}

function onResizeEnd(e) {
  if (e.pointerId !== resize.pointerId) return;
  resize.active = false;
  els.canvas.releasePointerCapture(e.pointerId);
  els.canvas.removeEventListener("pointermove", onResizeMove);
  updateCanvasHeight(activePage());
  saveState();
}

// Modals / editors
function openModal(title, bodyEl, footerButtons = []) {
  els.modalTitle.textContent = title;
  els.modalBody.innerHTML = "";
  els.modalBody.appendChild(bodyEl);
  els.modalFooter.innerHTML = "";
  for (const b of footerButtons) els.modalFooter.appendChild(b);
  els.modal.classList.remove("modal--hidden");
}

function openEventsListModal(isoDateStr, events) {
  const body = document.createElement("div");
  body.innerHTML = `
    <div class="pillrow" style="margin-bottom:10px">
      <span class="pill">${escapeHtml(isoDateStr)}</span>
      <span class="pill">${escapeHtml(String(events.length))} event(s)</span>
    </div>
    <div class="widget__list">
      ${events
        .map(
          (e) => `
          <div class="item">
            <div class="item__title">${escapeHtml(e.title ?? "Event")}</div>
            <div class="item__meta">${escapeHtml(e.date ?? isoDateStr)}</div>
          </div>
        `
        )
        .join("")}
    </div>
  `;
  const close = button("Close", "btn btn--primary", closeModal);
  openModal("Events", body, [close]);
}

function closeModal() {
  els.modal.classList.add("modal--hidden");
  els.modalTitle.textContent = "";
  els.modalBody.innerHTML = "";
  els.modalFooter.innerHTML = "";
}

/** @param {string} docId */
function openDocument(docId) {
  const d = DEMO.documents.find((x) => x.id === docId);
  if (!d) return;
  const body = document.createElement("div");
  body.innerHTML = `
    <div class="pillrow" style="margin-bottom:10px">
      <span class="pill">${escapeHtml(d.folder)}</span>
      <span class="pill">Sample doc</span>
    </div>
    <div style="font-weight:800; font-size:16px; margin-bottom:8px">${escapeHtml(d.title)}</div>
    <div class="muted">${escapeHtml(d.content)}</div>
  `;
  const close = button("Close", "btn btn--primary", closeModal);
  openModal("Document", body, [close]);
}

function openAddPageModal() {
  if (!state.editMode) {
    toast("Turn on Edit mode to add pages.");
    return;
  }
  const body = document.createElement("div");
  body.className = "form";
  body.innerHTML = `
    <div class="row">
      <div class="label">Page name</div>
      <input type="text" id="pageName" placeholder="e.g., HR Hub" />
    </div>
    <div class="muted">Pages are opened via the new Button widget (link type: Internal page).</div>
  `;
  const save = button("Create", "btn btn--primary", () => {
    const name = /** @type {HTMLInputElement} */ (body.querySelector("#pageName")).value.trim();
    if (!name) return toast("Enter a page name.");
    const id = rid("p");
    state.pages.push({ id, name, widgets: [] });
    state.activePageId = id;
    state.selectedWidgetId = null;
    saveState();
    closeModal();
    render();
  });
  const cancel = button("Cancel", "btn", closeModal);
  openModal("Add page", body, [cancel, save]);
  setTimeout(() => body.querySelector("#pageName")?.focus(), 0);
}

/** @param {string} pageId */
function openRenamePageModal(pageId) {
  const p = (state.pages ?? []).find((x) => x.id === pageId);
  if (!p) return;
  const body = document.createElement("div");
  body.className = "form";
  body.innerHTML = `
    <div class="row">
      <div class="label">Rename page</div>
      <input type="text" id="pageName" />
    </div>
  `;
  /** @type {HTMLInputElement} */ (body.querySelector("#pageName")).value = p.name;
  const save = button("Save", "btn btn--primary", () => {
    const name = /** @type {HTMLInputElement} */ (body.querySelector("#pageName")).value.trim();
    if (!name) return toast("Enter a page name.");
    p.name = name;
    saveState();
    closeModal();
    render();
  });
  const cancel = button("Cancel", "btn", closeModal);
  openModal("Rename page", body, [cancel, save]);
  setTimeout(() => body.querySelector("#pageName")?.select(), 0);
}

/** @param {string} widgetId */
function openWidgetEditor(widgetId) {
  if (!state.editMode) return;
  const w = findWidget(widgetId);
  if (!w) return;
  const def = WIDGET_DEFS[w.type];

  if (w.type === "header") return editHeader(w, def.title);
  if (w.type === "news") return editNews(w, def.title);
  if (w.type === "notifications") return editNotifications(w, def.title);
  if (w.type === "documents") return editDocuments(w, def.title);
  if (w.type === "discussions") return editDiscussions(w, def.title);
  if (w.type === "polls") return editPoll(w, def.title);
  if (w.type === "events") return editEvents(w, def.title);
  if (w.type === "button") return editButton(w, def.title);
  if (w.type === "image") return editImage(w, def.title);
  if (w.type === "text") return editText(w, def.title);
}

/** @param {Widget} w */
function editHeader(w, title) {
  const body = document.createElement("div");
  body.className = "form";
  body.innerHTML = `
    <div class="twocol">
      <div class="row">
        <div class="label">Company name</div>
        <input type="text" id="h_name" />
      </div>
      <div class="row">
        <div class="label">Logo text (2 letters)</div>
        <input type="text" id="h_logo" />
      </div>
    </div>
    <div class="row">
      <div class="label">Logo image URL</div>
      <input type="text" id="h_logo_img" placeholder="demoicon.png" />
    </div>
    <div class="row">
      <div class="label">Subtitle</div>
      <input type="text" id="h_sub" placeholder="Intranet" />
    </div>
    <div class="row">
      <div class="label">Details line</div>
      <input type="text" id="h_details" placeholder="Safety • Quality • Delivery" />
    </div>
  `;
  /** @type {HTMLInputElement} */ (body.querySelector("#h_name")).value = w.data.companyName ?? state.companyName ?? DEMO.company.name;
  /** @type {HTMLInputElement} */ (body.querySelector("#h_logo")).value = w.data.logoText ?? "DC";
  /** @type {HTMLInputElement} */ (body.querySelector("#h_logo_img")).value = w.data.logoImageUrl ?? "demoicon.png";
  /** @type {HTMLInputElement} */ (body.querySelector("#h_sub")).value = w.data.subtitle ?? "Intranet";
  /** @type {HTMLInputElement} */ (body.querySelector("#h_details")).value = w.data.details ?? "";

  const save = button("Save", "btn btn--primary", () => {
    const name = /** @type {HTMLInputElement} */ (body.querySelector("#h_name")).value.trim() || DEMO.company.name;
    const logo = (/** @type {HTMLInputElement} */ (body.querySelector("#h_logo"))).value.trim().slice(0, 3) || "DC";
    const logoImg = (/** @type {HTMLInputElement} */ (body.querySelector("#h_logo_img"))).value.trim() || "demoicon.png";
    const sub = /** @type {HTMLInputElement} */ (body.querySelector("#h_sub")).value.trim() || "Intranet";
    const det = /** @type {HTMLInputElement} */ (body.querySelector("#h_details")).value.trim();
    w.data.companyName = name;
    w.data.logoText = logo.toUpperCase();
    w.data.logoImageUrl = logoImg;
    w.data.subtitle = sub;
    w.data.details = det;
    state.companyName = name;
    saveState();
    closeModal();
    renderCanvas();
  });
  const cancel = button("Cancel", "btn", closeModal);
  openModal(`Edit: ${title}`, body, [cancel, save]);
}

/** @param {Widget} w */
function editNews(w, title) {
  const body = document.createElement("div");
  body.className = "form";
  body.innerHTML = `
    <div class="row">
      <div class="label">Add news title</div>
      <input type="text" id="n_title" placeholder="Headline" />
    </div>
    <div class="row">
      <div class="label">News text</div>
      <textarea id="n_body" placeholder="Write an update..."></textarea>
    </div>
    <div class="row">
      <div class="label">Image URL (optional)</div>
      <input type="url" id="n_img" placeholder="https://..." />
    </div>
    <div class="muted">Posts show in the widget on the page.</div>
  `;

  const add = button("Add post", "btn btn--primary", () => {
    const t = /** @type {HTMLInputElement} */ (body.querySelector("#n_title")).value.trim();
    const b = /** @type {HTMLTextAreaElement} */ (body.querySelector("#n_body")).value.trim();
    const img = /** @type {HTMLInputElement} */ (body.querySelector("#n_img")).value.trim();
    if (!t || !b) return toast("Title and text are required.");
    w.data.posts = w.data.posts ?? [];
    w.data.posts.unshift({ title: t, body: b, imageUrl: img, date: fmtDate(new Date()) });
    saveState();
    closeModal();
    renderCanvas();
  });
  const cancel = button("Cancel", "btn", closeModal);
  openModal(`Edit: ${title}`, body, [cancel, add]);
}

/** @param {Widget} w */
function editNotifications(w, title) {
  const body = document.createElement("div");
  body.className = "form";
  body.innerHTML = `
    <div class="row">
      <div class="label">Notification text</div>
      <textarea id="c_text" placeholder="e.g., Office closed Monday for maintenance."></textarea>
    </div>
    <div class="muted">Notifications appear for everyone.</div>
  `;
  const add = button("Add notification", "btn btn--primary", () => {
    const t = /** @type {HTMLTextAreaElement} */ (body.querySelector("#c_text")).value.trim();
    if (!t) return toast("Enter a notification.");
    w.data.items = w.data.items ?? [];
    w.data.items.unshift({ text: t, date: fmtDate(new Date()) });
    saveState();
    closeModal();
    renderCanvas();
  });
  const clear = button("Clear all", "btn btn--danger", () => {
    w.data.items = [];
    saveState();
    closeModal();
    renderCanvas();
  });
  const cancel = button("Cancel", "btn", closeModal);
  openModal(`Edit: ${title}`, body, [cancel, clear, add]);
}

/** @param {Widget} w */
function editDocuments(w, title) {
  const body = document.createElement("div");
  body.className = "form";
  const current = new Set((w.data.links ?? []).map((l) => l.docId));
  body.innerHTML = `
    <div class="row">
      <div class="label">Choose documents to show</div>
      <div id="docChecks" class="widget__list"></div>
    </div>
    <div class="muted">This simulates a Documents section with sample docs for the demo.</div>
  `;

  const list = body.querySelector("#docChecks");
  for (const d of DEMO.documents) {
    const row = document.createElement("label");
    row.className = "item";
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "10px";
    row.style.cursor = "pointer";
    row.innerHTML = `
      <input type="checkbox" ${current.has(d.id) ? "checked" : ""} data-doc="${escapeAttr(d.id)}" />
      <div style="display:flex; flex-direction:column; gap:2px">
        <div style="font-weight:700">${escapeHtml(d.title)}</div>
        <div class="muted" style="font-size:12px">${escapeHtml(d.folder)}</div>
      </div>
    `;
    list.appendChild(row);
  }

  const save = button("Save", "btn btn--primary", () => {
    const checks = Array.from(body.querySelectorAll("input[type=checkbox][data-doc]"));
    const docIds = checks.filter((c) => c.checked).map((c) => c.getAttribute("data-doc"));
    w.data.links = docIds.map((id) => ({ docId: id }));
    saveState();
    closeModal();
    renderCanvas();
  });
  const cancel = button("Cancel", "btn", closeModal);
  openModal(`Edit: ${title}`, body, [cancel, save]);
}

/** @param {Widget} w */
function editDiscussions(w, title) {
  const body = document.createElement("div");
  body.className = "form";
  body.innerHTML = `
    <div class="row">
      <div class="label">New thread title</div>
      <input type="text" id="t_title" placeholder="Topic" />
    </div>
    <div class="row">
      <div class="label">First post</div>
      <textarea id="t_body" placeholder="Start the discussion..."></textarea>
    </div>
    <div class="muted">For the demo, this keeps things lightweight: threads show on the widget.</div>
  `;
  const add = button("Add thread", "btn btn--primary", () => {
    const t = /** @type {HTMLInputElement} */ (body.querySelector("#t_title")).value.trim();
    const b = /** @type {HTMLTextAreaElement} */ (body.querySelector("#t_body")).value.trim();
    if (!t || !b) return toast("Title and post are required.");
    w.data.threads = w.data.threads ?? [];
    w.data.threads.unshift({
      id: rid("t"),
      title: t,
      posts: [{ user: `${firstName(currentUser().name)} (${currentUser().role})`, text: b, date: fmtDate(new Date()) }],
    });
    saveState();
    closeModal();
    renderCanvas();
  });
  const cancel = button("Cancel", "btn", closeModal);
  openModal(`Edit: ${title}`, body, [cancel, add]);
}

/** @param {Widget} w */
function editPoll(w, title) {
  const body = document.createElement("div");
  body.className = "form";
  const opts = (w.data.options ?? []).join("\n");
  body.innerHTML = `
    <div class="row">
      <div class="label">Question</div>
      <input type="text" id="p_q" />
    </div>
    <div class="row">
      <div class="label">Options (one per line)</div>
      <textarea id="p_opts"></textarea>
    </div>
    <div class="muted">Votes stay attached to the poll (per user) in local storage for the demo.</div>
  `;
  /** @type {HTMLInputElement} */ (body.querySelector("#p_q")).value = w.data.question ?? "";
  /** @type {HTMLTextAreaElement} */ (body.querySelector("#p_opts")).value = opts;

  const save = button("Save", "btn btn--primary", () => {
    const q = /** @type {HTMLInputElement} */ (body.querySelector("#p_q")).value.trim();
    const lines = /** @type {HTMLTextAreaElement} */ (body.querySelector("#p_opts")).value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!q || lines.length < 2) return toast("Enter a question and at least 2 options.");
    w.data.question = q;
    w.data.options = lines;
    w.data.votes = w.data.votes ?? {};
    saveState();
    closeModal();
    renderCanvas();
  });
  const resetVotes = button("Reset votes", "btn btn--danger", () => {
    w.data.votes = {};
    saveState();
    closeModal();
    renderCanvas();
  });
  const cancel = button("Cancel", "btn", closeModal);
  openModal(`Edit: ${title}`, body, [cancel, resetVotes, save]);
}

/** @param {Widget} w */
function editEvents(w, title) {
  const body = document.createElement("div");
  body.className = "form";
  body.innerHTML = `
    <div class="twocol">
      <div class="row">
        <div class="label">Event title</div>
        <input type="text" id="e_title" placeholder="e.g., Monthly all-hands" />
      </div>
      <div class="row">
        <div class="label">Date</div>
        <input type="date" id="e_date" />
      </div>
    </div>
    <div class="row">
      <div class="label">Existing events</div>
      <div id="e_list" class="widget__list"></div>
    </div>
  `;

  const list = body.querySelector("#e_list");
  const events = w.data.events ?? [];
  if (!events.length) {
    const m = document.createElement("div");
    m.className = "muted";
    m.textContent = "No events yet.";
    list.appendChild(m);
  } else {
    for (const e of events) {
      const item = document.createElement("div");
      item.className = "item";
      item.style.display = "flex";
      item.style.justifyContent = "space-between";
      item.style.alignItems = "center";
      item.innerHTML = `
        <div>
          <div style="font-weight:700">${escapeHtml(e.title)}</div>
          <div class="muted" style="font-size:12px">${escapeHtml(e.date)}</div>
        </div>
        <button class="btn btn--ghost btn--sm btn--danger" data-del="${escapeAttr(e.id)}">Remove</button>
      `;
      item.querySelector("button").addEventListener("click", () => {
        w.data.events = (w.data.events ?? []).filter((x) => x.id !== e.id);
        saveState();
        closeModal();
        renderCanvas();
      });
      list.appendChild(item);
    }
  }

  const add = button("Add event", "btn btn--primary", () => {
    const t = /** @type {HTMLInputElement} */ (body.querySelector("#e_title")).value.trim();
    const d = /** @type {HTMLInputElement} */ (body.querySelector("#e_date")).value;
    if (!t || !d) return toast("Enter title and date.");
    w.data.events = w.data.events ?? [];
    w.data.events.push({ id: rid("e"), title: t, date: d });
    // Keep calendar on month of newly added event
    const dt = new Date(d + "T00:00:00");
    w.data.month = dt.getMonth();
    w.data.year = dt.getFullYear();
    saveState();
    closeModal();
    renderCanvas();
  });
  const cancel = button("Close", "btn", closeModal);
  openModal(`Edit: ${title}`, body, [cancel, add]);
}

/** @param {Widget} w */
function editButton(w, title) {
  const body = document.createElement("div");
  body.className = "form";
  body.innerHTML = `
    <div class="twocol">
      <div class="row">
        <div class="label">Button style</div>
        <select id="b_mode">
          <option value="text">Text button</option>
          <option value="image">Image (square icon)</option>
        </select>
      </div>
      <div class="row">
        <div class="label">Link type</div>
        <select id="b_linkType">
          <option value="url">URL</option>
          <option value="page">Internal page</option>
        </select>
      </div>
    </div>

    <div class="row" id="b_textRow">
      <div class="label">Button text</div>
      <input type="text" id="b_label" placeholder="Open" />
    </div>

    <div class="row" id="b_imgRow">
      <div class="label">Image URL</div>
      <input type="url" id="b_img" placeholder="https://..." />
    </div>

    <div class="row" id="b_urlRow">
      <div class="label">URL</div>
      <input type="url" id="b_url" placeholder="https://..." />
    </div>

    <div class="row" id="b_pageRow">
      <div class="label">Page</div>
      <select id="b_page"></select>
    </div>

    <div class="muted">Text buttons are wide with fixed height. Image buttons are square (app icon style).</div>
  `;

  const modeSel = /** @type {HTMLSelectElement} */ (body.querySelector("#b_mode"));
  const linkSel = /** @type {HTMLSelectElement} */ (body.querySelector("#b_linkType"));
  const labelEl = /** @type {HTMLInputElement} */ (body.querySelector("#b_label"));
  const imgEl = /** @type {HTMLInputElement} */ (body.querySelector("#b_img"));
  const urlEl = /** @type {HTMLInputElement} */ (body.querySelector("#b_url"));
  const pageEl = /** @type {HTMLSelectElement} */ (body.querySelector("#b_page"));

  modeSel.value = w.data?.mode ?? "text";
  linkSel.value = w.data?.linkType ?? "url";
  labelEl.value = w.data?.label ?? "Open";
  imgEl.value = w.data?.imageUrl ?? "";
  urlEl.value = w.data?.url ?? "";

  pageEl.innerHTML = (state.pages ?? [])
    .map((p) => `<option value="${escapeAttr(p.id)}">${escapeHtml(p.name)}</option>`)
    .join("");
  pageEl.value = w.data?.pageId ?? "home";

  const sync = () => {
    const mode = modeSel.value;
    const lt = linkSel.value;
    body.querySelector("#b_textRow").style.display = mode === "text" ? "" : "none";
    body.querySelector("#b_imgRow").style.display = mode === "image" ? "" : "none";
    body.querySelector("#b_urlRow").style.display = lt === "url" ? "" : "none";
    body.querySelector("#b_pageRow").style.display = lt === "page" ? "" : "none";
  };
  modeSel.addEventListener("change", sync);
  linkSel.addEventListener("change", sync);
  sync();

  const save = button("Save", "btn btn--primary", () => {
    const mode = modeSel.value;
    const lt = linkSel.value;
    w.data.mode = mode;
    w.data.linkType = lt;
    w.data.label = labelEl.value.trim() || "Open";
    w.data.imageUrl = imgEl.value.trim();
    w.data.url = urlEl.value.trim();
    w.data.pageId = pageEl.value;

    // Fixed sizes based on button style
    if (mode === "image") {
      w.gw = 6;
      w.gh = 6;
    } else {
      w.gw = 12;
      w.gh = 4;
    }

    const clamped = clampToCanvas(w.gx, w.gy, w.gw, w.gh);
    w.gx = clamped.gx;
    w.gy = clamped.gy;
    normalizePageLayout(activePage());

    saveState();
    closeModal();
    renderCanvas();
  });
  const cancel = button("Cancel", "btn", closeModal);
  openModal(`Edit: ${title}`, body, [cancel, save]);
}

/** @param {Widget} w */
function editImage(w, title) {
  const body = document.createElement("div");
  body.className = "form";
  body.innerHTML = `
    <div class="row">
      <div class="label">Image URL</div>
      <input type="url" id="i_img" placeholder="https://..." />
    </div>
    <div class="twocol">
      <div class="row">
        <div class="label">Link type</div>
        <select id="i_linkType">
          <option value="url">URL</option>
          <option value="page">Internal page</option>
        </select>
      </div>
      <div class="row" id="i_pageRow">
        <div class="label">Page</div>
        <select id="i_page"></select>
      </div>
    </div>
    <div class="row" id="i_urlRow">
      <div class="label">URL</div>
      <input type="url" id="i_url" placeholder="https://..." />
    </div>
    <div class="muted">This element is resizable. The image will automatically scale to the size you set.</div>
  `;

  const imgEl = /** @type {HTMLInputElement} */ (body.querySelector("#i_img"));
  const linkSel = /** @type {HTMLSelectElement} */ (body.querySelector("#i_linkType"));
  const urlEl = /** @type {HTMLInputElement} */ (body.querySelector("#i_url"));
  const pageEl = /** @type {HTMLSelectElement} */ (body.querySelector("#i_page"));

  imgEl.value = w.data?.imageUrl ?? "";
  linkSel.value = w.data?.linkType ?? "url";
  urlEl.value = w.data?.url ?? "";

  pageEl.innerHTML = (state.pages ?? [])
    .map((p) => `<option value="${escapeAttr(p.id)}">${escapeHtml(p.name)}</option>`)
    .join("");
  pageEl.value = w.data?.pageId ?? "home";

  const sync = () => {
    const lt = linkSel.value;
    body.querySelector("#i_urlRow").style.display = lt === "url" ? "" : "none";
    body.querySelector("#i_pageRow").style.display = lt === "page" ? "" : "none";
  };
  linkSel.addEventListener("change", sync);
  sync();

  const save = button("Save", "btn btn--primary", () => {
    w.data.imageUrl = imgEl.value.trim();
    w.data.linkType = linkSel.value;
    w.data.url = urlEl.value.trim();
    w.data.pageId = pageEl.value;
    saveState();
    closeModal();
    renderCanvas();
  });
  const cancel = button("Cancel", "btn", closeModal);
  openModal(`Edit: ${title}`, body, [cancel, save]);
}

/** @param {Widget} w */
function editText(w, title) {
  const body = document.createElement("div");
  body.className = "form";
  body.innerHTML = `
    <div class="twocol">
      <div class="row">
        <div class="label">Font size</div>
        <select id="t_size">
          ${[12, 13, 14, 16, 18, 20, 24, 28].map((n) => `<option value="${n}">${n}px</option>`).join("")}
        </select>
      </div>
      <div class="row">
        <div class="label">Text color</div>
        <input type="text" id="t_color" placeholder="#1f2937" />
      </div>
    </div>
    <div class="row">
      <div class="label">Content (basic HTML allowed)</div>
      <textarea id="t_html" placeholder="<b>Hello</b>"></textarea>
    </div>
    <div class="muted">This is intentionally simple for the demo (we can upgrade to a richer editor later).</div>
  `;
  /** @type {HTMLSelectElement} */ (body.querySelector("#t_size")).value = String(w.data.fontSize ?? 13);
  /** @type {HTMLInputElement} */ (body.querySelector("#t_color")).value = w.data.color ?? "#1f2937";
  /** @type {HTMLTextAreaElement} */ (body.querySelector("#t_html")).value = w.data.html ?? "";

  const save = button("Save", "btn btn--primary", () => {
    const size = Number((/** @type {HTMLSelectElement} */ (body.querySelector("#t_size"))).value);
    const color = /** @type {HTMLInputElement} */ (body.querySelector("#t_color")).value.trim() || "#1f2937";
    const htmlRaw = /** @type {HTMLTextAreaElement} */ (body.querySelector("#t_html")).value.trim();
    const html = sanitizeBasicHtml(htmlRaw);
    w.data.fontSize = size;
    w.data.color = color;
    w.data.html = html;
    saveState();
    closeModal();
    renderCanvas();
  });
  const cancel = button("Cancel", "btn", closeModal);
  openModal(`Edit: ${title}`, body, [cancel, save]);
}

// Utilities
function rid(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2, 9)}${Math.random().toString(16).slice(2, 6)}`;
}

function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}

function isoDate(d) {
  const dd = new Date(d);
  const y = dd.getFullYear();
  const m = String(dd.getMonth() + 1).padStart(2, "0");
  const day = String(dd.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0=Sun
  const start = new Date(year, month, 1 - startDay);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push({ date, day: date.getDate(), inMonth: date.getMonth() === month });
  }
  return days;
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
function cssEscape(s) {
  // minimal escape for attribute selectors
  return String(s).replaceAll('"', '\\"');
}

function firstName(name) {
  return String(name).split(" ")[0] || name;
}
function initials(name) {
  const parts = String(name).split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function button(label, cls, onClick) {
  const b = document.createElement("button");
  b.className = cls;
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
}

function toast(msg) {
  // tiny toast using a floating div (no extra CSS needed)
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

function sanitizeBasicHtml(html) {
  // Minimal safety for the prototype: strip scripts and inline event handlers.
  return String(html)
    .replace(/<\s*script[\s\S]*?>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");
}

function nextFreeSpot(gw, gh) {
  // scan grid for first free spot (no overlap)
  const page = activePage();
  const { maxGX, maxGY } = canvasGridBounds();
  for (let gy = 0; gy <= maxGY; gy++) {
    for (let gx = 0; gx <= maxGX; gx++) {
      const clamped = clampToCanvas(gx, gy, gw, gh);
      const hit = page.widgets.some((o) => gridOverlap({ gx: clamped.gx, gy: clamped.gy, gw, gh }, o));
      if (!hit) return clamped;
    }
  }
  return { gx: 0, gy: 0 };
}

function gridOverlap(a, b) {
  return !(a.gx + a.gw <= b.gx || a.gx >= b.gx + b.gw || a.gy + a.gh <= b.gy || a.gy >= b.gy + b.gh);
}

function gridToPx(gx, gy) {
  return { x: CANVAS_PAD + gx * GRID, y: CANVAS_PAD + gy * GRID };
}

function canvasGridBounds() {
  const bounds = els.canvas.getBoundingClientRect();
  const w = Math.max(720, Math.floor(bounds.width || 720));
  // Allow the page to extend downward: prefer scrollHeight (content height) over viewport height.
  const contentH = Math.max(720, Math.floor(els.canvas.scrollHeight || bounds.height || 720));
  const h = contentH;
  const innerW = Math.max(0, w - CANVAS_PAD * 2);
  const innerH = Math.max(0, h - CANVAS_PAD * 2);
  return { maxGX: Math.floor(innerW / GRID), maxGY: Math.floor(innerH / GRID) };
}

function clampToCanvas(gx, gy, gw, gh) {
  const { maxGX, maxGY } = canvasGridBounds();
  const limGX = Math.max(0, maxGX - gw);
  const limGY = Math.max(0, maxGY - gh);
  return { gx: clamp(gx, 0, limGX), gy: clamp(gy, 0, limGY) };
}

function canPlace(gx, gy, widgetId) {
  const page = activePage();
  const w = findWidget(widgetId);
  if (!w) return false;
  const rect = { gx, gy, gw: w.gw, gh: w.gh };
  return !page.widgets.some((o) => o.id !== widgetId && gridOverlap(rect, o));
}

function canPlaceRect(gx, gy, gw, gh, ignoreId) {
  const page = activePage();
  const rect = { gx, gy, gw, gh };
  return !page.widgets.some((o) => o.id !== ignoreId && gridOverlap(rect, o));
}

function findSpotFor(w, startGX, startGY) {
  const { maxGX, maxGY } = canvasGridBounds();
  const limGX = Math.max(0, maxGX - w.gw);
  const limGY = Math.max(0, maxGY - w.gh);

  const startY = clamp(startGY, 0, limGY);
  for (let gy = startY; gy <= limGY; gy++) {
    for (let gx = 0; gx <= limGX; gx++) {
      if (canPlaceRect(gx, gy, w.gw, w.gh, w.id)) return { gx, gy };
    }
  }
  for (let gy = 0; gy < startY; gy++) {
    for (let gx = 0; gx <= limGX; gx++) {
      if (canPlaceRect(gx, gy, w.gw, w.gh, w.id)) return { gx, gy };
    }
  }

  const col = clamp(startGX, 0, limGX);
  for (let gy = 0; gy <= limGY; gy++) {
    if (canPlaceRect(col, gy, w.gw, w.gh, w.id)) return { gx: col, gy };
  }
  return null;
}

function moveWithPush(widgetId, targetGX, targetGY) {
  const page = activePage();
  const moving = page.widgets.find((x) => x.id === widgetId);
  if (!moving) return false;

  // Ensure we have some vertical room before attempting placement.
  updateCanvasHeight(page);

  // Capture original positions for revert + efficient DOM update.
  const before = new Map();
  const remember = (w) => {
    if (!before.has(w.id)) before.set(w.id, { gx: w.gx, gy: w.gy, gw: w.gw, gh: w.gh });
  };

  remember(moving);
  const clamped = clampToCanvas(targetGX, targetGY, moving.gw, moving.gh);
  moving.gx = clamped.gx;
  moving.gy = clamped.gy;

  /** @type {Widget[]} */
  const queue = [moving];
  let safety = 0;

  while (queue.length && safety++ < 250) {
    const cur = queue.shift();
    const curRect = { gx: cur.gx, gy: cur.gy, gw: cur.gw, gh: cur.gh };
    const overlaps = page.widgets.filter((o) => o.id !== cur.id && gridOverlap(curRect, o));

    for (const o of overlaps) {
      if (WIDGET_DEFS[o.type]?.fixed) {
        // Can't push fixed widgets; revert.
        for (const [id, v] of before.entries()) {
          const ww = page.widgets.find((x) => x.id === id);
          if (ww) Object.assign(ww, v);
        }
        return false;
      }

      remember(o);
      const spot = findSpotFor(o, Math.min(o.gx, cur.gx), Math.max(o.gy + 1, cur.gy + cur.gh));
      if (!spot) {
        for (const [id, v] of before.entries()) {
          const ww = page.widgets.find((x) => x.id === id);
          if (ww) Object.assign(ww, v);
        }
        return false;
      }
      o.gx = spot.gx;
      o.gy = spot.gy;
      queue.push(o);
    }
  }

  // Update DOM positions for widgets we touched (fast, avoids full rerender during drag).
  for (const [id] of before.entries()) {
    const ww = page.widgets.find((x) => x.id === id);
    const node = els.canvas.querySelector(`[data-widget-id="${cssEscape(id)}"]`);
    if (ww && node) {
      const px = gridToPx(ww.gx, ww.gy);
      node.style.left = `${px.x}px`;
      node.style.top = `${px.y}px`;
      node.style.width = `${ww.gw * GRID}px`;
      node.style.height = `${ww.gh * GRID}px`;
    }
  }
  updateCanvasHeight(page);
  return true;
}

function normalizePageLayout(page) {
  const widgets = [...(page.widgets ?? [])];
  // Fixed widgets first, then in reading order.
  widgets.sort(
    (a, b) =>
      Number(!!WIDGET_DEFS[b.type]?.fixed) - Number(!!WIDGET_DEFS[a.type]?.fixed) || a.gy - b.gy || a.gx - b.gx
  );

  for (const w of widgets) {
    const clamped = clampToCanvas(w.gx, w.gy, w.gw, w.gh);
    w.gx = clamped.gx;
    w.gy = clamped.gy;
    if (!canPlace(w.gx, w.gy, w.id)) {
      const spot = nextFreeSpot(w.gw, w.gh);
      w.gx = spot.gx;
      w.gy = spot.gy;
    }
  }
}

function minSizeFor(type) {
  // Keep a reasonable minimum per widget type (grid units)
  if (type === "button") return { gw: 6, gh: 4 };
  if (type === "image") return { gw: 10, gh: 6 };
  if (type === "polls") return { gw: 12, gh: 9 };
  if (type === "notifications") return { gw: 14, gh: 8 };
  if (type === "documents") return { gw: 14, gh: 9 };
  if (type === "news") return { gw: 16, gh: 12 };
  if (type === "events") return { gw: 18, gh: 12 };
  if (type === "discussions") return { gw: 18, gh: 12 };
  if (type === "text") return { gw: 10, gh: 6 };
  return { gw: 10, gh: 6 };
}

function resizeWithPush(widgetId, newGW, newGH) {
  const page = activePage();
  const w = page.widgets.find((x) => x.id === widgetId);
  if (!w) return false;

  updateCanvasHeight(page);
  const before = new Map();
  const remember = (ww) => {
    if (!before.has(ww.id)) before.set(ww.id, { gx: ww.gx, gy: ww.gy, gw: ww.gw, gh: ww.gh });
  };
  remember(w);

  // Apply size + clamp position to remain on-canvas (prevents going off left/right).
  const { maxGX } = canvasGridBounds();
  const maxGW = Math.max(1, maxGX);
  w.gw = clamp(newGW, minSizeFor(w.type).gw, maxGW);
  w.gh = clamp(newGH, minSizeFor(w.type).gh, 9999);
  const clamped = clampToCanvas(w.gx, w.gy, w.gw, w.gh);
  w.gx = clamped.gx;
  w.gy = clamped.gy;

  /** @type {Widget[]} */
  const queue = [w];
  let safety = 0;
  while (queue.length && safety++ < 300) {
    const cur = queue.shift();
    const curRect = { gx: cur.gx, gy: cur.gy, gw: cur.gw, gh: cur.gh };
    const overlaps = page.widgets.filter((o) => o.id !== cur.id && gridOverlap(curRect, o));
    for (const o of overlaps) {
      if (WIDGET_DEFS[o.type]?.fixed) {
        // Revert if we would collide with a fixed widget
        for (const [id, v] of before.entries()) {
          const ww = page.widgets.find((x) => x.id === id);
          if (ww) Object.assign(ww, v);
        }
        return false;
      }
      remember(o);
      const spot = findSpotFor(o, Math.min(o.gx, cur.gx), Math.max(o.gy + 1, cur.gy + cur.gh));
      if (!spot) {
        for (const [id, v] of before.entries()) {
          const ww = page.widgets.find((x) => x.id === id);
          if (ww) Object.assign(ww, v);
        }
        return false;
      }
      o.gx = spot.gx;
      o.gy = spot.gy;
      queue.push(o);
    }
  }

  // DOM update for touched widgets
  for (const [id] of before.entries()) {
    const ww = page.widgets.find((x) => x.id === id);
    const node = els.canvas.querySelector(`[data-widget-id="${cssEscape(id)}"]`);
    if (ww && node) {
      const px = gridToPx(ww.gx, ww.gy);
      node.style.left = `${px.x}px`;
      node.style.top = `${px.y}px`;
      node.style.width = `${ww.gw * GRID}px`;
      node.style.height = `${ww.gh * GRID}px`;
    }
  }
  updateCanvasHeight(page);
  return true;
}

function cleanupLayout(page) {
  updateCanvasHeight(page);
  // Keep fixed widgets where they are; pack everything else top-left by current reading order.
  const fixed = (page.widgets ?? []).filter((w) => WIDGET_DEFS[w.type]?.fixed);
  const movables = (page.widgets ?? []).filter((w) => !WIDGET_DEFS[w.type]?.fixed);
  movables.sort((a, b) => a.gy - b.gy || a.gx - b.gx);

  // Start with fixed in place.
  page.widgets = [...fixed];

  for (const w of movables) {
    // find first free spot from top-left
    const spot = nextFreeSpot(w.gw, w.gh);
    w.gx = spot.gx;
    w.gy = spot.gy;
    page.widgets.push(w);
  }

  normalizePageLayout(page);
  updateCanvasHeight(page);
}

// Toolbox dragging (re-enabled)
const tbDrag = { active: false, startX: 0, startY: 0, origX: 0, origY: 0, pointerId: 0 };

function ensureToolboxPosition() {
  if (!els.toolbox) return;

  // Initialize default position: right-center, not overlapping Edit/Done button
  if (typeof state.toolboxX !== "number" || typeof state.toolboxY !== "number") {
    const pad = 16;
    const w = els.toolbox.offsetWidth || 240;
    const h = els.toolbox.offsetHeight || 360;
    state.toolboxX = Math.max(pad, window.innerWidth - w - pad);
    state.toolboxY = Math.max(pad, Math.round((window.innerHeight - h) / 2));
    saveState();
  }

  const pad = 8;
  const maxX = window.innerWidth - (els.toolbox.offsetWidth || 240) - pad;
  const maxY = window.innerHeight - (els.toolbox.offsetHeight || 360) - pad;
  const x = clamp(state.toolboxX, pad, Math.max(pad, maxX));
  const y = clamp(state.toolboxY, pad, Math.max(pad, maxY));
  state.toolboxX = x;
  state.toolboxY = y;
  els.toolbox.style.left = `${x}px`;
  els.toolbox.style.top = `${y}px`;
}

els.toolboxHandle?.addEventListener("pointerdown", (e) => {
  if (!state.editMode) return;
  ensureToolboxPosition();
  tbDrag.active = true;
  tbDrag.startX = e.clientX;
  tbDrag.startY = e.clientY;
  tbDrag.origX = state.toolboxX;
  tbDrag.origY = state.toolboxY;
  tbDrag.pointerId = e.pointerId;

  els.toolbox.setPointerCapture(e.pointerId);
  els.toolbox.addEventListener("pointermove", onToolboxMove);
  els.toolbox.addEventListener("pointerup", onToolboxUp, { once: true });
  els.toolbox.addEventListener("pointercancel", onToolboxUp, { once: true });
});

function onToolboxMove(e) {
  if (!tbDrag.active) return;
  if (e.pointerId !== tbDrag.pointerId) return;
  const dx = e.clientX - tbDrag.startX;
  const dy = e.clientY - tbDrag.startY;
  state.toolboxX = tbDrag.origX + dx;
  state.toolboxY = tbDrag.origY + dy;
  ensureToolboxPosition();
}

function onToolboxUp(e) {
  if (e.pointerId !== tbDrag.pointerId) return;
  tbDrag.active = false;
  els.toolbox.releasePointerCapture(e.pointerId);
  els.toolbox.removeEventListener("pointermove", onToolboxMove);
  saveState();
}

function updateCanvasHeight(page) {
  // Compute bottom-most widget and grow canvas so the page can scroll down.
  const maxRow = Math.max(
    0,
    ...(page.widgets ?? []).map((w) => (typeof w.gy === "number" ? w.gy : 0) + (typeof w.gh === "number" ? w.gh : 0))
  );
  const bufferRows = 8;
  const neededPx = CANVAS_PAD * 2 + (maxRow + bufferRows) * GRID;
  const minPx = Math.max(window.innerHeight, neededPx);
  els.canvas.style.minHeight = `${minPx}px`;
}

function migrateState(s) {
  // add missing fields (toolbox position)
  if (typeof s.toolboxX !== "number") s.toolboxX = undefined;
  if (typeof s.toolboxY !== "number") s.toolboxY = undefined;

  // migrate widget geometry from pixel (x/y/w/h) to grid (gx/gy/gw/gh)
  for (const p of s.pages ?? []) {
    for (const w of p.widgets ?? []) {
      const def = WIDGET_DEFS[w.type] || WIDGET_DEFS.text;
      if (typeof w.gx !== "number" || typeof w.gy !== "number") {
        const x = typeof w.x === "number" ? w.x : CANVAS_PAD;
        const y = typeof w.y === "number" ? w.y : CANVAS_PAD;
        w.gx = Math.max(0, Math.round((x - CANVAS_PAD) / GRID));
        w.gy = Math.max(0, Math.round((y - CANVAS_PAD) / GRID));
      }
      if (typeof w.gw !== "number" || typeof w.gh !== "number") {
        w.gw = def.gw;
        w.gh = def.gh;
      }
      delete w.x;
      delete w.y;
      delete w.w;
      delete w.h;
    }
  }

  // ensure there's always a header widget on Home for the demo
  const home = (s.pages ?? []).find((p) => p.id === "home");
  if (home && !(home.widgets ?? []).some((w) => w.type === "header")) {
    home.widgets.unshift({
      id: rid("w"),
      type: "header",
      gx: 0,
      gy: 0,
      gw: WIDGET_DEFS.header.gw,
      gh: WIDGET_DEFS.header.gh,
      data: {
        companyName: s.companyName ?? DEMO.company.name,
        subtitle: "Intranet",
        details: "Safety • Quality • Delivery",
        logoText: "DC",
        logoImageUrl: "demoicon.png",
      },
    });
  }
  // Backfill logo image on existing header widgets
  for (const p of s.pages ?? []) {
    for (const w of p.widgets ?? []) {
      if (w.type === "header" && !w.data?.logoImageUrl) {
        w.data = w.data ?? {};
        w.data.logoImageUrl = "demoicon.png";
      }
    }
  }
  for (const p of s.pages ?? []) normalizePageLayout(p);
  return s;
}

init();


