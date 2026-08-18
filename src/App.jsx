<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
<title>시스템 행거장 설치 사전 실측</title>
<style>
  body { margin: 0; padding: 16px; background: #E7ECF1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  #curtain-survey-app {
    --navy: #0F2540;
    --navy-2: #16324F;
    --paper: #F4F7FA;
    --paper-line: rgba(27,58,92,0.10);
    --ink: #14213D;
    --ink-soft: #5C7089;
    --teal: #1F8A8F;
    --teal-dark: #146366;
    --amber: #E07B1E;
    --red: #C4432B;
    --green: #2B8A5E;
    --card: #FFFFFF;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--navy);
    color: var(--ink);
    border-radius: 14px;
    padding: 0;
    max-width: 1240px;
    margin: 0 auto;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(15,37,64,0.35);
  }
  #curtain-survey-app * { box-sizing: border-box; }
  #curtain-survey-app .mono {
    font-family: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;
    font-variant-numeric: tabular-nums;
  }

  /* Header */
  #curtain-survey-app .csa-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%);
    padding: 22px 24px 18px;
    position: relative;
  }
  #curtain-survey-app .csa-header::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 6px;
    background-image: repeating-linear-gradient(90deg, #ffffff22 0 2px, transparent 2px 14px);
  }
  #curtain-survey-app .csa-eyebrow {
    color: #7FD4D6;
    font-size: 11px;
    letter-spacing: 0.16em;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 6px;
    font-family: 'IBM Plex Mono', monospace;
  }
  #curtain-survey-app .csa-title {
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  #curtain-survey-app .csa-sub {
    color: #A9BDD4;
    font-size: 13px;
    margin-top: 4px;
  }
  #curtain-survey-app .csa-linked-banner {
    margin-top: 12px;
    background: rgba(127,212,214,0.14);
    border: 1px solid rgba(127,212,214,0.4);
    color: #CFEFF0;
    font-size: 12.5px;
    padding: 8px 12px;
    border-radius: 8px;
    display: none;
  }
  #curtain-survey-app .csa-linked-banner.show { display: block; }

  /* Body layout */
  #curtain-survey-app .csa-body {
    background: var(--paper);
    padding: 18px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  @media (min-width: 780px) {
    #curtain-survey-app .csa-body { grid-template-columns: 340px 1fr; align-items: start; }
  }

  /* Form panel */
  #curtain-survey-app .csa-panel {
    background: var(--card);
    border-radius: 10px;
    padding: 16px;
    border: 1px solid var(--paper-line);
  }
  #curtain-survey-app .csa-panel + .csa-panel { margin-top: 14px; }
  #curtain-survey-app .csa-panel-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--teal-dark);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  #curtain-survey-app .csa-panel-title .num {
    background: var(--teal);
    color: #fff;
    width: 18px; height: 18px;
    border-radius: 4px;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 11px;
    font-family: 'IBM Plex Mono', monospace;
  }

  #curtain-survey-app label.csa-field {
    display: block;
    margin-bottom: 12px;
  }
  #curtain-survey-app .csa-field-label {
    font-size: 12.5px;
    color: var(--ink-soft);
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
  }
  #curtain-survey-app .csa-field input[type=text],
  #curtain-survey-app .csa-field input[type=number] {
    width: 100%;
    border: 1.5px solid #DDE5EC;
    border-radius: 8px;
    padding: 11px 12px;
    font-size: 16px;
    font-family: 'IBM Plex Mono', monospace;
    color: var(--ink);
    background: #FBFCFD;
    transition: border-color .15s;
  }
  #curtain-survey-app .csa-field input[type=text] { font-family: 'Inter', sans-serif; }
  #curtain-survey-app .csa-field input:focus {
    outline: none;
    border-color: var(--teal);
    background: #fff;
  }
  #curtain-survey-app .csa-unit { color: var(--ink-soft); font-size: 12px; font-weight: 500; }

  #curtain-survey-app .csa-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 2px;
    border-top: 1px solid var(--paper-line);
  }
  #curtain-survey-app .csa-toggle-row:first-of-type { border-top: none; }
  #curtain-survey-app .csa-toggle-label { font-size: 13.5px; font-weight: 500; }
  #curtain-survey-app .csa-switch {
    position: relative;
    width: 42px; height: 24px;
    flex-shrink: 0;
    cursor: pointer;
  }
  #curtain-survey-app .csa-switch input { opacity: 0; width: 100%; height: 100%; position: absolute; margin:0; cursor:pointer; }
  #curtain-survey-app .csa-switch .track {
    position: absolute; inset: 0;
    background: #D8E0E8;
    border-radius: 999px;
    transition: background .15s;
  }
  #curtain-survey-app .csa-switch .knob {
    position: absolute; top: 3px; left: 3px;
    width: 18px; height: 18px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.25);
    transition: transform .15s;
  }
  #curtain-survey-app .csa-switch input:checked + .track { background: var(--teal); }
  #curtain-survey-app .csa-switch input:checked + .track + .knob { transform: translateX(18px); }

  #curtain-survey-app .csa-sub-field {
    max-height: 0;
    overflow: hidden;
    transition: max-height .2s ease;
  }
  #curtain-survey-app .csa-sub-field.open { max-height: 90px; margin-top: 10px; }
  #curtain-survey-app .csa-sub-field#csa-door-sub.open { max-height: 170px; }
  #curtain-survey-app .csa-sub-field#csa-winenabled-sub.open { max-height: 640px; }

  #curtain-survey-app textarea.csa-memo {
    width: 100%;
    border: 1.5px solid #DDE5EC;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    resize: vertical;
    min-height: 56px;
    background: #FBFCFD;
  }
  #curtain-survey-app textarea.csa-memo:focus { outline: none; border-color: var(--teal); background:#fff; }

  /* Buttons */
  #curtain-survey-app .csa-btn {
    border: none;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: opacity .15s, transform .1s;
  }
  #curtain-survey-app .csa-btn:active { transform: scale(0.98); }
  #curtain-survey-app .csa-btn-primary { background: var(--teal); color: #fff; width: 100%; }
  #curtain-survey-app .csa-btn-primary:hover { background: var(--teal-dark); }
  #curtain-survey-app .csa-btn-ghost { background: transparent; color: var(--ink-soft); border: 1.5px solid #DDE5EC; }
  #curtain-survey-app .csa-btn-row { display: flex; gap: 8px; margin-top: 4px; }
  #curtain-survey-app .csa-btn-row .csa-btn { flex: 1; }

  /* Diagram panel */
  #curtain-survey-app .csa-diagram-card {
    background: var(--card);
    border-radius: 10px;
    border: 1px solid var(--paper-line);
    padding: 14px 14px 18px;
    margin-bottom: 14px;
  }
  #curtain-survey-app .csa-diagram-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--navy);
    letter-spacing: 0.03em;
    margin-bottom: 2px;
  }
  #curtain-survey-app .csa-diagram-desc {
    font-size: 11.5px;
    color: var(--ink-soft);
    margin-bottom: 10px;
  }
  #curtain-survey-app .csa-diagram-card svg {
    width: 100%;
    height: auto;
    display: block;
    background:
      linear-gradient(var(--paper-line) 1px, transparent 1px) 0 0/24px 24px,
      linear-gradient(90deg, var(--paper-line) 1px, transparent 1px) 0 0/24px 24px,
      #FBFDFE;
    border-radius: 8px;
  }

  #curtain-survey-app .csa-note {
    margin-top: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 12.5px;
    line-height: 1.5;
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }
  #curtain-survey-app .csa-note.ok { background: #E7F5EE; color: var(--green); }
  #curtain-survey-app .csa-note.warn { background: #FCEEE8; color: var(--red); }
  #curtain-survey-app .csa-note.info { background: #EAF2F7; color: var(--navy-2); }

  /* Saved list */
  #curtain-survey-app .csa-list-panel {
    grid-column: 1 / -1;
    background: var(--card);
    border-radius: 10px;
    border: 1px solid var(--paper-line);
    padding: 16px;
  }
  #curtain-survey-app .csa-list-empty {
    font-size: 13px;
    color: var(--ink-soft);
    padding: 18px 4px;
    text-align: center;
    border: 1.5px dashed #DDE5EC;
    border-radius: 8px;
  }
  #curtain-survey-app .csa-record {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 12px 4px;
    border-top: 1px solid var(--paper-line);
    cursor: pointer;
  }
  #curtain-survey-app .csa-record:first-of-type { border-top: none; }
  #curtain-survey-app .csa-record:hover { background: #FAFCFD; }
  #curtain-survey-app .csa-record.csa-record-linked {
    background: #EAF7F7;
    border-left: 3px solid var(--teal);
    padding-left: 8px;
    border-radius: 6px;
  }
  #curtain-survey-app .csa-record-linked-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    background: var(--teal);
    border-radius: 4px;
    padding: 1px 6px;
    margin-left: 6px;
    vertical-align: middle;
    font-family: 'IBM Plex Mono', monospace;
  }
  #curtain-survey-app .csa-record-name { font-weight: 600; font-size: 14px; }
  #curtain-survey-app .csa-record-meta { font-size: 11.5px; color: var(--ink-soft); margin-top: 2px; font-family:'IBM Plex Mono', monospace; }
  #curtain-survey-app .csa-record-del {
    background: none; border: none; color: var(--ink-soft);
    font-size: 18px; cursor: pointer; padding: 6px 10px; line-height: 1;
    border-radius: 6px;
  }
  #curtain-survey-app .csa-record-del:hover { background: #FCEEE8; color: var(--red); }
  #curtain-survey-app .csa-record-export {
    background: none; border: none; color: var(--ink-soft);
    font-size: 15px; cursor: pointer; padding: 6px 8px; line-height: 1;
    border-radius: 6px;
  }
  #curtain-survey-app .csa-record-export:hover { background: #EAF2F7; color: var(--teal-dark); }
  #curtain-survey-app .csa-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }
  #curtain-survey-app .csa-export-all {
    font-size: 12.5px;
    padding: 8px 12px;
    white-space: nowrap;
  }
  #curtain-survey-app .csa-record-thumb {
    width: 44px; height: 44px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
    background: #EEF3F7;
    cursor: zoom-in;
  }
  #curtain-survey-app .csa-record-thumb-empty {
    border: 1.5px dashed #DDE5EC;
  }
  #curtain-survey-app .csa-record-thumb-wrap { position: relative; flex-shrink: 0; }
  #curtain-survey-app .csa-record-thumb-count {
    position: absolute;
    bottom: -2px; right: -2px;
    background: var(--navy);
    color: #fff;
    font-size: 9.5px;
    font-weight: 700;
    line-height: 1;
    padding: 2px 4px;
    border-radius: 8px;
    font-family: 'IBM Plex Mono', monospace;
  }

  #curtain-survey-app .csa-status {
    font-size: 11px;
    color: var(--ink-soft);
    text-align: center;
    padding: 8px 0 2px;
  }

  #curtain-survey-app .csa-field select.csa-select {
    width: 100%;
    border: 1.5px solid #DDE5EC;
    border-radius: 8px;
    padding: 11px 12px;
    font-size: 14.5px;
    font-family: 'Inter', sans-serif;
    color: var(--ink);
    background: #FBFCFD;
  }
  #curtain-survey-app .csa-field select.csa-select:focus { outline: none; border-color: var(--teal); background: #fff; }

  #curtain-survey-app .csa-hidden-io { display: none; }
  #curtain-survey-app .csa-appliance-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 0;
    border-top: 1px solid var(--paper-line);
  }
  #curtain-survey-app .csa-appliance-row:first-child { border-top: none; }
  #curtain-survey-app .csa-appliance-row input[type=text] {
    flex: 1;
    border: 1.5px solid #DDE5EC;
    border-radius: 7px;
    padding: 8px 10px;
    font-size: 13.5px;
    font-family: 'Inter', sans-serif;
    color: var(--ink);
    background: #FBFCFD;
  }
  #curtain-survey-app .csa-appliance-row input[type=text]:focus { outline: none; border-color: var(--teal); background: #fff; }
  #curtain-survey-app .csa-appliance-del {
    background: none; border: none; color: var(--ink-soft);
    font-size: 16px; cursor: pointer; padding: 6px 8px; line-height: 1;
    border-radius: 6px; flex-shrink: 0;
  }
  #curtain-survey-app .csa-appliance-del:hover { background: #FCEEE8; color: var(--red); }

  #curtain-survey-app .csa-photo-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  #curtain-survey-app .csa-photo-tile {
    width: 68px;
    height: 68px;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    background: #FBFCFD;
    flex-shrink: 0;
  }
  #curtain-survey-app .csa-photo-tile img { width: 100%; height: 100%; object-fit: cover; display: block; cursor: zoom-in; }
  #curtain-survey-app .csa-photo-del {
    position: absolute;
    top: 3px; right: 3px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: rgba(15,37,64,0.68);
    color: #fff;
    font-size: 11px;
    line-height: 18px;
    text-align: center;
    cursor: pointer;
  }
  #curtain-survey-app .csa-photo-add {
    width: 68px;
    height: 68px;
    border-radius: 8px;
    border: 1.5px dashed #DDE5EC;
    background: #FBFCFD;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: var(--ink-soft);
    cursor: pointer;
    flex-shrink: 0;
  }

  #curtain-survey-app .csa-lightbox {
    position: fixed;
    inset: 0;
    background: rgba(15,37,64,0.9);
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
    cursor: zoom-out;
  }
  #curtain-survey-app .csa-lightbox.open { display: flex; }
  #curtain-survey-app .csa-lightbox img {
    max-width: 92vw;
    max-height: 88vh;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    cursor: default;
  }
  #curtain-survey-app .csa-lightbox-close {
    position: fixed;
    top: 16px; right: 20px;
    width: 36px; height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    color: #fff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  #curtain-survey-app .csa-tap3d-hint {
    font-size: 11.5px;
    color: var(--ink-soft);
    background: #EEF3F7;
    border-radius: 6px;
    padding: 8px 10px;
    line-height: 1.5;
    margin-top: 10px;
  }

  /* 3D panel */
  #curtain-survey-app .csa-3d-card { grid-column: 1 / -1; }
  #curtain-survey-app .csa-wall-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }
  @media (min-width: 560px) {
    #curtain-survey-app .csa-wall-grid { grid-template-columns: 1fr 1fr; }
  }
  #curtain-survey-app .csa-wall-card {
    background: #FBFDFE;
    border: 1px solid var(--paper-line);
    border-radius: 8px;
    overflow: hidden;
  }
  #curtain-survey-app .csa-wall-card svg { width: 100%; height: auto; display: block; }
  #curtain-survey-app .csa-3d-wrap {
    position: relative;
    width: 100%;
    height: min(78vh, 820px);
    min-height: 420px;
    border-radius: 8px;
    overflow: hidden;
    background: linear-gradient(180deg, #DCE8EF 0%, #C7D9E3 55%, #B7CCD8 100%);
    touch-action: none;
    cursor: grab;
  }
  #curtain-survey-app .csa-3d-wrap.dragging { cursor: grabbing; }
  #curtain-survey-app .csa-3d-wrap canvas { display: block; width: 100%; height: 100%; }
  #curtain-survey-app .csa-3d-placeholder {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    color: #6E8199; font-size: 13px; font-family: 'Inter', sans-serif;
    text-align: center; padding: 0 30px;
  }
  #curtain-survey-app .csa-3d-hint {
    position: absolute;
    bottom: 8px; left: 10px;
    font-size: 10.5px;
    color: #3F5A70;
    background: rgba(255,255,255,0.6);
    padding: 3px 8px;
    border-radius: 999px;
    font-family: 'Inter', sans-serif;
    pointer-events: none;
  }
  #curtain-survey-app .csa-3d-toolbar {
    position: absolute;
    top: 8px; right: 10px;
    display: flex;
    gap: 6px;
    z-index: 5;
  }
  #curtain-survey-app .csa-3d-chip {
    background: rgba(255,255,255,0.9);
    border: 1.5px solid #DDE5EC;
    border-radius: 999px;
    padding: 5px 11px;
    font-size: 11px;
    font-weight: 600;
    color: var(--ink-soft);
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 1px 3px rgba(15,37,64,0.15);
    transition: background .12s, color .12s, border-color .12s;
  }
  #curtain-survey-app .csa-3d-chip.on {
    background: var(--teal);
    border-color: var(--teal);
    color: #fff;
  }
  #curtain-survey-app .csa-3d-toolbar-sub {
    position: absolute;
    top: 42px; right: 10px;
    display: flex;
    gap: 5px;
    z-index: 5;
  }
  #curtain-survey-app .csa-3d-chip.mini {
    padding: 4px 9px;
    font-size: 10px;
    font-family: 'IBM Plex Mono', monospace;
  }
  #curtain-survey-app .csa-3d-dimfilter {
    position: absolute;
    top: 8px; left: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    max-width: 62%;
    z-index: 5;
  }
  #curtain-survey-app .csa-3d-labels {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  #curtain-survey-app .csa-3d-label {
    position: absolute;
    transform: translate(-50%, -160%);
    transform-origin: center center;
    background: transparent;
    padding: 1px 3px;
    font-size: 10.5px;
    font-weight: 600;
    font-family: 'IBM Plex Mono', monospace;
    white-space: nowrap;
    text-shadow:
      -1px -1px 0 #fff, 1px -1px 0 #fff,
      -1px 1px 0 #fff, 1px 1px 0 #fff,
      0 0 4px #fff;
  }
  #curtain-survey-app .csa-3d-label.editable {
    cursor: pointer;
    border-bottom: 1.5px dashed currentColor;
    padding-bottom: 0;
  }
  #curtain-survey-app .csa-3d-label.badge {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--navy);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    text-shadow: none;
    box-shadow: 0 2px 6px rgba(15,37,64,0.4);
  }
  #curtain-survey-app .csa-3d-label.badge.action {
    width: 20px;
    height: 20px;
    background: var(--red);
    font-size: 11px;
    cursor: pointer;
  }
  #curtain-survey-app .csa-3d-label-input {
    position: absolute;
    transform: translate(-50%, -160%);
    width: 74px;
    font-size: 12px;
    font-weight: 700;
    font-family: 'IBM Plex Mono', monospace;
    text-align: center;
    border: 1.5px solid var(--teal);
    border-radius: 4px;
    padding: 2px 4px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(15,37,64,0.25);
    z-index: 5;
  }
  #curtain-survey-app .csa-3d-label-input:focus { outline: none; }
  #curtain-survey-app .csa-3d-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 14px;
    margin-top: 10px;
    font-size: 11px;
    color: var(--ink-soft);
  }
  #curtain-survey-app .csa-3d-legend span { display: inline-flex; align-items: center; gap: 5px; }
  #curtain-survey-app .csa-3d-legend i { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
