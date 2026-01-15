# Demo Construction Intranet (Prototype)

This is a **drop-in, static prototype** of a company intranet homepage builder (HR/editor can add widgets and drag them around).

## Run it

- Open `index.html` in your browser (double-click it).

## Demo features included

- **Default homepage template** (so a new company sees something immediately)
- **Edit mode** (top-right **Edit** button)
- **Draggable toolbox** (icons; hover for names)
- **Drag & drop widgets** (snap-to-grid; no overlaps; dragging pushes other widgets out of the way)
- **Widget editing** (use the ✏️ action on a widget)
- **Multi-page** support (add pages via toolbox; open them using the **Button** widget set to “Internal page”)
- **Persistence** via `localStorage` (refresh-safe)

## Notes / next upgrades

- “Use template” button is present but disabled (as requested).
- Page navigation is intentionally minimal right now (buttons can open pages); we can add a proper page list / nav builder next.
- This prototype uses no backend. Next step is wiring it to your existing auth, database, and documents storage.


