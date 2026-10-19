# ♿ PathProof — Accessibility-Aware Pedestrian Navigation System

> Part of the **Antigravity 20-Project Systems Engineering Portfolio**

PathProof solves urban mobility barriers for wheelchair users and parents with strollers by executing multi-constraint routing algorithms (Dijkstra/A*) that strictly eliminate stairs, respect maximum slope thresholds (<= 5%), verify elevator telemetry freshness, and actively detour around construction barriers.

---

## 🏗️ Architecture

```
User Mobility Profile (Wheelchair / Stroller / Standard)
                          │
                          ▼
┌──────────────────────────────────────────────────┐
│                AccessibleRouter                  │ ──> Constrained Dijkstra Graph Solver
├──────────────────────────────────────────────────┤
│ 1. Filter Out Stairs & Slopes > Max Incline      │
│ 2. Require Curb Cuts & Min Sidewalk Widths       │
│ 3. Bypass Active Obstruction Reports             │
└──────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────┐
│          Facility Freshness Engine               │ ──> Telemetry Timestamp Validation
└──────────────────────────────────────────────────┘
                          │
                          ▼
Interactive Accessible Map Studio (ui/index.html)
```

---

## 🚀 Quick Start

### 1. Run Tests
```bash
npm test
```

### 2. Launch Individual UI Dashboard
```bash
npm run ui
```
Opens the accessibility routing console at `http://localhost:4008`.