</style>
</head>
<body>

<div id="curtain-survey-app">
  <div class="csa-header">
    <div class="csa-eyebrow">On-site Survey · 현장 실측</div>
    <div class="csa-title">시스템 행거장 설치 사전 실측</div>
    <div class="csa-sub">치수를 입력하면 오른쪽 3D·단면도가 바로 갱신됩니다. 방마다 저장해 여러 곳을 기록하세요.</div>
    <div class="csa-linked-banner" id="csa-linked-banner"></div>
  </div>

  <div class="csa-body">
    <!-- 3D PREVIEW: full width, above the form/diagrams split -->
    <div class="csa-diagram-card csa-3d-card">
      <div class="csa-diagram-title">3D 미리보기</div>
      <div class="csa-diagram-desc">숫자를 탭하면 그 자리에서 값을 바로 고칠 수 있습니다. 지붕은 내부가 보이도록 생략했습니다.</div>
      <div class="csa-3d-wrap" id="csa-3d-wrap">
        <div class="csa-3d-toolbar" id="csa-3d-toolbar">
          <button type="button" class="csa-3d-chip" id="csa-chip-window">창문</button>
          <button type="button" class="csa-3d-chip" id="csa-chip-box">커튼박스</button>
          <button type="button" class="csa-3d-chip" id="csa-chip-door">문</button>
          <button type="button" class="csa-3d-chip" id="csa-chip-ac">에어컨</button>
          <button type="button" class="csa-3d-chip" id="csa-chip-appliance">가전</button>
        </div>
        <div class="csa-3d-toolbar-sub" id="csa-3d-door-walls" style="display:none;">
          <button type="button" class="csa-3d-chip mini" data-wall="left">D벽</button>
          <button type="button" class="csa-3d-chip mini" data-wall="right">B벽</button>
          <button type="button" class="csa-3d-chip mini" data-wall="front">C벽</button>
        </div>
        <div class="csa-3d-dimfilter" id="csa-3d-dimfilter">
          <button type="button" class="csa-3d-chip mini on" data-cat="all">전체</button>
          <button type="button" class="csa-3d-chip mini" data-cat="core">기본</button>
          <button type="button" class="csa-3d-chip mini" data-cat="box">박스</button>
          <button type="button" class="csa-3d-chip mini" data-cat="window">창문</button>
          <button type="button" class="csa-3d-chip mini" data-cat="door">문</button>
          <button type="button" class="csa-3d-chip mini" data-cat="ac">에어컨</button>
          <button type="button" class="csa-3d-chip mini" data-cat="appliance">가전</button>
        </div>
        <div class="csa-3d-labels" id="csa-3d-labels"></div>
        <div class="csa-3d-hint" id="csa-3d-hint">숫자 탭: 값 입력 · 드래그: 회전 · 스크롤: 확대</div>
      </div>
      <div class="csa-3d-legend">
        <span><i style="background:#14213D; border-radius:50%;"></i>벽면 A·B·C·D</span>
        <span><i style="background:#2E8FA6; border-radius:50%;"></i>보는 위치(방 중앙)</span>
        <span><i style="background:#E07B1E;"></i>커튼박스 구간(고천장)</span>
        <span><i style="background:#8FC1D6;"></i>창문</span>
        <span><i style="background:#8A94A0;"></i>손잡이</span>
        <span><i style="background:#C94F4F;"></i>문 위치</span>
        <span><i style="background:#DCE3E8; border:1px solid #B9C3CC;"></i>천장 에어컨</span>
        <span><i style="background:#8A7CA8;"></i>가전·가구</span>
      </div>
      <div id="csa-pole-note"></div>
    </div>

    <div class="csa-diagram-card csa-3d-card">
      <div class="csa-diagram-title">벽면별 도면 (A·B·C·D)</div>
      <div class="csa-diagram-desc">각 벽면을 정면에서 바라본 도면입니다. 3D 미리보기의 A·B·C·D 배지와 같은 벽면입니다 (꺼둔 벽은 "벽 없음"으로 표시).</div>
      <div class="csa-wall-grid">
        <div class="csa-wall-card"><svg id="csa-svg-wall-a" viewBox="0 0 320 260"></svg></div>
        <div class="csa-wall-card"><svg id="csa-svg-wall-b" viewBox="0 0 320 260"></svg></div>
        <div class="csa-wall-card"><svg id="csa-svg-wall-c" viewBox="0 0 320 260"></svg></div>
        <div class="csa-wall-card"><svg id="csa-svg-wall-d" viewBox="0 0 320 260"></svg></div>
      </div>
    </div>

    <div class="csa-diagram-card csa-3d-card">
      <div class="csa-diagram-title">평면도 (위에서 본 도면)</div>
      <div class="csa-diagram-desc">방을 위에서 내려다본 배치도입니다. 벽면 기호(A·B·C·D)는 3D·벽면 도면과 같습니다.</div>
      <svg id="csa-svg-plan" viewBox="0 0 520 380" style="width:100%; height:auto; background:#FBFDFE; border-radius:8px;"></svg>
    </div>

    <!-- LEFT: FORM -->
    <div>
      <div class="csa-panel">
        <div class="csa-panel-title"><span class="num">1</span>위치</div>

        <label class="csa-field" style="margin-bottom:0;">
          <div class="csa-field-label">위치 이름</div>
          <input type="text" id="csa-name" placeholder="예: 안방">
        </label>

        <div class="csa-hidden-io">
          <input type="number" id="csa-width" value="3000">
          <input type="number" id="csa-depth">
          <input type="number" id="csa-ceiling" value="2400">
        </div>
        <div class="csa-tap3d-hint">가로·세로·천고는 오른쪽 3D 화면의 숫자를 탭해서 입력하세요.</div>
      </div>

      <div class="csa-panel">
        <div class="csa-panel-title"><span class="num">2</span>현장 사진 (최대 5장)</div>
        <div class="csa-photo-grid" id="csa-photo-grid"></div>
        <input type="file" id="csa-photo-input" accept="image/*" capture="environment" multiple style="display:none;">
        <div class="csa-tap3d-hint">저장하면 측정값과 함께 사진도 같이 보관됩니다 (자동으로 용량을 줄여서 저장, 최대 5장).</div>
      </div>

      <div class="csa-panel">
        <div class="csa-panel-title"><span class="num">3</span>커튼박스 구간 (천장이 더 높은 부분)</div>
        <div class="csa-toggle-row">
          <span class="csa-toggle-label">커튼박스 구간 있음</span>
          <label class="csa-switch">
            <input type="checkbox" id="csa-hasbox" checked>
            <span class="track"></span><span class="knob"></span>
          </label>
        </div>
        <div class="csa-sub-field" id="csa-box-sub">
          <div class="csa-hidden-io"><input type="number" id="csa-boxceiling"><input type="number" id="csa-boxwidth"><input type="number" id="csa-boxspan"><input type="number" id="csa-boxoffsetx"></div>
          <div class="csa-tap3d-hint" style="margin-top:6px;">천고·폭(창문벽에서 떨어진 거리)·길이(벽을 따라 뻗는 범위)·위치(좌측벽에서 거리) 값은 3D 화면에서 탭해서 입력하세요. 기둥을 이 구간에 세우면 일반 천고보다 더 높게 설치할 수 있어 별도로 확인합니다.</div>
        </div>
      </div>

      <div class="csa-panel">
        <div class="csa-panel-title"><span class="num">4</span>벽</div>
        <div class="csa-toggle-row">
          <span class="csa-toggle-label">창문벽 (뒷벽)</span>
          <label class="csa-switch">
            <input type="checkbox" id="csa-wallback" checked>
            <span class="track"></span><span class="knob"></span>
          </label>
        </div>
        <div class="csa-toggle-row">
          <span class="csa-toggle-label">맞은편벽 (앞벽)</span>
          <label class="csa-switch">
            <input type="checkbox" id="csa-wallfront" checked>
            <span class="track"></span><span class="knob"></span>
          </label>
        </div>
        <div class="csa-toggle-row">
          <span class="csa-toggle-label">좌측벽</span>
          <label class="csa-switch">
            <input type="checkbox" id="csa-wallleft" checked>
            <span class="track"></span><span class="knob"></span>
          </label>
        </div>
        <div class="csa-toggle-row">
          <span class="csa-toggle-label">우측벽</span>
          <label class="csa-switch">
            <input type="checkbox" id="csa-wallright" checked>
            <span class="track"></span><span class="knob"></span>
          </label>
        </div>
        <div class="csa-tap3d-hint" style="margin-top:6px;">벽 없이 트인 곳에 설치하는 경우, 해당 벽을 꺼서 3D에서 숨길 수 있습니다.</div>
      </div>

      <div class="csa-panel">
        <div class="csa-panel-title"><span class="num">5</span>창문</div>
        <div class="csa-toggle-row">
          <span class="csa-toggle-label">창문 있음</span>
          <label class="csa-switch">
            <input type="checkbox" id="csa-winenabled" checked>
            <span class="track"></span><span class="knob"></span>
          </label>
        </div>
        <div class="csa-sub-field" id="csa-winenabled-sub">
          <div class="csa-hidden-io" style="margin-top:6px;">
            <input type="number" id="csa-winwidth"><input type="number" id="csa-winheight">
            <input type="number" id="csa-winsill"><input type="number" id="csa-winoffsetx">
          </div>
          <div class="csa-tap3d-hint">창문 폭·높이·하단 높이·좌측벽에서 거리는 3D 화면에서 탭해서 입력하세요.</div>

          <div class="csa-toggle-row" style="margin-top:10px; border-top:1px solid var(--paper-line); padding-top:14px;">
            <span class="csa-toggle-label">창문(새시)이 벽면보다 튀어나옴</span>
            <label class="csa-switch">
              <input type="checkbox" id="csa-winprot">
              <span class="track"></span><span class="knob"></span>
            </label>
          </div>
          <div class="csa-sub-field" id="csa-win-sub">
            <div class="csa-hidden-io"><input type="number" id="csa-windepth"></div>
            <div class="csa-tap3d-hint">돌출 깊이는 3D 화면에서 탭해서 입력하세요.</div>
          </div>

          <div class="csa-toggle-row">
            <span class="csa-toggle-label">손잡이가 많이 튀어나옴</span>
            <label class="csa-switch">
              <input type="checkbox" id="csa-handleprot">
              <span class="track"></span><span class="knob"></span>
            </label>
          </div>
          <div class="csa-sub-field" id="csa-handle-sub">
            <div class="csa-hidden-io"><input type="number" id="csa-handledepth"><input type="number" id="csa-handleheight"></div>
            <div class="csa-tap3d-hint">추가 돌출 깊이·바닥에서 손잡이까지 높이는 3D 화면에서 탭해서 입력하세요.</div>
          </div>
        </div>
      </div>

      <div class="csa-panel">
        <div class="csa-panel-title"><span class="num">6</span>천장 에어컨</div>
        <div class="csa-toggle-row">
          <span class="csa-toggle-label">천장 에어컨 표시</span>
          <label class="csa-switch">
            <input type="checkbox" id="csa-acenabled">
            <span class="track"></span><span class="knob"></span>
          </label>
        </div>
        <div class="csa-sub-field" id="csa-ac-sub">
          <div class="csa-hidden-io">
            <input type="number" id="csa-acwidth"><input type="number" id="csa-acdepth">
            <input type="number" id="csa-acoffsetx"><input type="number" id="csa-acoffsetz">
            <input type="number" id="csa-acthick">
          </div>
          <div class="csa-tap3d-hint">보통 창문벽 천장에 붙어있는 형태로 표시됩니다. 가로·세로 폭, 천장에서 아래로 돌출한 두께, 좌측벽·창문벽에서 거리는 3D 화면에서 탭해서 입력하세요.</div>
        </div>
      </div>

      <div class="csa-panel">
        <div class="csa-panel-title"><span class="num">7</span>가전·가구 (냉장고, 스타일러 등)</div>
        <div class="csa-hidden-io"><input type="checkbox" id="csa-appliancevisible"></div>
        <div id="csa-appliance-list"></div>
        <button type="button" class="csa-btn csa-btn-ghost" id="csa-appliance-add" style="width:100%; margin-top:6px;">+ 항목 추가</button>
        <div class="csa-tap3d-hint" style="margin-top:8px;">이름은 여기서 입력하고, 3D 화면 우측 상단 "가전" 버튼을 켜면 보입니다. 가로·세로·높이·위치는 3D 화면에서 탭해서 입력하세요.</div>
      </div>

      <div class="csa-panel">
        <div class="csa-panel-title"><span class="num">8</span>문(출입구) 위치</div>
        <div class="csa-toggle-row">
          <span class="csa-toggle-label">문 표시</span>
          <label class="csa-switch">
            <input type="checkbox" id="csa-door" checked>
            <span class="track"></span><span class="knob"></span>
          </label>
        </div>
        <div class="csa-sub-field" id="csa-door-sub">
          <div class="csa-hidden-io">
            <select id="csa-doorwall">
              <option value="left">left</option>
              <option value="right">right</option>
              <option value="front">front</option>
            </select>
            <input type="number" id="csa-dooroffset">
            <input type="number" id="csa-doorwidth">
            <input type="number" id="csa-doorheight">
          </div>
          <div class="csa-tap3d-hint" style="margin-top:6px;">문이 있는 벽은 3D 화면 우측 상단 "문" 버튼 아래 D·B·C 버튼으로 고르고, 폭·높이·거리는 3D 화면에서 탭해서 입력하세요.</div>
        </div>
      </div>

      <div class="csa-panel">
        <div class="csa-panel-title"><span class="num">9</span>메모</div>
        <textarea class="csa-memo" id="csa-memo" placeholder="현장 특이사항, 콘센트 위치 등"></textarea>
      </div>

      <div class="csa-btn-row">
        <button class="csa-btn csa-btn-primary" id="csa-save">이 방 저장</button>
        <button class="csa-btn csa-btn-ghost" id="csa-new">새로 측정</button>
      </div>
      <div class="csa-status" id="csa-status">&nbsp;</div>
    </div>

    <!-- RIGHT: DIAGRAMS -->
    <div>
      <div class="csa-diagram-card">
        <div class="csa-diagram-title">돌출 단면도 · 벽면 기준 깊이</div>
        <div class="csa-diagram-desc">벽면을 0으로 두고, 창문·손잡이 돌출 깊이를 비교합니다.</div>
        <svg id="csa-svg-depth" viewBox="0 0 400 220"></svg>
        <div id="csa-depth-note"></div>
      </div>
    </div>

    <!-- SAVED LIST -->
    <div class="csa-list-panel">
      <div class="csa-list-header">
        <div class="csa-panel-title" style="margin-bottom:0;"><span class="num">✓</span>저장된 방 (<span id="csa-count">0</span>)</div>
        <button class="csa-btn csa-btn-ghost csa-export-all" id="csa-export-all" style="display:none;">전체 파일로 내보내기</button>
      </div>
      <div id="csa-list"></div>
    </div>
  </div>

  <div class="csa-lightbox" id="csa-lightbox">
    <div class="csa-lightbox-close" id="csa-lightbox-close">✕</div>
    <img id="csa-lightbox-img" alt="확대 사진">
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- Firebase (Firestore) — shared "저장된 방" storage across every device -->
<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js"></script>
<script>
  const firebaseConfig = {
    apiKey: "AIzaSyB09DJJw1Q2Vm0xW5IvnSCaIQEja5PHwYk",
    authDomain: "hanger-survey.firebaseapp.com",
    projectId: "hanger-survey",
    storageBucket: "hanger-survey.firebasestorage.app",
    messagingSenderId: "1026732408882",
    appId: "1:1026732408882:web:fb02c65ed129548709bc2b",
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const COLLECTION = 'hanger_survey_kv';

  window.storage = {
    async get(key) {
      const snap = await db.collection(COLLECTION).doc(key).get();
      if (!snap.exists) throw new Error('Key not found: ' + key);
      return { key, value: snap.data().value };
    },
    async set(key, value) {
      await db.collection(COLLECTION).doc(key).set({ value, updatedAt: Date.now() });
      return { key, value };
    },
    async delete(key) {
      await db.collection(COLLECTION).doc(key).delete();
      return { key, deleted: true };
    },
    async list(prefix) {
      const snap = await db.collection(COLLECTION).get();
      const keys = [];
      snap.forEach((doc) => {
        if (!prefix || doc.id.indexOf(prefix) === 0) keys.push(doc.id);
      });
      return { keys };
    },
  };
</script>
<script>
(function () {
  const root = document.getElementById('curtain-survey-app');
  const $ = (sel) => root.querySelector(sel);

  // ---------- Linked job (from 통합보드) ----------
  const urlParams = new URLSearchParams(location.search);
  const linkedJobId = urlParams.get('jobId') || null;
  const linkedName = urlParams.get('name') || '';
  let autoSelected = false;

  const el = {
    name: $('#csa-name'),
    width: $('#csa-width'),
    depth: $('#csa-depth'),
    ceiling: $('#csa-ceiling'),
    photoInput: $('#csa-photo-input'),
    photoGrid: $('#csa-photo-grid'),
    lightbox: $('#csa-lightbox'),
    lightboxImg: $('#csa-lightbox-img'),
    lightboxClose: $('#csa-lightbox-close'),
    linkedBanner: $('#csa-linked-banner'),
    chipWindow: $('#csa-chip-window'),
    chipBox: $('#csa-chip-box'),
    chipDoor: $('#csa-chip-door'),
    chipAc: $('#csa-chip-ac'),
    chipAppliance: $('#csa-chip-appliance'),
    applianceVisible: $('#csa-appliancevisible'),
    doorWallsRow: $('#csa-3d-door-walls'),
    dimFilterRow: $('#csa-3d-dimfilter'),
    svgPlan: $('#csa-svg-plan'),
    hasbox: $('#csa-hasbox'),
    boxSub: $('#csa-box-sub'),
    boxceiling: $('#csa-boxceiling'),
    boxwidth: $('#csa-boxwidth'),
    boxspan: $('#csa-boxspan'),
    boxoffsetx: $('#csa-boxoffsetx'),
    wallback: $('#csa-wallback'),
    wallfront: $('#csa-wallfront'),
    wallleft: $('#csa-wallleft'),
    wallright: $('#csa-wallright'),
    winenabled: $('#csa-winenabled'),
    winEnabledSub: $('#csa-winenabled-sub'),
    winprot: $('#csa-winprot'),
    winSub: $('#csa-win-sub'),
    windepth: $('#csa-windepth'),
    winwidth: $('#csa-winwidth'),
    winheight: $('#csa-winheight'),
    winsill: $('#csa-winsill'),
    winoffsetx: $('#csa-winoffsetx'),
    handleprot: $('#csa-handleprot'),
    handleSub: $('#csa-handle-sub'),
    handledepth: $('#csa-handledepth'),
    handleheight: $('#csa-handleheight'),
    door: $('#csa-door'),
    doorSub: $('#csa-door-sub'),
    doorwall: $('#csa-doorwall'),
    dooroffset: $('#csa-dooroffset'),
    doorwidth: $('#csa-doorwidth'),
    doorheight: $('#csa-doorheight'),
    acenabled: $('#csa-acenabled'),
    acSub: $('#csa-ac-sub'),
    acwidth: $('#csa-acwidth'),
    acdepth: $('#csa-acdepth'),
    acoffsetx: $('#csa-acoffsetx'),
    acoffsetz: $('#csa-acoffsetz'),
    acthick: $('#csa-acthick'),
    applianceList: $('#csa-appliance-list'),
    applianceAdd: $('#csa-appliance-add'),
    memo: $('#csa-memo'),
    save: $('#csa-save'),
    newBtn: $('#csa-new'),
    status: $('#csa-status'),
    svgDepth: $('#csa-svg-depth'),
    svgWallA: $('#csa-svg-wall-a'),
    svgWallB: $('#csa-svg-wall-b'),
    svgWallC: $('#csa-svg-wall-c'),
    svgWallD: $('#csa-svg-wall-d'),
    depthNote: $('#csa-depth-note'),
    poleNote: $('#csa-pole-note'),
    list: $('#csa-list'),
    count: $('#csa-count'),
    exportAll: $('#csa-export-all'),
  };

  let currentId = null;
  let currentPhotos = []; // array of data URL strings, max 5
  const MAX_PHOTOS = 5;
  let currentAppliances = []; // array of {id, name, width, depth, height, offsetX, offsetZ}, max 4
  const MAX_APPLIANCES = 4;
  let applianceSeq = 0;
  let activeDimFilter = 'all'; // 'all' | 'core' | 'box' | 'window' | 'door' | 'ac' | 'appliance'
  function catOn(cat) { return activeDimFilter === 'all' || activeDimFilter === cat; }

  if (linkedJobId) {
    el.linkedBanner.textContent = '📋 통합보드 주문과 연결됨' + (linkedName ? ` — ${linkedName}` : '') + '. 저장하면 이 주문에 실측 기록으로 남습니다.';
    el.linkedBanner.classList.add('show');
  }

  function updateApplianceRows() {
    el.applianceList.innerHTML = '';
    currentAppliances.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'csa-appliance-row';
      row.innerHTML = `
        <input type="text" value="${escapeHtml(item.name || '')}" placeholder="예: 냉장고, 스타일러" data-id="${item.id}">
        <button type="button" class="csa-appliance-del" data-id="${item.id}" title="삭제">✕</button>
      `;
      row.querySelector('input').addEventListener('input', (e) => {
        item.name = e.target.value;
      });
      row.querySelector('.csa-appliance-del').addEventListener('click', () => {
        currentAppliances = currentAppliances.filter((a) => a.id !== item.id);
        updateApplianceRows();
        render();
      });
      el.applianceList.appendChild(row);
    });
    el.applianceAdd.style.display = currentAppliances.length >= MAX_APPLIANCES ? 'none' : 'block';
  }

  function num(v) {
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
  }

  function updatePhotoGrid() {
    el.photoGrid.innerHTML = '';
    currentPhotos.forEach((src, i) => {
      const tile = document.createElement('div');
      tile.className = 'csa-photo-tile';
      tile.innerHTML = `<img src="${src}" alt=""><div class="csa-photo-del" data-i="${i}">✕</div>`;
      el.photoGrid.appendChild(tile);
    });
    if (currentPhotos.length < MAX_PHOTOS) {
      const add = document.createElement('div');
      add.className = 'csa-photo-add';
      add.textContent = '+';
      add.title = '사진 촬영/선택';
      add.addEventListener('click', () => el.photoInput.click());
      el.photoGrid.appendChild(add);
    }
  }

  function openLightbox(src) {
    el.lightboxImg.src = src;
    el.lightbox.classList.add('open');
  }

  function closeLightbox() {
    el.lightbox.classList.remove('open');
    el.lightboxImg.src = '';
  }

  function resizeImageFile(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'));
        img.onload = () => {
          let w = img.width, h = img.height;
          if (w > h && w > maxDim) { h = Math.round(h * maxDim / w); w = maxDim; }
          else if (h > maxDim) { w = Math.round(w * maxDim / h); h = maxDim; }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function readState() {
    return {
      name: el.name.value.trim(),
      width: num(el.width.value) ?? 3000,
      depth: num(el.depth.value),
      ceiling: num(el.ceiling.value) ?? 2400,
      photos: currentPhotos,
      hasBox: el.hasbox.checked,
      boxCeiling: num(el.boxceiling.value),
      boxWidth: num(el.boxwidth.value),
      boxSpan: num(el.boxspan.value),
      boxOffsetX: num(el.boxoffsetx.value),
      wallBack: el.wallback.checked,
      wallFront: el.wallfront.checked,
      wallLeft: el.wallleft.checked,
      wallRight: el.wallright.checked,
      winEnabled: el.winenabled.checked,
      winProt: el.winprot.checked,
      winDepth: num(el.windepth.value),
      winWidth: num(el.winwidth.value),
      winHeight: num(el.winheight.value),
      winSill: num(el.winsill.value),
      winOffsetX: num(el.winoffsetx.value),
      handleProt: el.handleprot.checked,
      handleDepth: num(el.handledepth.value),
      handleHeight: num(el.handleheight.value),
      doorEnabled: el.door.checked,
      doorWall: el.doorwall.value,
      doorOffset: num(el.dooroffset.value),
      doorWidth: num(el.doorwidth.value),
      doorHeight: num(el.doorheight.value),
      acEnabled: el.acenabled.checked,
      acWidth: num(el.acwidth.value),
      acDepth: num(el.acdepth.value),
      acOffsetX: num(el.acoffsetx.value),
      acOffsetZ: num(el.acoffsetz.value),
      acThick: num(el.acthick.value),
      appliances: currentAppliances,
      applianceVisible: el.applianceVisible.checked,
      memo: el.memo.value,
    };
  }

  function fillState(s) {
    el.name.value = s.name || '';
    el.width.value = s.width ?? 3000;
    el.depth.value = s.depth ?? '';
    el.ceiling.value = s.ceiling ?? 2400;
    currentPhotos = Array.isArray(s.photos) ? s.photos.slice(0, MAX_PHOTOS)
      : (s.photo ? [s.photo] : []); // backward-compat with older single-photo records
    updatePhotoGrid();
    el.hasbox.checked = s.hasBox !== false;
    el.boxceiling.value = s.boxCeiling ?? '';
    el.boxwidth.value = s.boxWidth ?? '';
    el.boxspan.value = s.boxSpan ?? '';
    el.boxoffsetx.value = s.boxOffsetX ?? '';
    el.wallback.checked = s.wallBack !== false;
    el.wallfront.checked = s.wallFront !== false;
    el.wallleft.checked = s.wallLeft !== false;
    el.wallright.checked = s.wallRight !== false;
    el.winenabled.checked = s.winEnabled !== false;
    el.winprot.checked = !!s.winProt;
    el.windepth.value = s.winDepth ?? '';
    el.winwidth.value = s.winWidth ?? '';
    el.winheight.value = s.winHeight ?? '';
    el.winsill.value = s.winSill ?? '';
    el.winoffsetx.value = s.winOffsetX ?? '';
    el.handleprot.checked = !!s.handleProt;
    el.handledepth.value = s.handleDepth ?? '';
    el.handleheight.value = s.handleHeight ?? '';
    el.door.checked = s.doorEnabled !== false;
    el.doorwall.value = s.doorWall || 'left';
    el.dooroffset.value = s.doorOffset ?? '';
    el.doorwidth.value = s.doorWidth ?? '';
    el.doorheight.value = s.doorHeight ?? '';
    el.acenabled.checked = !!s.acEnabled;
    el.acwidth.value = s.acWidth ?? '';
    el.acdepth.value = s.acDepth ?? '';
    el.acoffsetx.value = s.acOffsetX ?? '';
    el.acoffsetz.value = s.acOffsetZ ?? '';
    el.acthick.value = s.acThick ?? '';
    currentAppliances = Array.isArray(s.appliances) ? s.appliances : [];
    el.applianceVisible.checked = !!s.applianceVisible;
    updateApplianceRows();
    el.memo.value = s.memo || '';
    syncSubFields();
    render();
  }

  function clearForm() {
    currentId = null;
    fillState({ name: linkedName || '' });
    el.status.textContent = linkedJobId
      ? '새 실측 기록입니다. 저장하면 통합보드의 이 주문과 자동으로 연결됩니다.'
      : '새 방을 측정 중입니다. 3D 화면의 숫자를 탭해서 실제 값으로 바꿔주세요.';
  }

  function syncSubFields() {
    el.boxSub.classList.toggle('open', el.hasbox.checked);
    el.winEnabledSub.classList.toggle('open', el.winenabled.checked);
    el.winSub.classList.toggle('open', el.winprot.checked);
    el.handleSub.classList.toggle('open', el.handleprot.checked);
    el.doorSub.classList.toggle('open', el.door.checked);
    el.acSub.classList.toggle('open', el.acenabled.checked);
  }

  // ---------- SVG helpers ----------
  const SVGNS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs) {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function clear(svg) { while (svg.firstChild) svg.removeChild(svg.firstChild); }

  function dimLine(svg, x1, y1, x2, y2, label, opts) {
    opts = opts || {};
    const color = opts.color || '#5C7089';
    const g = svgEl('g', {});
    g.appendChild(svgEl('line', { x1, y1, x2, y2, stroke: color, 'stroke-width': 1.2 }));
    // ticks
    const isVert = Math.abs(x2 - x1) < 0.5;
    const tickLen = 5;
    if (isVert) {
      g.appendChild(svgEl('line', { x1: x1 - tickLen, y1, x2: x1 + tickLen, y2: y1, stroke: color, 'stroke-width': 1.2 }));
      g.appendChild(svgEl('line', { x1: x2 - tickLen, y1: y2, x2: x2 + tickLen, y2: y2, stroke: color, 'stroke-width': 1.2 }));
    } else {
      g.appendChild(svgEl('line', { x1, y1: y1 - tickLen, x2: x1, y2: y1 + tickLen, stroke: color, 'stroke-width': 1.2 }));
      g.appendChild(svgEl('line', { x1: x2, y1: y2 - tickLen, x2: x2, y2: y2 + tickLen, stroke: color, 'stroke-width': 1.2 }));
    }
    if (label) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const t = svgEl('text', {
        x: isVert ? midX + 8 : midX,
        y: isVert ? midY + 4 : midY - 8,
        fill: color,
        'font-size': 11,
        'font-family': "'IBM Plex Mono', monospace",
        'text-anchor': isVert ? 'start' : 'middle',
      });
      t.textContent = label;
      g.appendChild(t);
    }
    svg.appendChild(g);
  }

  function updatePoleNote(s) {
    if (!s.hasBox) { el.poleNote.innerHTML = ''; return; }
    const boxCeilingEff = s.boxCeiling != null ? s.boxCeiling : (s.ceiling + 300);
    const extraHeight = boxCeilingEff - s.ceiling;
    el.poleNote.innerHTML = `<div class="csa-note info">기둥 제작 길이 — 일반 구간 ${s.ceiling.toFixed(0)}mm · 커튼박스 구간 ${boxCeilingEff.toFixed(0)}mm (커튼박스 구간은 ${extraHeight >= 0 ? '+' + extraHeight.toFixed(0) : extraHeight.toFixed(0)}mm 더 긴 기둥 필요)</div>`;
  }

  function renderDepth(s) {
    const svg = el.svgDepth;
    clear(svg);
    const W = 400, H = 220;
    const originX = 60, axisY = 190;

    const winD = s.winProt ? (s.winDepth || 0) : 0;
    const handleD = s.handleProt ? (s.handleDepth || 0) : 0;
    const totalObstruction = winD + handleD;

    const maxVal = Math.max(totalObstruction, 20);
    const usableW = W - originX - 40;
    const scale = usableW / maxVal;

    if (!s.winProt && !s.handleProt) {
      const t = svgEl('text', { x: W/2, y: H/2, 'text-anchor': 'middle', fill: '#9AAAC0', 'font-size': 13, 'font-family': 'Inter' });
      t.textContent = '돌출부를 켜면 표시됩니다';
      svg.appendChild(t);
      el.depthNote.innerHTML = '';
      return;
    }

    // wall (origin)
    svg.appendChild(svgEl('line', { x1: originX, y1: 30, x2: originX, y2: axisY, stroke: '#14213D', 'stroke-width': 2.5 }));
    const wallLbl = svgEl('text', { x: originX, y: 22, fill: '#14213D', 'font-size': 11, 'font-weight': 700, 'text-anchor': 'middle', 'font-family': "'IBM Plex Mono', monospace" });
    wallLbl.textContent = '벽면 (0mm)';
    svg.appendChild(wallLbl);

    const rows = [];
    let cursor = 0;
    if (s.winProt) {
      rows.push({ label: '창문 돌출', from: 0, to: winD, color: '#1F8A8F' });
      cursor = winD;
    }
    if (s.handleProt) {
      rows.push({ label: '손잡이 (누적)', from: cursor, to: cursor + handleD, color: '#E07B1E' });
      cursor = cursor + handleD;
    }

    const rowH = 34;
    let y = 55;
    rows.forEach((r) => {
      const x1 = originX + r.from * scale;
      const x2 = originX + r.to * scale;
      svg.appendChild(svgEl('rect', { x: x1, y: y - 9, width: Math.max(x2 - x1, 2), height: 18, fill: r.color + '33', stroke: r.color, 'stroke-width': 1.5, rx: 3 }));
      const lbl = svgEl('text', { x: x1 + 4, y: y - 13, fill: r.color, 'font-size': 10.5, 'font-family': "'IBM Plex Mono', monospace" });
      lbl.textContent = r.label + ' +' + (r.to - r.from).toFixed(0) + 'mm';
      svg.appendChild(lbl);
      y += rowH;
    });

    // axis
    svg.appendChild(svgEl('line', { x1: originX, y1: axisY, x2: W - 20, y2: axisY, stroke: '#5C7089', 'stroke-width': 1 }));
    dimLine(svg, originX, axisY + 20, originX + totalObstruction * scale, axisY + 20, '총 돌출 ' + totalObstruction.toFixed(0) + 'mm', { color: '#5C7089' });

    el.depthNote.innerHTML = '';
  }

  function renderWallElevation(svg, wallKey, s) {
    clear(svg);
    const VW = 320, VH = 260;
    const padL = 70, padR = 24, padT = 30, padB = 60;
    const areaW = VW - padL - padR, areaH = VH - padT - padB;

    const isEnabled = wallKey === 'A' ? s.wallBack !== false
      : wallKey === 'C' ? s.wallFront !== false
      : wallKey === 'D' ? s.wallLeft !== false
      : s.wallRight !== false;

    const letterLbl = svgEl('text', { x: 12, y: 20, fill: '#14213D', 'font-size': 13, 'font-weight': 700, 'font-family': "'IBM Plex Mono', monospace" });
    letterLbl.textContent = wallKey;
    svg.appendChild(letterLbl);

    if (!isEnabled) {
      const t = svgEl('text', { x: VW / 2, y: VH / 2, 'text-anchor': 'middle', fill: '#9AAAC0', 'font-size': 12.5, 'font-family': 'Inter' });
      t.textContent = '벽 없음';
      svg.appendChild(t);
      return;
    }

    // span (horizontal extent) depends on which wall: A/C run along the room width, B/D along the depth
    const span = (wallKey === 'A' || wallKey === 'C') ? s.width
      : (s.depth != null ? s.depth : 4000);
    const boxCeilingEff = s.hasBox ? (s.boxCeiling != null ? s.boxCeiling : s.ceiling + 300) : s.ceiling;
    const boxExtraMm = boxCeilingEff - s.ceiling;
    const boxShownOnThisWall = s.hasBox && wallKey !== 'C';
    const topHeight = boxShownOnThisWall ? Math.max(s.ceiling, boxCeilingEff) : s.ceiling;

    const scale = Math.min(areaW / span, areaH / topHeight);
    const wallPxW = span * scale, wallPxH = s.ceiling * scale;
    const x0 = padL + (areaW - span * scale) / 2;
    const floorY = padT + areaH;
    const ceilY = floorY - wallPxH;
    const x1 = x0 + wallPxW;

    // floor + wall outline
    svg.appendChild(svgEl('line', { x1: x0 - 6, y1: floorY, x2: x1 + 6, y2: floorY, stroke: '#14213D', 'stroke-width': 2 }));
    svg.appendChild(svgEl('rect', { x: x0, y: ceilY, width: wallPxW, height: wallPxH, fill: '#F1EDE4', stroke: '#14213D', 'stroke-width': 1.5 }));

    // helper for placing things measured "from the wall-A corner" along a wall's span axis.
    // Standing at the room's center and turning to face each wall in turn: facing A, right hand
    // points toward B; facing B, right hand points toward C — both "natural" (offset 0 at the
    // left edge). But facing C, right hand points toward D, and facing D, right hand points
    // toward A — both mirrored relative to their own wall's natural axis (offset 0 at the right
    // edge instead). C and D are drawn mirrored so the picture matches what you'd actually see
    // standing in the middle of the room and turning to look at each wall.
    const mirrored = wallKey === 'C' || wallKey === 'D';
    const cornerX = mirrored ? x1 : x0;
    function spanRect(offsetMm, widthMm) {
      const w = widthMm * scale;
      const x = mirrored ? cornerX - offsetMm * scale - w : cornerX + offsetMm * scale;
      return { x, w, nearCornerEdge: mirrored ? x + w : x, farEdge: mirrored ? x : x + w };
    }

    // curtain box: full notch on A (its own wall) only; a small corner notch on B/D showing how far
    // the box reaches out from the A corner along the side wall. C never shows box-related dimensions.
    if (boxShownOnThisWall) {
      const extraPx = Math.max(boxExtraMm * scale, 2);
      const extraLabelText = (boxExtraMm >= 0 ? '+' : '') + boxExtraMm.toFixed(0);
      const boxProtrudeMm = s.boxWidth != null ? s.boxWidth : 150;

      if (wallKey === 'A') {
        const boxSpanMm = Math.min(s.boxSpan != null ? s.boxSpan : s.width, s.width);
        const boxPxW = boxSpanMm * scale;
        const boxOffsetMm = s.boxOffsetX != null ? Math.max(Math.min(s.boxOffsetX, s.width - boxSpanMm), 0) : (s.width - boxSpanMm) / 2;
        const bx = x0 + boxOffsetMm * scale;
        const by = ceilY - extraPx;
        svg.appendChild(svgEl('rect', {
          x: bx, y: by, width: boxPxW, height: extraPx,
          fill: '#E07B1E33', stroke: '#E07B1E', 'stroke-width': 1.3, 'stroke-dasharray': '3 2',
        }));
        const midY = by + Math.min(extraPx / 2, extraPx - 2);
        const bl1 = svgEl('text', { x: bx + boxPxW / 2, y: midY - 5, 'text-anchor': 'middle', fill: '#B45E12', 'font-size': 10, 'font-weight': 700, 'font-family': "'IBM Plex Mono', monospace" });
        bl1.textContent = boxCeilingEff.toFixed(0) + 'mm(' + extraLabelText + ')';
        svg.appendChild(bl1);
        const bl2 = svgEl('text', { x: bx + boxPxW / 2, y: midY + 8, 'text-anchor': 'middle', fill: '#B45E12', 'font-size': 9.5, 'font-family': "'IBM Plex Mono', monospace" });
        bl2.textContent = '박스폭 ' + boxProtrudeMm.toFixed(0) + 'mm';
        svg.appendChild(bl2);
        // position of the box along the wall, as a dimension line from the left wall to its near edge
        dimLine(svg, x0, floorY + 16, bx, floorY + 16, boxOffsetMm.toFixed(0) + 'mm', { color: '#E07B1E' });
      } else {
        // B and D: corner notch nearest wall A, width = box protrusion (D is mirrored, see spanRect)
        const r = spanRect(0, Math.min(boxProtrudeMm, span));
        const by = ceilY - extraPx;
        svg.appendChild(svgEl('rect', {
          x: r.x, y: by, width: r.w, height: extraPx,
          fill: '#E07B1E33', stroke: '#E07B1E', 'stroke-width': 1.3, 'stroke-dasharray': '3 2',
        }));
        const labelX = r.farEdge + (mirrored ? -4 : 4);
        const anchor = mirrored ? 'end' : 'start';
        const bl1 = svgEl('text', { x: labelX, y: by + extraPx / 2 - 2, 'text-anchor': anchor, fill: '#B45E12', 'font-size': 9.5, 'font-weight': 700, 'font-family': "'IBM Plex Mono', monospace" });
        bl1.textContent = '폭' + boxProtrudeMm.toFixed(0);
        svg.appendChild(bl1);
        const bl2 = svgEl('text', { x: labelX, y: by + extraPx / 2 + 10, 'text-anchor': anchor, fill: '#B45E12', 'font-size': 9.5, 'font-family': "'IBM Plex Mono', monospace" });
        bl2.textContent = extraLabelText;
        svg.appendChild(bl2);
      }
    }

    // window, only on wall A — size and position shown as proper dimension lines
    let extraDimRow = false; // whether an inner dimension row was drawn (pushes the outer span dim further out)
    if (wallKey === 'A' && s.winEnabled !== false) {
      const winWidthMm = s.winWidth != null ? s.winWidth : s.width * 0.5;
      const winHeightMm = s.winHeight != null ? s.winHeight : s.ceiling * 0.5;
      const winSillMm = s.winSill != null ? s.winSill : s.ceiling * 0.25;
      const winOffsetMm = s.winOffsetX != null ? s.winOffsetX : (s.width - winWidthMm) / 2;
      const wx = x0 + winOffsetMm * scale;
      const wPxW = winWidthMm * scale, wPxH = winHeightMm * scale;
      const wy = floorY - (winSillMm + winHeightMm) * scale;
      svg.appendChild(svgEl('rect', {
        x: wx, y: wy, width: wPxW, height: wPxH,
        fill: '#8FC1D655', stroke: '#2E8FA6', 'stroke-width': 1.3,
      }));

      // width, directly above the window
      dimLine(svg, wx, wy - 12, wx + wPxW, wy - 12, winWidthMm.toFixed(0) + 'mm', { color: '#2E8FA6' });
      // height, to the right of the window
      dimLine(svg, wx + wPxW + 14, wy, wx + wPxW + 14, wy + wPxH, winHeightMm.toFixed(0) + 'mm', { color: '#2E8FA6' });
      // offset from the left wall, along an inner row near the floor
      dimLine(svg, x0, floorY + 16, wx, floorY + 16, winOffsetMm.toFixed(0) + 'mm', { color: '#2E8FA6' });
      // sill height, along an inner column near the left wall
      dimLine(svg, x0 - 20, floorY, x0 - 20, wy + wPxH, winSillMm.toFixed(0) + 'mm', { color: '#2E8FA6' });
      extraDimRow = true;
    }

    // door, drawn on whichever wall it's assigned to — size and position as dimension lines
    const doorWallLetter = { left: 'D', right: 'B', front: 'C' }[s.doorWall] || 'D';
    if (s.doorEnabled && wallKey === doorWallLetter) {
      const doorOffsetMm = s.doorOffset != null ? s.doorOffset : 300;
      const doorWMm = s.doorWidth != null ? s.doorWidth : 800;
      const doorHMm = s.doorHeight != null ? s.doorHeight : 2000;
      const r = spanRect(doorOffsetMm, doorWMm);
      const dx = r.x, dPxW = r.w;
      const dPxH = doorHMm * scale;
      const dy = floorY - dPxH;
      svg.appendChild(svgEl('rect', {
        x: dx, y: dy, width: dPxW, height: dPxH,
        fill: '#C94F4F33', stroke: '#C94F4F', 'stroke-width': 1.3,
      }));

      // width, directly above the door
      dimLine(svg, dx, dy - 12, dx + dPxW, dy - 12, doorWMm + 'mm', { color: '#C94F4F' });
      // height, on whichever side has room without running off the wall's edges
      const doorHeightOnRight = dx + dPxW + 14 + 30 < x1;
      const dhx = doorHeightOnRight ? dx + dPxW + 14 : dx - 14;
      dimLine(svg, dhx, dy, dhx, dy + dPxH, doorHMm + 'mm', { color: '#C94F4F' });
      // offset from the wall's near corner, along an inner row near the floor
      dimLine(svg, cornerX, floorY + 16, r.nearCornerEdge, floorY + 16, doorOffsetMm.toFixed(0) + 'mm', { color: '#C94F4F' });
      extraDimRow = true;
    }

    // ceiling AC projection onto this wall's span axis, with span + thickness + position dimension lines
    if (s.acEnabled) {
      const acWEff = s.acWidth != null ? s.acWidth : 900;
      const acDEff = s.acDepth != null ? s.acDepth : 300;
      const acThickEff = s.acThick != null ? s.acThick : 220;
      const acXEff = s.acOffsetX != null ? s.acOffsetX : Math.round((s.width - acWEff) / 2);
      const acZEff = s.acOffsetZ != null ? s.acOffsetZ : 100;
      const spanVal = (wallKey === 'A' || wallKey === 'C') ? acWEff : acDEff;
      const offsetVal = (wallKey === 'A' || wallKey === 'C') ? acXEff : acZEff;
      const ar = spanRect(offsetVal, spanVal);
      const acPxH = Math.max(acThickEff * scale, 4); // now scaled to the real ceiling-drop thickness
      svg.appendChild(svgEl('rect', {
        x: ar.x, y: ceilY, width: ar.w, height: acPxH,
        fill: '#DCE3E888', stroke: '#8492A0', 'stroke-width': 1,
      }));
      const acLbl = svgEl('text', { x: ar.x + ar.w / 2, y: ceilY + acPxH / 2 + 3, 'text-anchor': 'middle', fill: '#5B6B78', 'font-size': 8, 'font-family': "'IBM Plex Mono', monospace" });
      acLbl.textContent = '에어컨';
      svg.appendChild(acLbl);
      // span (width or depth, whichever this wall shows) just above the unit
      dimLine(svg, ar.x, ceilY - 10, ar.x + ar.w, ceilY - 10, spanVal.toFixed(0) + 'mm', { color: '#6E8199' });
      // ceiling-drop thickness, along the side of the unit
      const acThickOnRight = ar.x + ar.w + 14 + 30 < x1;
      const athx = acThickOnRight ? ar.x + ar.w + 14 : ar.x - 14;
      dimLine(svg, athx, ceilY, athx, ceilY + acPxH, acThickEff.toFixed(0) + 'mm', { color: '#6E8199' });
      // position from this wall's corner, along the inner floor row (same row door/window use)
      dimLine(svg, cornerX, floorY + 16, ar.nearCornerEdge, floorY + 16, offsetVal.toFixed(0) + 'mm', { color: '#6E8199' });
      extraDimRow = true;
    }

    // appliances / furniture projection onto this wall's span axis, with span + height + position dims
    (s.applianceVisible ? (s.appliances || []) : []).forEach((item) => {
      const wEff = item.width != null ? item.width : 600;
      const dEff = item.depth != null ? item.depth : 600;
      const hEff = item.height != null ? item.height : 1800;
      const xEff = item.offsetX != null ? item.offsetX : 150;
      const zEff = item.offsetZ != null ? item.offsetZ : 150;
      const spanVal = (wallKey === 'A' || wallKey === 'C') ? wEff : dEff;
      const offsetVal = (wallKey === 'A' || wallKey === 'C') ? xEff : zEff;
      const ir = spanRect(offsetVal, spanVal);
      const hPx = Math.min(hEff * scale, floorY - ceilY);
      svg.appendChild(svgEl('rect', {
        x: ir.x, y: floorY - hPx, width: ir.w, height: hPx,
        fill: '#8A7CA855', stroke: '#5B4F79', 'stroke-width': 1,
      }));
      const name = item.name && item.name.trim() ? item.name.trim() : '가전';
      const lbl = svgEl('text', { x: ir.x + ir.w / 2, y: floorY - hPx - 4, 'text-anchor': 'middle', fill: '#5B4F79', 'font-size': 8, 'font-family': "'IBM Plex Mono', monospace" });
      lbl.textContent = name;
      svg.appendChild(lbl);
      // span (width or depth) just above the item's own top
      dimLine(svg, ir.x, floorY - hPx - 14, ir.x + ir.w, floorY - hPx - 14, spanVal.toFixed(0) + 'mm', { color: '#5B4F79' });
      // height, on whichever side has room without running off the wall's edges
      const heightOnRight = ir.x + ir.w + 14 + 30 < x1;
      const ahx = heightOnRight ? ir.x + ir.w + 14 : ir.x - 14;
      dimLine(svg, ahx, floorY - hPx, ahx, floorY, hEff.toFixed(0) + 'mm', { color: '#5B4F79' });
      // position from this wall's corner, along the inner floor row
      dimLine(svg, cornerX, floorY + 16, ir.nearCornerEdge, floorY + 16, offsetVal.toFixed(0) + 'mm', { color: '#5B4F79' });
      extraDimRow = true;
    });

    // dimensions: span + ceiling height, pushed one row/column further out when a window or door
    // is already using the inner row/column so nothing overlaps
    const spanDimY = floorY + (extraDimRow ? 34 : 16);
    const heightDimX = x0 - (extraDimRow ? 44 : 20);
    dimLine(svg, x0, spanDimY, x1, spanDimY, span.toFixed(0) + 'mm', { color: '#5C7089' });
    dimLine(svg, heightDimX, floorY, heightDimX, ceilY, s.ceiling.toFixed(0) + 'mm', { color: '#5C7089' });
  }

  function renderPlan(s) {
    const svg = el.svgPlan;
    clear(svg);
    const VW = 520, VH = 380;
    const leftPad = 60, rightPad = 170, topPad = 50, bottomPad = 90;
    const planW = VW - leftPad - rightPad;
    const planH = VH - topPad - bottomPad;
    const W = s.width, D = s.depth != null ? s.depth : 4000;
    const scale = Math.min(planW / W, planH / D);
    const rw = W * scale, rh = D * scale;
    const x0 = leftPad + (planW - rw) / 2, y0 = topPad + (planH - rh) / 2;
    const x1 = x0 + rw, y1 = y0 + rh;

    function wallLine(on, ax, ay, bx, by) {
      svg.appendChild(svgEl('line', {
        x1: ax, y1: ay, x2: bx, y2: by,
        stroke: '#14213D', 'stroke-width': on ? 3 : 1.5,
        'stroke-dasharray': on ? 'none' : '5 4',
        opacity: on ? 1 : 0.5,
      }));
    }
    function badge(cx, cy, letter) {
      svg.appendChild(svgEl('circle', { cx, cy, r: 12, fill: '#14213D' }));
      const t = svgEl('text', { x: cx, y: cy + 4.5, 'text-anchor': 'middle', fill: '#fff', 'font-size': 12.5, 'font-weight': 700, 'font-family': "'IBM Plex Mono', monospace" });
      t.textContent = letter;
      svg.appendChild(t);
    }

    // walls: A = top (window wall), C = bottom, D = left, B = right
    wallLine(s.wallBack !== false, x0, y0, x1, y0);
    wallLine(s.wallFront !== false, x0, y1, x1, y1);
    wallLine(s.wallLeft !== false, x0, y0, x0, y1);
    wallLine(s.wallRight !== false, x1, y0, x1, y1);

    badge((x0 + x1) / 2, y0 - 18, 'A');
    badge((x0 + x1) / 2, y1 + 18, 'C');
    badge(x0 - 18, (y0 + y1) / 2, 'D');
    badge(x1 + 18, (y0 + y1) / 2, 'B');

    // curtain box footprint shadow along wall A
    if (s.hasBox) {
      const spanMm = s.boxSpan != null ? s.boxSpan : W;
      const spanW = Math.min(spanMm, W) * scale;
      const offsetMm = s.boxOffsetX != null ? s.boxOffsetX : (W - spanMm) / 2;
      const protrudeMm = s.boxWidth != null ? s.boxWidth : 150;
      const depthPx = Math.max(protrudeMm * scale, 4);
      svg.appendChild(svgEl('rect', {
        x: x0 + offsetMm * scale, y: y0, width: spanW, height: depthPx,
        fill: '#E07B1E22', stroke: '#E07B1E', 'stroke-width': 1.2, 'stroke-dasharray': '3 2',
      }));
    }

    // window mark on wall A
    if (s.winEnabled !== false) {
      const winWidthMm = s.winWidth != null ? s.winWidth : W * 0.5;
      const winOffsetMm = s.winOffsetX != null ? s.winOffsetX : (W - winWidthMm) / 2;
      const wx1 = x0 + winOffsetMm * scale, wx2 = x0 + (winOffsetMm + winWidthMm) * scale;
      svg.appendChild(svgEl('line', { x1: wx1, y1: y0, x2: wx2, y2: y0, stroke: '#2E8FA6', 'stroke-width': 5 }));
      const wl = svgEl('text', { x: (wx1 + wx2) / 2, y: y0 - 6, 'text-anchor': 'middle', fill: '#2E8FA6', 'font-size': 10, 'font-family': "'IBM Plex Mono', monospace" });
      wl.textContent = '창문';
      svg.appendChild(wl);
    }

    // door mark on whichever wall it's assigned to
    if (s.doorEnabled) {
      const doorOffsetMm = s.doorOffset != null ? s.doorOffset : 300;
      const doorLenMm = s.doorWidth != null ? s.doorWidth : 800;
      const doorLenPx = Math.max(doorLenMm * scale, 10);
      let dx1, dy1, dx2, dy2, lx, ly;
      if (s.doorWall === 'right') {
        dy1 = y0 + doorOffsetMm * scale; dy2 = dy1 + doorLenPx; dx1 = dx2 = x1;
        lx = x1 + 14; ly = (dy1 + dy2) / 2;
      } else if (s.doorWall === 'front') {
        dx1 = x0 + doorOffsetMm * scale; dx2 = dx1 + doorLenPx; dy1 = dy2 = y1;
        lx = (dx1 + dx2) / 2; ly = y1 + 16;
      } else {
        dy1 = y0 + doorOffsetMm * scale; dy2 = dy1 + doorLenPx; dx1 = dx2 = x0;
        lx = x0 - 14; ly = (dy1 + dy2) / 2;
      }
      svg.appendChild(svgEl('line', { x1: dx1, y1: dy1, x2: dx2, y2: dy2, stroke: '#C94F4F', 'stroke-width': 5 }));
      const dl = svgEl('text', { x: lx, y: ly, 'text-anchor': 'middle', fill: '#C94F4F', 'font-size': 10, 'font-family': "'IBM Plex Mono', monospace" });
      dl.textContent = '문';
      svg.appendChild(dl);
    }

    // ceiling AC footprint (accurate x/z, since the plan view is exactly the AC's own coordinate plane)
    if (s.acEnabled) {
      const acWEff = s.acWidth != null ? s.acWidth : 900;
      const acDEff = s.acDepth != null ? s.acDepth : 300;
      const acXEff = s.acOffsetX != null ? s.acOffsetX : Math.round((W - acWEff) / 2);
      const acZEff = s.acOffsetZ != null ? s.acOffsetZ : 100;
      const arx = x0 + acXEff * scale, ary = y0 + acZEff * scale, arw = acWEff * scale, arh = acDEff * scale;
      svg.appendChild(svgEl('rect', {
        x: arx, y: ary, width: arw, height: arh,
        fill: '#DCE3E8AA', stroke: '#8492A0', 'stroke-width': 1.2, 'stroke-dasharray': '3 2',
      }));
      const acLbl = svgEl('text', { x: arx + arw / 2, y: ary + arh / 2 + 3, 'text-anchor': 'middle', fill: '#5B6B78', 'font-size': 9, 'font-family': "'IBM Plex Mono', monospace" });
      acLbl.textContent = '에어컨';
      svg.appendChild(acLbl);
      dimLine(svg, arx, ary - 10, arx + arw, ary - 10, acWEff.toFixed(0) + 'mm', { color: '#6E8199' });
      dimLine(svg, arx - 10, ary, arx - 10, ary + arh, acDEff.toFixed(0) + 'mm', { color: '#6E8199' });
    }

    // appliances / furniture footprints (accurate x/z)
    (s.applianceVisible ? (s.appliances || []) : []).forEach((item) => {
      const wEff = item.width != null ? item.width : 600;
      const dEff = item.depth != null ? item.depth : 600;
      const xEff = item.offsetX != null ? item.offsetX : 150;
      const zEff = item.offsetZ != null ? item.offsetZ : 150;
      const irx = x0 + xEff * scale, iry = y0 + zEff * scale, irw = wEff * scale, irh = dEff * scale;
      svg.appendChild(svgEl('rect', {
        x: irx, y: iry, width: irw, height: irh,
        fill: '#8A7CA855', stroke: '#5B4F79', 'stroke-width': 1.2,
      }));
      const name = item.name && item.name.trim() ? item.name.trim() : '가전';
      const lbl = svgEl('text', { x: irx + irw / 2, y: iry + irh / 2 + 3, 'text-anchor': 'middle', fill: '#5B4F79', 'font-size': 9, 'font-family': "'IBM Plex Mono', monospace" });
      lbl.textContent = name;
      svg.appendChild(lbl);
      dimLine(svg, irx, iry - 10, irx + irw, iry - 10, wEff.toFixed(0) + 'mm', { color: '#5B4F79' });
      dimLine(svg, irx - 10, iry, irx - 10, iry + irh, dEff.toFixed(0) + 'mm', { color: '#5B4F79' });
    });

    // room dimensions
    dimLine(svg, x0, y1 + 42, x1, y1 + 42, W.toFixed(0) + 'mm', { color: '#5C7089' });
    dimLine(svg, x1 + 46, y0, x1 + 46, y1, (s.depth != null ? '' : '약 ') + D.toFixed(0) + 'mm', { color: '#5C7089' });
  }

  function render() {
    const s = readState();
    updatePoleNote(s);
    renderDepth(s);
    renderWallElevation(el.svgWallA, 'A', s);
    renderWallElevation(el.svgWallB, 'B', s);
    renderWallElevation(el.svgWallC, 'C', s);
    renderWallElevation(el.svgWallD, 'D', s);
    renderPlan(s);
    render3D(s);
    el.chipWindow.classList.toggle('on', s.winEnabled !== false);
    el.chipBox.classList.toggle('on', !!s.hasBox);
    el.chipDoor.classList.toggle('on', !!s.doorEnabled);
    el.chipAc.classList.toggle('on', !!s.acEnabled);
    el.chipAppliance.classList.toggle('on', !!s.applianceVisible);
    el.doorWallsRow.style.display = s.doorEnabled ? 'flex' : 'none';
    el.doorWallsRow.querySelectorAll('[data-wall]').forEach((btn) => {
      btn.classList.toggle('on', btn.dataset.wall === s.doorWall);
    });
  }

  // ---------- 3D preview ----------
  const wrap3d = $('#csa-3d-wrap');
  const labelsContainer3d = $('#csa-3d-labels');
  let three = null; // { renderer, scene, camera, target, group }
  const cam = { theta: -0.65, phi: 0.78, radius: 4 };

  function initThree() {
    if (three || typeof THREE === 'undefined') return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    wrap3d.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 100);

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const sun = new THREE.DirectionalLight(0xffffff, 0.7);
    sun.position.set(3, 5, 4);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffffff, 0.25);
    fill.position.set(-3, 2, -2);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);

    three = { renderer, scene, camera, group, target: new THREE.Vector3(0, 1, 0) };

    // pointer controls
    let dragging = false, lastX = 0, lastY = 0;
    const onDown = (e) => {
      dragging = true;
      wrap3d.classList.add('dragging');
      lastX = e.clientX; lastY = e.clientY;
      wrap3d.setPointerCapture && e.pointerId != null && wrap3d.setPointerCapture(e.pointerId);
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      cam.theta -= dx * 0.006;
      cam.phi = Math.max(0.35, Math.min(1.5, cam.phi - dy * 0.006));
    };
    const onUp = () => { dragging = false; wrap3d.classList.remove('dragging'); };
    wrap3d.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    wrap3d.addEventListener('wheel', (e) => {
      e.preventDefault();
      cam.radius = Math.max(1.5, Math.min(12, cam.radius * (1 + e.deltaY * 0.001)));
    }, { passive: false });

    function resize() {
      const w = wrap3d.clientWidth, h = wrap3d.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    function animate() {
      requestAnimationFrame(animate);
      const t = three.target;
      camera.position.set(
        t.x + cam.radius * Math.sin(cam.phi) * Math.sin(cam.theta),
        t.y + cam.radius * Math.cos(cam.phi),
        t.z + cam.radius * Math.sin(cam.phi) * Math.cos(cam.theta)
      );
      camera.lookAt(t);
      renderer.render(scene, camera);
      updateLabels3D();
    }
    animate();
  }

  function updateLabels3D() {
    if (!three || !three.labels || !three.labels.length) return;
    const w = wrap3d.clientWidth, h = wrap3d.clientHeight;
    if (!w || !h) return;
    const camera = three.camera;
    const placed = [];
    three.labels.forEach((l) => {
      const v1 = l.p1.clone().project(camera);
      const v2 = l.p2.clone().project(camera);
      const behind1 = v1.z > 1 || v1.z < -1;
      const behind2 = v2.z > 1 || v2.z < -1;
      if (behind1 && behind2) { l.el.style.display = 'none'; return; }
      const x1 = (v1.x * 0.5 + 0.5) * w, y1 = (-v1.y * 0.5 + 0.5) * h;
      const x2 = (v2.x * 0.5 + 0.5) * w, y2 = (-v2.y * 0.5 + 0.5) * h;
      let midx = (x1 + x2) / 2, midy = (y1 + y2) / 2;
      let angleDeg = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      if (angleDeg > 90) angleDeg -= 180;
      if (angleDeg < -90) angleDeg += 180;

      // nudge away from any already-placed label that ends up too close on screen,
      // so crossing dimension lines never render overlapping text regardless of camera angle
      for (let tries = 0; tries < 8; tries++) {
        let collided = false;
        for (const p of placed) {
          const dx = midx - p.x, dy = midy - p.y;
          if (Math.sqrt(dx * dx + dy * dy) < 32) { midy += 20; collided = true; break; }
        }
        if (!collided) break;
      }
      placed.push({ x: midx, y: midy });

      l.el.style.display = 'block';
      l.el.style.left = midx + 'px';
      l.el.style.top = midy + 'px';
      l.el.style.transform = `translate(-50%, -160%) rotate(${angleDeg}deg)`;
    });
  }

  function syncLabelDom3D(labelDefs) {
    labelsContainer3d.innerHTML = '';
    three.labels = labelDefs.map((l) => {
      const d = document.createElement('div');
      d.className = 'csa-3d-label' + (l.editTarget ? ' editable' : '') + (l.badge ? ' badge' : '') + (l.action ? ' action' : '');
      d.textContent = l.text;
      d.style.color = l.badge ? '' : ('#' + l.color.toString(16).padStart(6, '0'));
      if (l.action) {
        d.style.pointerEvents = 'auto';
        d.title = '탭하여 삭제';
        d.addEventListener('pointerdown', (e) => e.stopPropagation());
        d.addEventListener('click', (e) => {
          e.stopPropagation();
          l.action();
          syncSubFields();
          render();
        });
      } else if (l.editTarget) {
        d.style.pointerEvents = 'auto';
        d.title = '탭하여 값 수정';
        d.addEventListener('pointerdown', (e) => e.stopPropagation());
        d.addEventListener('click', (e) => {
          e.stopPropagation();
          openLabelEditor(d, l);
        });
      }
      labelsContainer3d.appendChild(d);
      return { el: d, p1: l.p1, p2: l.p2 };
    });
    updateLabels3D();
  }

  function openLabelEditor(labelDiv, l) {
    const input = document.createElement('input');
    input.type = 'number';
    input.inputMode = 'decimal';
    input.className = 'csa-3d-label-input';
    input.value = l.editValueMm != null ? Math.round(l.editValueMm) : '';
    input.style.left = labelDiv.style.left;
    input.style.top = labelDiv.style.top;
    input.addEventListener('pointerdown', (e) => e.stopPropagation());
    input.addEventListener('click', (e) => e.stopPropagation());
    let committed = false;
    const commit = () => {
      if (committed) return;
      committed = true;
      const val = parseFloat(input.value);
      if (!isNaN(val) && val > 0) {
        if (typeof l.editTarget === 'function') l.editTarget(val);
        else l.editTarget.value = String(Math.round(val));
      }
      render();
    };
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); commit(); }
      else if (e.key === 'Escape') { e.preventDefault(); committed = true; render(); }
    });
    input.addEventListener('blur', commit);
    labelsContainer3d.replaceChild(input, labelDiv);
    input.focus();
    input.select();
  }

  function addPointLabel3D(labelDefs, point, text, colorHex, badge, action) {
    labelDefs.push({ p1: point.clone(), p2: point.clone(), text, color: colorHex, editTarget: null, editValueMm: null, badge: !!badge, action: action || null });
  }

  function addDim3D(group, labelDefs, edgeP1, edgeP2, dimP1, dimP2, text, colorHex, editTarget, editValueMm) {
    const extMat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.55 });
    [[edgeP1, dimP1], [edgeP2, dimP2]].forEach(([e, d]) => {
      if (e.distanceTo(d) > 0.005) {
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([e, d]), extMat));
      }
    });
    const center = new THREE.Vector3().addVectors(dimP1, dimP2).multiplyScalar(0.5);
    [dimP1, dimP2].forEach((endPoint) => {
      const toEnd = new THREE.Vector3().subVectors(endPoint, center);
      const len = toEnd.length();
      if (len < 0.005) return; // too short to draw an arrow
      const dir = toEnd.clone().normalize();
      const headLen = Math.min(len * 0.4, 0.07);
      const headWidth = headLen * 0.55;
      const arrow = new THREE.ArrowHelper(dir, center, len, colorHex, headLen, headWidth);
      group.add(arrow);
    });
    labelDefs.push({ p1: dimP1.clone(), p2: dimP2.clone(), text, color: colorHex, editTarget, editValueMm });
  }

  function clearGroup(group) {
    while (group.children.length) {
      const c = group.children.pop();
      c.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
    }
  }

  function box(w, h, d, color, opts) {
    opts = opts || {};
    const geo = new THREE.BoxGeometry(Math.max(w, 0.005), Math.max(h, 0.005), Math.max(d, 0.005));
    const mat = new THREE.MeshStandardMaterial({ color, transparent: !!opts.opacity, opacity: opts.opacity ?? 1, roughness: 0.8, metalness: 0.05 });
    return new THREE.Mesh(geo, mat);
  }

  function render3D(s) {
    initThree();
    if (!three) return; // THREE failed to load
    const { group } = three;
    clearGroup(group);
    const labelDefs = [];

    const M = 1000; // mm -> m
    const W = s.width / M;
    const H = s.ceiling / M;
    const D = s.depth ? s.depth / M : 4.0; // real if provided, else default

    // floor
    const floor = box(W, 0.02, D, 0xC9B08C);
    floor.position.set(W / 2, -0.01, D / 2);
    group.add(floor);

    // four walls (no ceiling, so the interior stays visible from above while rotating); each is optional
    const wallT = 0.06;
    if (s.wallBack !== false) {
      const backWall = box(W, H, wallT, 0xF1EDE4);   // window wall, z = 0
      backWall.position.set(W / 2, H / 2, -wallT / 2);
      group.add(backWall);
      addPointLabel3D(labelDefs, new THREE.Vector3(W / 2, H * 0.9, 0.08), 'A', 0x14213D, true);
    }

    if (s.wallFront !== false) {
      const frontWall = box(W, H, wallT, 0xE9E4D8, { opacity: 0.9 }); // opposite wall, z = D
      frontWall.position.set(W / 2, H / 2, D + wallT / 2);
      group.add(frontWall);
      addPointLabel3D(labelDefs, new THREE.Vector3(W / 2, H * 0.9, D - 0.08), 'C', 0x14213D, true);
    }

    if (s.wallLeft !== false) {
      const leftWall = box(wallT, H, D, 0xE7E2D6);   // x = 0
      leftWall.position.set(-wallT / 2, H / 2, D / 2);
      group.add(leftWall);
      addPointLabel3D(labelDefs, new THREE.Vector3(0.08, H * 0.9, D / 2), 'D', 0x14213D, true);
    }

    if (s.wallRight !== false) {
      const rightWall = box(wallT, H, D, 0xE7E2D6, { opacity: 0.9 }); // x = W
      rightWall.position.set(W + wallT / 2, H / 2, D / 2);
      group.add(rightWall);
      addPointLabel3D(labelDefs, new THREE.Vector3(W - 0.08, H * 0.9, D / 2), 'B', 0x14213D, true);
    }

    // person figure at the room's center — marks the vantage point the A/B/C/D wall drawings are seen from
    {
      const personX = W / 2, personZ = D / 2;
      const pantsColor = 0x33465C, shirtColor = 0x2E8FA6, skinColor = 0xE8C39E, shoeColor = 0x22303F;
      const legH = 0.82, hipW = 0.11, legR = 0.055;
      const torsoH = 0.42, shoulderW = 0.34, waistW = 0.24;
      const armR = 0.04, armH = 0.42;
      const neckH = 0.05, headR = 0.115;

      function limb(radiusTop, radiusBottom, height, color) {
        return new THREE.Mesh(
          new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 12),
          new THREE.MeshStandardMaterial({ color })
        );
      }

      // legs (two, standing slightly apart) + shoes
      [-1, 1].forEach((side) => {
        const leg = limb(legR, legR * 0.9, legH, pantsColor);
        leg.position.set(personX + side * hipW, legH / 2, personZ);
        group.add(leg);
        const shoe = new THREE.Mesh(
          new THREE.BoxGeometry(0.09, 0.05, 0.16),
          new THREE.MeshStandardMaterial({ color: shoeColor })
        );
        shoe.position.set(personX + side * hipW, 0.025, personZ + 0.03);
        group.add(shoe);
      });

      // torso, tapered narrower at the waist, wider at the shoulders
      const torso = limb(shoulderW / 2, waistW / 2, torsoH, shirtColor);
      torso.position.set(personX, legH + torsoH / 2, personZ);
      group.add(torso);

      // arms hanging at the sides, angled slightly outward
      [-1, 1].forEach((side) => {
        const arm = limb(armR, armR * 0.85, armH, shirtColor);
        arm.position.set(personX + side * (shoulderW / 2 + armR + 0.01), legH + torsoH - armH / 2 - 0.03, personZ);
        arm.rotation.z = side * 0.09;
        group.add(arm);
        const hand = new THREE.Mesh(
          new THREE.SphereGeometry(armR * 1.05, 10, 10),
          new THREE.MeshStandardMaterial({ color: skinColor })
        );
        hand.position.set(personX + side * (shoulderW / 2 + armR + 0.01 + Math.sin(side * 0.09) * armH * 0.5), legH + torsoH - armH - 0.03, personZ);
        group.add(hand);
      });

      // neck + head
      const neck = limb(0.045, 0.05, neckH, skinColor);
      neck.position.set(personX, legH + torsoH + neckH / 2, personZ);
      group.add(neck);
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(headR, 18, 18),
        new THREE.MeshStandardMaterial({ color: skinColor })
      );
      const headY = legH + torsoH + neckH + headR * 0.92;
      head.position.set(personX, headY, personZ);
      group.add(head);
      // small hair cap so the head doesn't read as a plain ball
      const hair = new THREE.Mesh(
        new THREE.SphereGeometry(headR * 1.03, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.52),
        new THREE.MeshStandardMaterial({ color: 0x2B2320 })
      );
      hair.position.set(personX, headY + headR * 0.12, personZ);
      group.add(hair);

      addPointLabel3D(labelDefs, new THREE.Vector3(personX, headY + headR + 0.12, personZ), '보는 위치', 0x2E8FA6, false);
    }

    // core dimension lines: width, depth, ceiling height (all tap-to-edit)
    // placed just inside the room walls so they stay visible looking down into the interior
    if (catOn('core')) {
      addDim3D(group, labelDefs,
        new THREE.Vector3(0, 0, 0), new THREE.Vector3(W, 0, 0),
        new THREE.Vector3(0, 0, 0.25), new THREE.Vector3(W, 0, 0.25),
        '가로 ' + s.width.toFixed(0), 0x14213D, el.width, s.width);

      const depthEffMm = Math.round(D * M);
      const depthLabel = '세로 ' + (s.depth != null ? s.depth.toFixed(0) : '~' + depthEffMm);
      addDim3D(group, labelDefs,
        new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, D),
        new THREE.Vector3(0.25, 0, 0), new THREE.Vector3(0.25, 0, D),
        depthLabel, 0x14213D, el.depth, depthEffMm);

      addDim3D(group, labelDefs,
        new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, H, 0),
        new THREE.Vector3(0.25, 0, 0.25), new THREE.Vector3(0.25, H, 0.25),
        '천고 ' + s.ceiling.toFixed(0), 0x146366, el.ceiling, s.ceiling);
    }

    // window: size and position are all tap-to-edit, protrusion depth stays real
    if (s.winEnabled !== false) {
      const winWidthEffMm = s.winWidth != null ? s.winWidth : Math.round(W * M * 0.5);
      const winHeightEffMm = s.winHeight != null ? s.winHeight : Math.round(H * M * 0.5);
      const winSillEffMm = s.winSill != null ? s.winSill : Math.round(H * M * 0.25);
      const winOffsetXEffMm = s.winOffsetX != null ? s.winOffsetX : Math.round((W * M - winWidthEffMm) / 2);
      const winW = Math.min(winWidthEffMm / M, W * 0.96);
      const winH = Math.min(winHeightEffMm / M, H * 0.9);
      const winSillM = Math.max(winSillEffMm / M, 0);
      const winOffsetXM = Math.max(Math.min(winOffsetXEffMm / M, W - winW), 0);
      const winCenterX = winOffsetXM + winW / 2;
      const winCenterY = winSillM + winH / 2;

      const winDepthEff = s.winProt ? (s.winDepth != null ? s.winDepth : 50) : 0;
      const winProtM = winDepthEff / M;
      const winFrame = box(winW, winH, Math.max(winProtM, 0.03), 0x8FC1D6, { opacity: 0.55 });
      winFrame.position.set(winCenterX, winCenterY, winProtM / 2);
      group.add(winFrame);

      // window width (top edge, offset up)
      const winWidthLabel = '창폭 ' + (s.winWidth != null ? s.winWidth.toFixed(0) : '~' + winWidthEffMm);
      if (catOn('window')) addDim3D(group, labelDefs,
        new THREE.Vector3(winOffsetXM, winSillM + winH, winProtM), new THREE.Vector3(winOffsetXM + winW, winSillM + winH, winProtM),
        new THREE.Vector3(winOffsetXM, winSillM + winH + 0.13, winProtM), new THREE.Vector3(winOffsetXM + winW, winSillM + winH + 0.13, winProtM),
        winWidthLabel, 0x2E8FA6, el.winwidth, winWidthEffMm);

      // window height (right edge, offset sideways)
      const winHeightLabel = '창높이 ' + (s.winHeight != null ? s.winHeight.toFixed(0) : '~' + winHeightEffMm);
      if (catOn('window')) addDim3D(group, labelDefs,
        new THREE.Vector3(winOffsetXM + winW, winSillM, winProtM), new THREE.Vector3(winOffsetXM + winW, winSillM + winH, winProtM),
        new THREE.Vector3(winOffsetXM + winW + 0.13, winSillM, winProtM), new THREE.Vector3(winOffsetXM + winW + 0.13, winSillM + winH, winProtM),
        winHeightLabel, 0x2E8FA6, el.winheight, winHeightEffMm);

      // window sill height (floor to window bottom, left edge)
      const winSillLabel = '창하단 ' + (s.winSill != null ? s.winSill.toFixed(0) : '~' + winSillEffMm);
      if (catOn('window')) addDim3D(group, labelDefs,
        new THREE.Vector3(winOffsetXM, 0, winProtM), new THREE.Vector3(winOffsetXM, winSillM, winProtM),
        new THREE.Vector3(winOffsetXM - 0.13, 0, winProtM), new THREE.Vector3(winOffsetXM - 0.13, winSillM, winProtM),
        winSillLabel, 0x2E8FA6, el.winsill, winSillEffMm);

      // window offset from the left wall (floor level)
      const winOffsetLabel = '창위치 ' + (s.winOffsetX != null ? s.winOffsetX.toFixed(0) : '~' + winOffsetXEffMm);
      if (catOn('window')) addDim3D(group, labelDefs,
        new THREE.Vector3(0, 0, winProtM), new THREE.Vector3(winOffsetXM, 0, winProtM),
        new THREE.Vector3(0, 0.13, winProtM), new THREE.Vector3(winOffsetXM, 0.13, winProtM),
        winOffsetLabel, 0x2E8FA6, el.winoffsetx, winOffsetXEffMm);

      if (s.winProt && catOn('window')) {
        const yy = winCenterY - winH / 2 - 0.12;
        addDim3D(group, labelDefs,
          new THREE.Vector3(winCenterX, yy, 0), new THREE.Vector3(winCenterX, yy, winProtM),
          new THREE.Vector3(winCenterX, yy, 0), new THREE.Vector3(winCenterX, yy, winProtM),
          '창돌출 ' + winDepthEff.toFixed(0), 0x2E8FA6, el.windepth, winDepthEff);
      }

      // handle (cumulative protrusion beyond window, height independently adjustable)
      if (s.handleProt) {
        const handleDepthEff = s.handleDepth != null ? s.handleDepth : 50;
        const handleDepthM = handleDepthEff / M;
        const handleHeightEffMm = s.handleHeight != null ? s.handleHeight : Math.round(winCenterY * M);
        const handleCenterY = Math.max(handleHeightEffMm / M, 0.05);
        const handleW = 0.03, handleH = 0.18;
        const hx = winOffsetXM + winW - 0.05;
        const handle = box(handleW, handleH, Math.max(handleDepthM, 0.02), 0x8A94A0);
        handle.position.set(hx, handleCenterY, winProtM + handleDepthM / 2);
        group.add(handle);

        // protrusion depth (from window face outward)
        const hy = handleCenterY - 0.28;
        if (catOn('window')) addDim3D(group, labelDefs,
          new THREE.Vector3(hx, hy, winProtM), new THREE.Vector3(hx, hy, winProtM + handleDepthM),
          new THREE.Vector3(hx, hy, winProtM), new THREE.Vector3(hx, hy, winProtM + handleDepthM),
          '손잡이 +' + handleDepthEff.toFixed(0), 0x5C6670, el.handledepth, handleDepthEff);

        // height from floor to handle center
        const handleHeightLabel = '손잡이높이 ' + (s.handleHeight != null ? s.handleHeight.toFixed(0) : '~' + handleHeightEffMm);
        if (catOn('window')) addDim3D(group, labelDefs,
          new THREE.Vector3(hx, 0, winProtM), new THREE.Vector3(hx, handleCenterY, winProtM),
          new THREE.Vector3(hx + 0.16, 0, winProtM), new THREE.Vector3(hx + 0.16, handleCenterY, winProtM),
          handleHeightLabel, 0x5C6670, el.handleheight, handleHeightEffMm);
      }
    }

    // curtain box (recess where the ceiling rises above the general room ceiling)
    let boxCeilingM = null;
    if (s.hasBox) {
      const boxCeilingEff = s.boxCeiling != null ? s.boxCeiling : (s.ceiling + 300);
      boxCeilingM = boxCeilingEff / M;
      const extraM = Math.max(boxCeilingM - H, 0.02); // how much higher than the general ceiling
      const boxSpanEffMm = s.boxSpan != null ? s.boxSpan : Math.round(W * M); // defaults to the full wall
      const boxSpanW = Math.min(boxSpanEffMm / M, W); // capped so it never exceeds the side walls
      const boxProtrudeEffMm = s.boxWidth != null ? s.boxWidth : 150; // distance the box sticks out from the window wall
      const boxOutward = boxProtrudeEffMm / M;
      const boxOffsetXEffMm = s.boxOffsetX != null ? s.boxOffsetX : Math.round((W * M - boxSpanEffMm) / 2); // defaults to centered
      const boxOffsetXM = Math.max(Math.min(boxOffsetXEffMm / M, W - boxSpanW), 0);
      const boxLeftX = boxOffsetXM, boxRightX = boxOffsetXM + boxSpanW;
      const cbox = box(boxSpanW, extraM, boxOutward, 0xE07B1E, { opacity: 0.85 });
      cbox.position.set(boxLeftX + boxSpanW / 2, H + extraM / 2, boxOutward / 2);
      group.add(cbox);
      const extraMm = boxCeilingEff - s.ceiling;
      const boxLabel = '박스천고 ' + boxCeilingEff.toFixed(0) + (extraMm >= 0 ? '(+' + extraMm.toFixed(0) + ')' : '(' + extraMm.toFixed(0) + ')');
      if (catOn('box')) addDim3D(group, labelDefs,
        new THREE.Vector3(W, H, 0.03), new THREE.Vector3(W, boxCeilingM, 0.03),
        new THREE.Vector3(W - 0.25, H, 0.03), new THREE.Vector3(W - 0.25, boxCeilingM, 0.03),
        boxLabel, 0xE07B1E, el.boxceiling, boxCeilingEff);

      const boxProtrudeLabel = '박스폭 ' + (s.boxWidth != null ? s.boxWidth.toFixed(0) : '~' + boxProtrudeEffMm);
      if (catOn('box')) addDim3D(group, labelDefs,
        new THREE.Vector3(boxLeftX + boxSpanW / 2, boxCeilingM, 0), new THREE.Vector3(boxLeftX + boxSpanW / 2, boxCeilingM, boxOutward),
        new THREE.Vector3(boxLeftX + boxSpanW / 2, boxCeilingM + 0.15, 0), new THREE.Vector3(boxLeftX + boxSpanW / 2, boxCeilingM + 0.15, boxOutward),
        boxProtrudeLabel, 0xE07B1E, el.boxwidth, boxProtrudeEffMm);

      const boxSpanLabel = '박스길이 ' + (s.boxSpan != null ? s.boxSpan.toFixed(0) : '~' + boxSpanEffMm);
      if (catOn('box')) addDim3D(group, labelDefs,
        new THREE.Vector3(boxLeftX, boxCeilingM, boxOutward), new THREE.Vector3(boxRightX, boxCeilingM, boxOutward),
        new THREE.Vector3(boxLeftX, boxCeilingM + 0.28, boxOutward), new THREE.Vector3(boxRightX, boxCeilingM + 0.28, boxOutward),
        boxSpanLabel, 0xE07B1E, el.boxspan, boxSpanEffMm);

      // position along the wall: distance from the left wall to the box's near (left) edge,
      // kept up near the box itself (not at floor level) so it doesn't tangle with window/floor dims
      const boxOffsetLabel = '박스위치 ' + (s.boxOffsetX != null ? s.boxOffsetX.toFixed(0) : '~' + boxOffsetXEffMm);
      if (catOn('box')) addDim3D(group, labelDefs,
        new THREE.Vector3(0, H, 0), new THREE.Vector3(boxLeftX, H, 0),
        new THREE.Vector3(0, H + 0.16, 0), new THREE.Vector3(boxLeftX, H + 0.16, 0),
        boxOffsetLabel, 0xE07B1E, el.boxoffsetx, boxOffsetXEffMm);
    }

    // door marker (size + position tap-to-edit, placed at the given wall + offset)
    if (s.doorEnabled) {
      const doorOffsetEff = s.doorOffset != null ? s.doorOffset : 300;
      const doorWEffMm = s.doorWidth != null ? s.doorWidth : 800;
      const doorHEffMm = s.doorHeight != null ? s.doorHeight : 2000;
      const doorW = doorWEffMm / M, doorH = doorHEffMm / M;
      const offsetM = Math.max(doorOffsetEff / M, 0);
      const doorLabel = '문위치 ' + (s.doorOffset != null ? doorOffsetEff.toFixed(0) : '~' + doorOffsetEff.toFixed(0));
      const doorWidthLabel = '문폭 ' + (s.doorWidth != null ? s.doorWidth.toFixed(0) : '~' + doorWEffMm);
      const doorHeightLabel = '문높이 ' + (s.doorHeight != null ? s.doorHeight.toFixed(0) : '~' + doorHEffMm);
      let doorMesh;
      if (s.doorWall === 'right') {
        const z = Math.min(offsetM + doorW / 2, D - doorW / 2 > 0 ? D - 0.02 : D / 2);
        doorMesh = box(0.05, doorH, doorW, 0xC94F4F, { opacity: 0.65 });
        doorMesh.position.set(W - 0.02, doorH / 2, z);
        if (catOn('door')) addDim3D(group, labelDefs,
          new THREE.Vector3(W, 0.05, 0), new THREE.Vector3(W, 0.05, offsetM),
          new THREE.Vector3(W - 0.25, 0.05, 0), new THREE.Vector3(W - 0.25, 0.05, offsetM),
          doorLabel, 0xC94F4F, el.dooroffset, doorOffsetEff);
        if (catOn('door')) addDim3D(group, labelDefs,
          new THREE.Vector3(W, doorH, z - doorW / 2), new THREE.Vector3(W, doorH, z + doorW / 2),
          new THREE.Vector3(W - 0.16, doorH + 0.1, z - doorW / 2), new THREE.Vector3(W - 0.16, doorH + 0.1, z + doorW / 2),
          doorWidthLabel, 0xC94F4F, el.doorwidth, doorWEffMm);
        if (catOn('door')) addDim3D(group, labelDefs,
          new THREE.Vector3(W, 0, z + doorW / 2 + 0.06), new THREE.Vector3(W, doorH, z + doorW / 2 + 0.06),
          new THREE.Vector3(W - 0.16, 0, z + doorW / 2 + 0.06), new THREE.Vector3(W - 0.16, doorH, z + doorW / 2 + 0.06),
          doorHeightLabel, 0xC94F4F, el.doorheight, doorHEffMm);
      } else if (s.doorWall === 'front') {
        const x = Math.min(offsetM + doorW / 2, W - 0.02 > doorW / 2 ? W - 0.02 : W / 2);
        doorMesh = box(doorW, doorH, 0.05, 0xC94F4F, { opacity: 0.65 });
        doorMesh.position.set(x, doorH / 2, D - 0.02);
        if (catOn('door')) addDim3D(group, labelDefs,
          new THREE.Vector3(0, 0.05, D), new THREE.Vector3(offsetM, 0.05, D),
          new THREE.Vector3(0, 0.05, D - 0.25), new THREE.Vector3(offsetM, 0.05, D - 0.25),
          doorLabel, 0xC94F4F, el.dooroffset, doorOffsetEff);
        if (catOn('door')) addDim3D(group, labelDefs,
          new THREE.Vector3(x - doorW / 2, doorH, D), new THREE.Vector3(x + doorW / 2, doorH, D),
          new THREE.Vector3(x - doorW / 2, doorH + 0.1, D - 0.16), new THREE.Vector3(x + doorW / 2, doorH + 0.1, D - 0.16),
          doorWidthLabel, 0xC94F4F, el.doorwidth, doorWEffMm);
        if (catOn('door')) addDim3D(group, labelDefs,
          new THREE.Vector3(x + doorW / 2 + 0.06, 0, D), new THREE.Vector3(x + doorW / 2 + 0.06, doorH, D),
          new THREE.Vector3(x + doorW / 2 + 0.06, 0, D - 0.16), new THREE.Vector3(x + doorW / 2 + 0.06, doorH, D - 0.16),
          doorHeightLabel, 0xC94F4F, el.doorheight, doorHEffMm);
      } else { // left (default)
        const z = Math.min(offsetM + doorW / 2, D - doorW / 2 > 0 ? D - 0.02 : D / 2);
        doorMesh = box(0.05, doorH, doorW, 0xC94F4F, { opacity: 0.65 });
        doorMesh.position.set(0.02, doorH / 2, z);
        if (catOn('door')) addDim3D(group, labelDefs,
          new THREE.Vector3(0, 0.05, 0), new THREE.Vector3(0, 0.05, offsetM),
          new THREE.Vector3(0.25, 0.05, 0), new THREE.Vector3(0.25, 0.05, offsetM),
          doorLabel, 0xC94F4F, el.dooroffset, doorOffsetEff);
        if (catOn('door')) addDim3D(group, labelDefs,
          new THREE.Vector3(0, doorH, z - doorW / 2), new THREE.Vector3(0, doorH, z + doorW / 2),
          new THREE.Vector3(0.16, doorH + 0.1, z - doorW / 2), new THREE.Vector3(0.16, doorH + 0.1, z + doorW / 2),
          doorWidthLabel, 0xC94F4F, el.doorwidth, doorWEffMm);
        if (catOn('door')) addDim3D(group, labelDefs,
          new THREE.Vector3(0, 0, z + doorW / 2 + 0.06), new THREE.Vector3(0, doorH, z + doorW / 2 + 0.06),
          new THREE.Vector3(0.16, 0, z + doorW / 2 + 0.06), new THREE.Vector3(0.16, doorH, z + doorW / 2 + 0.06),
          doorHeightLabel, 0xC94F4F, el.doorheight, doorHEffMm);
      }
      group.add(doorMesh);
    }

    // ceiling AC unit, mounted near the window wall
    if (s.acEnabled) {
      const acWEffMm = s.acWidth != null ? s.acWidth : 900;
      const acDEffMm = s.acDepth != null ? s.acDepth : 300;
      const acThickEffMm = s.acThick != null ? s.acThick : 220;
      const acWm = Math.min(acWEffMm / M, W);
      const acDm = Math.min(acDEffMm / M, D);
      const acThick = acThickEffMm / M;
      const acOffsetXEffMm = s.acOffsetX != null ? s.acOffsetX : Math.round((s.width - acWEffMm) / 2);
      const acOffsetZEffMm = s.acOffsetZ != null ? s.acOffsetZ : 100;
      const acX = Math.max(Math.min(acOffsetXEffMm / M, W - acWm), 0);
      const acZ = Math.max(Math.min(acOffsetZEffMm / M, D - acDm), 0);
      const ac = box(acWm, acThick, acDm, 0xDCE3E8, { opacity: 0.92 });
      ac.position.set(acX + acWm / 2, H - acThick / 2, acZ + acDm / 2);
      group.add(ac);

      const acWidthLabel = '에어컨폭 ' + (s.acWidth != null ? s.acWidth.toFixed(0) : '~' + acWEffMm);
      if (catOn('ac')) addDim3D(group, labelDefs,
        new THREE.Vector3(acX, H - acThick, 0), new THREE.Vector3(acX + acWm, H - acThick, 0),
        new THREE.Vector3(acX, H - acThick - 0.14, 0), new THREE.Vector3(acX + acWm, H - acThick - 0.14, 0),
        acWidthLabel, 0x6E8199, el.acwidth, acWEffMm);

      const acDepthLabel = '에어컨세로 ' + (s.acDepth != null ? s.acDepth.toFixed(0) : '~' + acDEffMm);
      if (catOn('ac')) addDim3D(group, labelDefs,
        new THREE.Vector3(acX + acWm + 0.14, H - acThick, acZ), new THREE.Vector3(acX + acWm + 0.14, H - acThick, acZ + acDm),
        new THREE.Vector3(acX + acWm + 0.14, H, acZ), new THREE.Vector3(acX + acWm + 0.14, H, acZ + acDm),
        acDepthLabel, 0x6E8199, el.acdepth, acDEffMm);

      const acThickLabel = '에어컨돌출 ' + (s.acThick != null ? s.acThick.toFixed(0) : '~' + acThickEffMm);
      if (catOn('ac')) addDim3D(group, labelDefs,
        new THREE.Vector3(acX + acWm + 0.14, H, acZ + acDm / 2), new THREE.Vector3(acX + acWm + 0.14, H - acThick, acZ + acDm / 2),
        new THREE.Vector3(acX + acWm + 0.3, H, acZ + acDm / 2), new THREE.Vector3(acX + acWm + 0.3, H - acThick, acZ + acDm / 2),
        acThickLabel, 0x6E8199, el.acthick, acThickEffMm);

      const acOffsetXLabel = '에어컨X ' + (s.acOffsetX != null ? s.acOffsetX.toFixed(0) : '~' + acOffsetXEffMm);
      if (catOn('ac')) addDim3D(group, labelDefs,
        new THREE.Vector3(0, 0.05, 0.35), new THREE.Vector3(acX, 0.05, 0.35),
        new THREE.Vector3(0, 0.05, 0.5), new THREE.Vector3(acX, 0.05, 0.5),
        acOffsetXLabel, 0x6E8199, el.acoffsetx, acOffsetXEffMm);

      const acOffsetZLabel = '에어컨Z ' + (s.acOffsetZ != null ? s.acOffsetZ.toFixed(0) : '~' + acOffsetZEffMm);
      if (catOn('ac')) addDim3D(group, labelDefs,
        new THREE.Vector3(0.6, 0.05, 0), new THREE.Vector3(0.6, 0.05, acZ),
        new THREE.Vector3(0.75, 0.05, 0), new THREE.Vector3(0.75, 0.05, acZ),
        acOffsetZLabel, 0x6E8199, el.acoffsetz, acOffsetZEffMm);
    }

    // appliances / furniture (fridge, styler, etc.) — free-standing boxes with tap-to-edit size & position
    (s.applianceVisible ? (s.appliances || []) : []).forEach((item, idx) => {
      const wEffMm = item.width != null ? item.width : 600;
      const dEffMm = item.depth != null ? item.depth : 600;
      const hEffMm = item.height != null ? item.height : 1800;
      const xEffMm = item.offsetX != null ? item.offsetX : 150 + idx * (wEffMm + 150);
      const zEffMm = item.offsetZ != null ? item.offsetZ : 150;
      const wM = wEffMm / M, dM = dEffMm / M, hM = hEffMm / M;
      const xM = Math.max(Math.min(xEffMm / M, W - wM), 0);
      const zM = Math.max(Math.min(zEffMm / M, D - dM), 0);
      const applianceColor = 0x8A7CA8;
      const mesh = box(wM, hM, dM, applianceColor, { opacity: 0.75 });
      mesh.position.set(xM + wM / 2, hM / 2, zM + dM / 2);
      group.add(mesh);

      const displayName = item.name && item.name.trim() ? item.name.trim() : ('가전' + (idx + 1));
      addPointLabel3D(labelDefs, new THREE.Vector3(xM + wM / 2, hM + 0.12, zM + dM / 2), displayName, 0x5B4F79, false);

      if (catOn('appliance')) addDim3D(group, labelDefs,
        new THREE.Vector3(xM, hM, zM), new THREE.Vector3(xM + wM, hM, zM),
        new THREE.Vector3(xM, hM + 0.06, zM - 0.14), new THREE.Vector3(xM + wM, hM + 0.06, zM - 0.14),
        displayName + '폭 ' + (item.width != null ? item.width.toFixed(0) : '~' + wEffMm), 0x5B4F79,
        (val) => { item.width = val; }, wEffMm);

      if (catOn('appliance')) addDim3D(group, labelDefs,
        new THREE.Vector3(xM, hM, zM), new THREE.Vector3(xM, hM, zM + dM),
        new THREE.Vector3(xM - 0.14, hM + 0.06, zM), new THREE.Vector3(xM - 0.14, hM + 0.06, zM + dM),
        displayName + '깊이 ' + (item.depth != null ? item.depth.toFixed(0) : '~' + dEffMm), 0x5B4F79,
        (val) => { item.depth = val; }, dEffMm);

      if (catOn('appliance')) addDim3D(group, labelDefs,
        new THREE.Vector3(xM + wM + 0.02, 0, zM), new THREE.Vector3(xM + wM + 0.02, hM, zM),
        new THREE.Vector3(xM + wM + 0.16, 0, zM), new THREE.Vector3(xM + wM + 0.16, hM, zM),
        displayName + '높이 ' + (item.height != null ? item.height.toFixed(0) : '~' + hEffMm), 0x5B4F79,
        (val) => { item.height = val; }, hEffMm);

      if (catOn('appliance')) addDim3D(group, labelDefs,
        new THREE.Vector3(0, 0.05, zM + dM / 2), new THREE.Vector3(xM, 0.05, zM + dM / 2),
        new THREE.Vector3(0, 0.05, zM + dM / 2 + 0.18), new THREE.Vector3(xM, 0.05, zM + dM / 2 + 0.18),
        displayName + 'X ' + (item.offsetX != null ? item.offsetX.toFixed(0) : '~' + xEffMm), 0x5B4F79,
        (val) => { item.offsetX = val; }, xEffMm);

      if (catOn('appliance')) addDim3D(group, labelDefs,
        new THREE.Vector3(xM + wM / 2, 0.05, 0), new THREE.Vector3(xM + wM / 2, 0.05, zM),
        new THREE.Vector3(xM + wM / 2 + 0.18, 0.05, 0), new THREE.Vector3(xM + wM / 2 + 0.18, 0.05, zM),
        displayName + 'Z ' + (item.offsetZ != null ? item.offsetZ.toFixed(0) : '~' + zEffMm), 0x5B4F79,
        (val) => { item.offsetZ = val; }, zEffMm);
    });

    // frame camera target/distance to fit room
    three.target.set(W / 2, H * 0.5, D * 0.5);
    cam.radius = Math.max(W, H, D) * 1.7 + 0.6;

    syncLabelDom3D(labelDefs);
  }

  // ---------- Storage ----------
  let cachedItems = [];

  async function loadList() {
    el.list.innerHTML = '<div class="csa-list-empty">불러오는 중…</div>';
    try {
      const idx = await window.storage.get('rooms-index', false).catch(() => null);
      const ids = idx ? JSON.parse(idx.value) : [];
      if (!ids.length) {
        el.list.innerHTML = '<div class="csa-list-empty">저장된 방이 없습니다. 치수를 입력하고 "이 방 저장"을 눌러주세요.</div>';
        el.count.textContent = '0';
        cachedItems = [];
        el.exportAll.style.display = 'none';
        maybeAutoSelect([]);
        return;
      }
      const items = [];
      for (const id of ids) {
        try {
          const r = await window.storage.get('rooms:' + id, false);
          if (r) items.push(JSON.parse(r.value));
        } catch (e) { /* skip missing */ }
      }
      items.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));

      // when opened from the 통합보드 with a jobId, float any records already linked
      // to this job to the top of the list so they're easy to spot at a glance
      if (linkedJobId) {
        items.sort((a, b) => {
          const aLinked = a.jobId === linkedJobId ? 1 : 0;
          const bLinked = b.jobId === linkedJobId ? 1 : 0;
          if (aLinked !== bLinked) return bLinked - aLinked;
          return (b.savedAt || 0) - (a.savedAt || 0);
        });
      }

      cachedItems = items;
      el.count.textContent = String(items.length);
      el.exportAll.style.display = items.length ? 'inline-flex' : 'none';
      if (!items.length) {
        el.list.innerHTML = '<div class="csa-list-empty">저장된 방이 없습니다.</div>';
        maybeAutoSelect(items);
        return;
      }
      el.list.innerHTML = '';
      items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'csa-record' + (linkedJobId && item.jobId === linkedJobId ? ' csa-record-linked' : '');
        const boxTxt = item.hasBox && item.boxCeiling != null && item.ceiling != null
          ? ` · 박스구간 ${(item.boxCeiling - item.ceiling >= 0 ? '+' : '') + (item.boxCeiling - item.ceiling).toFixed(0)}mm` : '';
        const firstPhoto = (Array.isArray(item.photos) && item.photos[0]) || item.photo || null;
        const photoCount = Array.isArray(item.photos) ? item.photos.length : (item.photo ? 1 : 0);
        const thumbHtml = firstPhoto
          ? `<div class="csa-record-thumb-wrap"><img class="csa-record-thumb" src="${firstPhoto}" alt="">${photoCount > 1 ? `<span class="csa-record-thumb-count">${photoCount}</span>` : ''}</div>`
          : `<div class="csa-record-thumb csa-record-thumb-empty"></div>`;
        const linkedBadge = (linkedJobId && item.jobId === linkedJobId) ? '<span class="csa-record-linked-badge">이 주문</span>' : '';
        row.innerHTML = `
          ${thumbHtml}
          <div style="flex:1; min-width:0;">
            <div class="csa-record-name">${escapeHtml(item.name || '이름 없음')}${linkedBadge}</div>
            <div class="csa-record-meta">가로 ${item.width ?? '-'}mm · 천고 ${item.ceiling ?? '-'}mm${boxTxt}</div>
          </div>
          <button class="csa-record-export" data-id="${item.id}" title="파일로 내보내기">⬇</button>
          <button class="csa-record-del" data-id="${item.id}" title="삭제">✕</button>
        `;
        row.addEventListener('click', (e) => {
          if (e.target.closest('.csa-record-del')) return;
          if (e.target.closest('.csa-record-export')) return;
          if (e.target.closest('.csa-record-thumb-wrap')) return;
          currentId = item.id;
          fillState(item);
          el.status.textContent = `"${item.name || '이름 없음'}" 불러옴 — 수정 후 저장하면 갱신됩니다.`;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        row.querySelector('.csa-record-del').addEventListener('click', async (ev) => {
          ev.stopPropagation();
          await deleteRoom(item.id);
        });
        row.querySelector('.csa-record-export').addEventListener('click', (ev) => {
          ev.stopPropagation();
          exportRooms([item]);
        });
        const thumbWrap = row.querySelector('.csa-record-thumb-wrap');
        if (thumbWrap) {
          thumbWrap.addEventListener('click', (ev) => {
            ev.stopPropagation();
            openLightbox(firstPhoto);
          });
        }
        el.list.appendChild(row);
      });
      maybeAutoSelect(items);
    } catch (err) {
      el.list.innerHTML = '<div class="csa-list-empty">목록을 불러오지 못했습니다.</div>';
    }
  }

  // On first load only: if this page was opened from the 통합보드 with a jobId and
  // there's exactly one saved record already linked to it, jump straight into editing
  // that record instead of a blank form — this is the "이어서 하기" behavior.
  function maybeAutoSelect(items) {
    if (autoSelected || !linkedJobId) return;
    autoSelected = true;
    const matches = items.filter((i) => i.jobId === linkedJobId);
    if (matches.length === 1) {
      currentId = matches[0].id;
      fillState(matches[0]);
      el.status.textContent = `이 주문에 저장된 실측 기록("${matches[0].name || '이름 없음'}")을 불러왔습니다. 수정 후 저장하면 갱신됩니다.`;
    } else if (matches.length > 1) {
      el.status.textContent = `이 주문에 저장된 기록이 ${matches.length}개 있습니다. 아래 "저장된 방" 목록(연두색 표시)에서 골라주세요.`;
    } else {
      clearForm();
    }
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // ---------- Export to standalone HTML report (photos embedded, viewable offline forever) ----------
  function fmtRow(label, value) {
    if (value === null || value === undefined || value === '') return '';
    return `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(String(value))}</td></tr>`;
  }

  function buildRoomSectionHtml(item) {
    const savedDate = item.savedAt ? new Date(item.savedAt).toLocaleString('ko-KR') : '-';
    const photos = Array.isArray(item.photos) ? item.photos : (item.photo ? [item.photo] : []);
    const photosHtml = photos.length
      ? `<div class="photos">${photos.map((p) => `<img src="${p}" alt="현장 사진">`).join('')}</div>`
      : '<p class="muted">첨부된 사진 없음</p>';

    const boxRows = item.hasBox
      ? fmtRow('커튼박스 구간 천고', item.boxCeiling != null ? item.boxCeiling + 'mm' : '(미입력)')
        + fmtRow('커튼박스 폭(벽에서 거리)', item.boxWidth != null ? item.boxWidth + 'mm' : '(미입력)')
        + fmtRow('커튼박스 길이', item.boxSpan != null ? item.boxSpan + 'mm' : '(미입력, 양쪽 벽까지)')
      : '';

    const wallRows = fmtRow('벽 표시', [
      item.wallBack !== false ? '창문벽' : null,
      item.wallFront !== false ? '맞은편벽' : null,
      item.wallLeft !== false ? '좌측벽' : null,
      item.wallRight !== false ? '우측벽' : null,
    ].filter(Boolean).join(', ') || '전체 숨김');

    const winRows = item.winEnabled !== false
      ? fmtRow('창문 폭', item.winWidth != null ? item.winWidth + 'mm' : '(추정)')
        + fmtRow('창문 높이', item.winHeight != null ? item.winHeight + 'mm' : '(추정)')
        + fmtRow('창문 하단 높이', item.winSill != null ? item.winSill + 'mm' : '(추정)')
        + fmtRow('좌측벽에서 창문까지', item.winOffsetX != null ? item.winOffsetX + 'mm' : '(추정)')
        + (item.winProt ? fmtRow('창문 돌출 깊이', (item.winDepth ?? 50) + 'mm') : '')
        + (item.handleProt ? fmtRow('손잡이 돌출 깊이', (item.handleDepth ?? 50) + 'mm') : '')
        + (item.handleProt ? fmtRow('손잡이 높이', item.handleHeight != null ? item.handleHeight + 'mm' : '(추정)') : '')
      : fmtRow('창문', '없음');

    const doorRows = item.doorEnabled
      ? fmtRow('문 위치', { left: '좌측벽', right: '우측벽', front: '맞은편벽' }[item.doorWall] || item.doorWall)
        + fmtRow('창문벽 모서리에서 문까지', item.doorOffset != null ? item.doorOffset + 'mm' : '(추정)')
      : '';

    return `
      <section class="room">
        <h2>${escapeHtml(item.name || '이름 없음')}</h2>
        <div class="muted">저장 시각: ${escapeHtml(savedDate)}</div>
        <table>
          ${fmtRow('가로', item.width != null ? item.width + 'mm' : '-')}
          ${fmtRow('세로', item.depth != null ? item.depth + 'mm' : '(추정)')}
          ${fmtRow('천고', item.ceiling != null ? item.ceiling + 'mm' : '-')}
          ${boxRows}
          ${wallRows}
          ${winRows}
          ${doorRows}
          ${fmtRow('메모', item.memo || null)}
        </table>
        ${photosHtml}
      </section>
    `;
  }

  function buildReportDocument(title, sectionsHtml) {
    return `<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#F4F7FA; color:#14213D; margin:0; padding:24px; }
  h1 { font-size:20px; margin:0 0 4px; }
  .muted { color:#5C7089; font-size:12.5px; margin-bottom:14px; }
  .room { background:#fff; border:1px solid #E3E9EF; border-radius:10px; padding:20px; margin-bottom:20px; max-width:720px; }
  .room h2 { margin:0 0 4px; font-size:17px; }
  table { border-collapse:collapse; width:100%; margin:14px 0; font-size:13.5px; }
  th, td { text-align:left; padding:5px 10px 5px 0; border-bottom:1px solid #EEF2F6; vertical-align:top; }
  th { color:#5C7089; font-weight:600; width:170px; white-space:nowrap; }
  .photos { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
  .photos img { width:160px; height:160px; object-fit:cover; border-radius:8px; border:1px solid #E3E9EF; }
  @media print { body{background:#fff;} .room{box-shadow:none; border:none; page-break-inside:avoid;} }
</style></head>
<body>
  <h1>시스템 행거장 설치 사전 실측 — ${escapeHtml(title)}</h1>
  <div class="muted">생성 시각: ${escapeHtml(new Date().toLocaleString('ko-KR'))} · 인쇄 메뉴에서 "PDF로 저장"도 가능합니다.</div>
  ${sectionsHtml}
</body></html>`;
  }

  function downloadTextFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function exportRooms(items) {
    if (!items.length) return;
    const title = items.length === 1 ? (items[0].name || '이름 없음') : `방 ${items.length}개`;
    const html = buildReportDocument(title, items.map(buildRoomSectionHtml).join(''));
    const safeName = (items.length === 1 ? (items[0].name || 'room') : 'rooms_all')
      .replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ\-]+/g, '_');
    downloadTextFile(`${safeName}_실측기록.html`, html, 'text/html');
    el.status.textContent = '파일로 저장했습니다. 다운로드 폴더를 확인하세요.';
  }

  async function deleteRoom(id) {
    try {
      const idx = await window.storage.get('rooms-index', false).catch(() => null);
      let ids = idx ? JSON.parse(idx.value) : [];
      ids = ids.filter((x) => x !== id);
      await window.storage.set('rooms-index', JSON.stringify(ids), false);
      await window.storage.delete('rooms:' + id, false).catch(() => {});
      if (currentId === id) clearForm();
      await loadList();
    } catch (e) {
      el.status.textContent = '삭제 중 오류가 발생했습니다.';
    }
  }

  function svgToDataUrl(svgElement) {
    let svgStr = new XMLSerializer().serializeToString(svgElement);
    if (!svgStr.includes('xmlns=')) {
      svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
  }

  function captureDrawingSnapshots() {
    return [
      { label: 'A벽(창문벽)', dataUrl: svgToDataUrl(el.svgWallA) },
      { label: 'B벽', dataUrl: svgToDataUrl(el.svgWallB) },
      { label: 'C벽(맞은편)', dataUrl: svgToDataUrl(el.svgWallC) },
      { label: 'D벽', dataUrl: svgToDataUrl(el.svgWallD) },
      { label: '평면도', dataUrl: svgToDataUrl(el.svgPlan) },
    ];
  }

  async function saveRoom() {
    const s = readState();
    if (!s.width && !s.ceiling) {
      el.status.textContent = '최소한 가로 길이나 천고를 입력해주세요.';
      return;
    }
    const id = currentId || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
    const record = Object.assign({ id, savedAt: Date.now(), drawingSnapshots: captureDrawingSnapshots() }, s);
    if (linkedJobId) record.jobId = linkedJobId;
    try {
      await window.storage.set('rooms:' + id, JSON.stringify(record), false);
      const idxRes = await window.storage.get('rooms-index', false).catch(() => null);
      let ids = idxRes ? JSON.parse(idxRes.value) : [];
      if (!ids.includes(id)) ids.push(id);
      await window.storage.set('rooms-index', JSON.stringify(ids), false);
      currentId = id;
      el.status.textContent = `저장됨: "${s.name || '이름 없음'}"` + (linkedJobId ? ' — 이 주문과 연결되었습니다. 다음에 "실측 앱 열기"를 누르면 바로 이 기록으로 연결됩니다.' : '');
      await loadList();
    } catch (e) {
      el.status.textContent = '저장 중 오류가 발생했습니다.';
    }

  }

  // ---------- Events ----------
  [el.name, el.width, el.depth, el.ceiling, el.boxceiling, el.boxwidth, el.boxspan, el.boxoffsetx, el.windepth, el.winwidth, el.winheight, el.winsill, el.winoffsetx, el.handledepth, el.handleheight, el.dooroffset, el.doorwidth, el.doorheight, el.acwidth, el.acdepth, el.acoffsetx, el.acoffsetz, el.acthick, el.memo]
    .forEach((input) => input.addEventListener('input', render));
  [el.hasbox, el.wallback, el.wallfront, el.wallleft, el.wallright, el.winenabled, el.winprot, el.handleprot, el.door, el.acenabled].forEach((cb) =>
    cb.addEventListener('change', () => { syncSubFields(); render(); })
  );
  el.doorwall.addEventListener('change', render);
  el.save.addEventListener('click', saveRoom);
  el.newBtn.addEventListener('click', clearForm);
  el.exportAll.addEventListener('click', () => exportRooms(cachedItems));

  // 3D corner toolbar: quick on/off chips for window / curtain box / door / ac / appliance
  [el.chipWindow, el.chipBox, el.chipDoor, el.chipAc, el.chipAppliance].forEach((chip) => {
    chip.addEventListener('pointerdown', (e) => e.stopPropagation());
  });
  el.chipWindow.addEventListener('click', (e) => {
    e.stopPropagation();
    el.winenabled.checked = !el.winenabled.checked;
    syncSubFields(); render();
  });
  el.chipBox.addEventListener('click', (e) => {
    e.stopPropagation();
    el.hasbox.checked = !el.hasbox.checked;
    syncSubFields(); render();
  });
  el.chipDoor.addEventListener('click', (e) => {
    e.stopPropagation();
    el.door.checked = !el.door.checked;
    syncSubFields(); render();
  });
  el.chipAc.addEventListener('click', (e) => {
    e.stopPropagation();
    el.acenabled.checked = !el.acenabled.checked;
    syncSubFields(); render();
  });
  el.chipAppliance.addEventListener('click', (e) => {
    e.stopPropagation();
    el.applianceVisible.checked = !el.applianceVisible.checked;
    render();
  });
  el.doorWallsRow.querySelectorAll('[data-wall]').forEach((btn) => {
    btn.addEventListener('pointerdown', (e) => e.stopPropagation());
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      el.doorwall.value = btn.dataset.wall;
      render();
    });
  });

  // dimension category filter: only the pressed category's dimension lines render (전체 = all)
  el.dimFilterRow.querySelectorAll('[data-cat]').forEach((btn) => {
    btn.addEventListener('pointerdown', (e) => e.stopPropagation());
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      activeDimFilter = btn.dataset.cat;
      el.dimFilterRow.querySelectorAll('[data-cat]').forEach((b) => {
        b.classList.toggle('on', b.dataset.cat === activeDimFilter);
      });
      render();
    });
  });

  el.applianceAdd.addEventListener('click', () => {
    if (currentAppliances.length >= MAX_APPLIANCES) return;
    applianceSeq += 1;
    currentAppliances.push({
      id: 'appl' + Date.now() + applianceSeq,
      name: '',
      width: 600, depth: 600, height: 1800,
      offsetX: null, offsetZ: null,
    });
    updateApplianceRows();
    render();
  });

  el.photoInput.addEventListener('change', async () => {
    const files = Array.from(el.photoInput.files || []);
    el.photoInput.value = ''; // allow re-selecting the same file later
    if (!files.length) return;
    const room = MAX_PHOTOS - currentPhotos.length;
    const toProcess = files.slice(0, room);
    const skipped = files.length - toProcess.length;
    el.status.textContent = '사진 처리 중…';
    try {
      for (const file of toProcess) {
        const dataUrl = await resizeImageFile(file, 1000, 0.62);
        currentPhotos.push(dataUrl);
        updatePhotoGrid();
      }
      el.status.textContent = skipped > 0
        ? `사진 ${toProcess.length}장 첨부됨 (최대 ${MAX_PHOTOS}장이라 ${skipped}장은 제외). 저장을 눌러야 반영됩니다.`
        : '사진이 첨부되었습니다. 저장을 눌러야 방 기록에 반영됩니다.';
    } catch (e) {
      el.status.textContent = '사진을 처리하지 못했습니다.';
    }
  });
  el.photoGrid.addEventListener('click', (e) => {
    const del = e.target.closest('.csa-photo-del');
    if (del) {
      const i = parseInt(del.dataset.i, 10);
      currentPhotos.splice(i, 1);
      updatePhotoGrid();
      return;
    }
    if (e.target.tagName === 'IMG') openLightbox(e.target.src);
  });
  el.lightbox.addEventListener('click', closeLightbox);
  el.lightboxClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
  el.lightboxImg.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // init
  syncSubFields();
  updatePhotoGrid();
  updateApplianceRows();
  render();
  loadList();
})();
</script>

</body>
</html>
