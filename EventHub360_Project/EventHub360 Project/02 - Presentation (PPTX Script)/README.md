# 02 – Presentation (PPTX Script)

This folder contains the Node.js script used to generate the PowerPoint presentation.

## File

| File | Purpose |
|------|---------|
| `make_pptx.js` | Generates `EventHub360_EMS_Presentation.pptx` using pptxgenjs |

## How to run

```bash
# Install dependency
npm install -g pptxgenjs

# Generate the .pptx file
node make_pptx.js
```

The output file `EventHub360_EMS_Presentation.pptx` will be created in the same directory.

## What it generates

A **10-slide presentation** covering:
1. Title slide
2. Project Overview
3. System Architecture
4. Core Features (Dashboard & Students)
5. Attendance & Salary Modules
6. Analytics: 5 Charts
7. Data Visualisation Samples (with real embedded Chart.js-style charts)
8. Login & Account System
9. Multi-Axis Filter System
10. Tech Stack & Thank You

The final `.pptx` is also available pre-built in `03 - Documentation/`.
