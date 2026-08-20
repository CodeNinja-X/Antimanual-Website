import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ChevronLeft, ChevronRight, ThumbsUp, FileSpreadsheet, Check, Sliders, Copy, LayoutGrid, Menu, Scissors, Search, MessageSquare, ExternalLink } from 'lucide-react';
import SAMURAI_BASE from './assets/samurai_base.png';
import SAMURAI_REVEAL from './assets/samurai_reveal.png';
import ANTIMANUAL_LOGO from './assets/antimanual_logo.png';
import CustomCursor from './CustomCursor';
import SamuraiMorph from './SamuraiMorph';

const EASE = [0.16, 1, 0.3, 1];
const PHOTOSHOP_DOWNLOAD_URL = 'https://github.com/CodeNinja-X/Antimanual-Release/releases/download/v4.53.8/antimanual.Setup.v4.53.8.exe';

const SOFTWARE_FEATURES = {
  illustrator: [
    {
      id: '01',
      title: 'Design Transfer',
      shortDesc: 'Template Transfer & Rules',
      headline: 'Automated Template Transfer & Dynamic Guide Rules',
      description: 'Batch process design artwork across folder templates with intelligent background fit modes, auto-scaling, customizable neck/name tag visibility, and dynamic transfer mapping.',
      highlights: [
        'Source Folder File Explorer — Visual tree explorer with breadcrumbs, deep folder scanning, instant search, and global selection toggle',
        'Garment Config & Preset Profiles — Automatic template category matching and preset loading for full size runs',
        'Background Fit Modes — Flexible background filling supporting Scale Cover (Uniform) or Stretch Fill (Non-Uniform)',
        'Name & Neck Tag Visibility — Configurable name tag visibility, target item naming ("tag"), and neck tag hex color assignment',
        'Skip Processed Protection — Automatically skips files previously processed in DONE/ directory to prevent redundant runs',
        'Interactive Transfer Mapping — Configure custom anchor, bounding box, and artwork placement rules across apparel pieces',
        'Real-Time Execution Engine — Live progress bar, step status indicators, interactive pause/stop controls, and integrated log console',
        'Fast Folder Reveal — One-click OS file manager opening directly to the destination export folder'
      ]
    },
    {
      id: '02',
      title: 'Batch Rename',
      shortDesc: 'Rule-Based Artboard Renaming',
      headline: 'Rule-Based Artboard Renaming & Multi-Format Export',
      description: 'Batch process design files from CSV data, apply auto-scaling limits, and export to multiple formats with JobOptions configuration.',
      highlights: [
        'CSV Token Mapping File — Load order CSV/TSV sheets with layout names, sizes, player names, numbers, and labels',
        'Auto-Scale & Bounding Limits — Set individual layer width/height constraints with proportional or directional bounds',
        'AI Export Engine — Automated Adobe Illustrator (.ai) export with file compression and CS/CC version compatibility',
        'Commercial PDF & JobOptions — Embed vector fonts or load custom .joboptions configuration files for commercial print runs',
        'Multi-Format Output Matrix — Batch render to PNG (custom DPI resolution & transparency), EPS, SVG, and rasterized formats',
        'Selective Artboard Processing — Choose specific artboards or size variants with live status and duplicate collision checks',
        'Execution Log & Clipboard Copy — Live console logging with one-click log copying and export history tracking'
      ]
    },
    {
      id: '03',
      title: 'Auto Box',
      shortDesc: 'Smart Boundary Detection',
      headline: 'Visual Real Canvas Bounding & Snap Detection',
      description: 'Automatically detect artwork contours and generate pixel-perfect bounding boxes around group elements and images in active Illustrator documents.',
      highlights: [
        'Visual Real Canvas Box — Interactive 2D canvas displaying live bounding box boundaries, item counts, and selection highlights',
        'Group & Image Auto-Detection — Deep layer inspection automatically identifies vector artwork groups and linked/embedded raster assets',
        'Configurable Padding Offsets — Fine-tune perimeter padding in points (pt) or pixels (px) with millimeter-level precision',
        'Centering & Alignment Engine — Snaps and centers generated bounding boxes to apparel sublimation template guidelines',
        'Whitespace & Margin Snapping — Trims transparent margins and computes exact graphic footprints for downstream nesting',
        'Real-Time Status & Console — Live document status verification with immediate error checking and feedback'
      ]
    },
    {
      id: '04',
      title: 'Nesting',
      shortDesc: 'Sublimation Yield Optimizer',
      headline: 'Industrial 2D Polygon Nesting Pipeline v3.0',
      description: 'High-speed C++ polygon nesting engine arranges varied pattern pieces onto sublimation roll widths to maximize fabric yield with visual HTML reporting.',
      highlights: [
        'Substrate & Roll Controls — Configure roll width, continuous auto-height, gap spacing, and bleed margins',
        'True-Shape Hull Extraction — High-precision Polygon NFP (No-Fit Polygon), Convex Hull, and Fast Rectangular box modes',
        'Advanced C++ Packing Engine — Multi-threaded bin packing with customizable sort strategies, packing density, and rotation angle steps',
        'Real-Time HTML Yield Report — Embedded visual report pane showing total sheets, roll utilization %, and part placement',
        'Workspace & Preset Management — Save, load, and auto-sync pipeline configuration JSON files across production workstations',
        'Multi-Threaded Execution — Optimized multi-core worker threads for high-throughput nesting on large garment orders',
        'Direct RIP Output Stream — Export production-ready print layouts ready for dye-sublimation wide-format transfer'
      ]
    }
  ],
  photoshop: [
    {
      id: '01',
      title: 'Resize / Rename',
      shortDesc: 'PrintFlow & Roster Automation',
      headline: 'Automated Roster Grading & Layer Rules Engine',
      description: 'Paste PrintFlow CSV or TSV order sheets to automatically populate player names, numbers, logos, and custom team fields across full garment size sets. Includes auto layer detection, automatic fallback for blank templates, auto-trim, and multi-format export.',
      highlights: [
        'PrintFlow CSV/TSV Roster Input — Direct clipboard paste or CSV file loading with automatic token-to-layer mapping',
        'Auto Layer Matching & Scoring — Intelligent layer tree inspection matching CSV headers to Photoshop text and art layers',
        'Resize-Only Auto-Save Mode — Automatically grades and saves blank apparel templates if no name/number layers exist',
        'Logo & Custom Layer Constraints — Set max width/height limits and directional text bounds (0 = AUTO native scaling)',
        'Garment Auto-Detect & Rules — Keyword mapping chains auto-select garment categories from filenames or input data',
        'Grading & Export Settings — Multi-format export (PSD, JPG, PNG, TIFF, PDF) with custom DPI, vibrance, and CMYK/RGB modes',
        'PDF Presets & JobOptions — Embed vector fonts or load custom .joboptions configuration files for commercial print runs',
        'Interactive Gate Verification — Layer match validation, selective size checkboxes, and special character flagging',
        'Document History & Fast Reveal — Searchable history of processed documents with one-click OS folder opening'
      ]
    },
    {
      id: '02',
      title: 'Smart Copies',
      shortDesc: 'Clipboard & Asset Replication',
      headline: 'Rapid Clipboard & Pattern Piece Replication',
      description: 'Paste clipboard data or order CSVs to instantly duplicate and distribute pattern pieces across multiple sizes, colorways, and garment accessory parts with zero manual copy-pasting.',
      highlights: [
        'CSV Order Sheet Parser — Automatically detects row count (Option 2) or total item quantity sum (Option 3)',
        'Source Folder Auto-Scan — Automatically scans and pairs accessory image files including Plackets, Collars, and Ribbing',
        'Accessory Quantity Auto-Fill — Populates piece counts automatically based on the detected CSV schema',
        'Batch File Generation — Concurrently duplicates and maps graphics across all garment sizes with high throughput',
        'Smart Object & Style Preservation — Retains Smart Object embedded assets, layer blend modes, and non-destructive filters',
        'Automated Folder Routing — Organizes and exports generated files directly into structured SKU and size directories'
      ]
    },
    {
      id: '03',
      title: 'Size Manager',
      shortDesc: 'Custom Apparel Sizing Profiles',
      headline: 'Custom Apparel Grading & Measurement Profiles',
      description: 'Configure exact garment dimensions, proportional scaling deltas, and size charts by category (jerseys, shorts, hoodies) with sub-millimeter precision and real-time visual canvas feedback.',
      highlights: [
        'Percentage Sizing Presets — Add individual size entries or bulk paste multi-line sizing data (Size, Width%, Height%)',
        'Custom Physical Unit Conversion — Configure in Inches, Centimeters, Millimeters, or Pixels with template reference conversion',
        'Interactive 2D Scaling Visualizer — Real-time canvas rendering selected size boundaries relative to 100% template baseline',
        'Garment Category Management — Create, rename, delete, and manage unlimited apparel preset databases',
        'Database Registration — Convert custom physical dimensions to percentage rules and save to persistent storage',
        'JSON Import & Export Backup — Backup, restore, and share size configuration files across production workstations',
        'Active Unit Switching — Seamlessly toggle active display units (%, in, cm, mm, px) across the entire Size Manager'
      ]
    },
    {
      id: '04',
      title: 'Nesting',
      shortDesc: 'Fabric Roll Yield Optimizer',
      headline: '2D Fabric Roll Layout & Yield Optimizer',
      description: 'High-speed nesting studio arranges varied apparel pieces onto sublimation roll widths to maximize fabric yield and minimize textile waste with interactive canvas controls and tile-based hi-res export.',
      highlights: [
        'File Dropzone with DPI Detection — Drag and drop images, PDFs, and PSDs with automatic EXIF/JFIF header DPI extraction',
        'Auto Contour Hull Extraction — True-shape Polygon NFP, Convex Hull, or Fast Rectangular bounding box per item',
        '3 High-Yield Packing Algorithms — MaxRects, Guillotine Split, and Skyline Bottom-Left bin packing heuristics',
        'Interactive Canvas with Magnetic Snapping — Drag-and-drop piece relocation with guide alignment and collision prevention',
        'Substrate & Strategy Controls — Roll width, continuous auto-height, gap spacing, bleed margin, and 5 rotation step modes',
        'Multi-Sheet Efficiency Tracking — Automatically generates multiple sheets with real-time fabric yield utilization percentage',
        'Multi-Format Print Export — Export to JPG, PNG, PDF, SVG, or JSON layout with sRGB/CMYK color and horizontal transfer flip',
        'Hi-Res Stitching Engine — Tile-based canvas rendering and Python/GDI+ stitching supporting files up to 60,000+ pixels tall'
      ]
    }
  ]
};

const HOW_IT_WORKS_VIDEOS = {
  photoshop: [
    {
      id: 'ps-sublimation',
      title: 'Photoshop Sublimation Automation',
      videoId: 'oOZkoY7WSZY',
      embedUrl: 'https://www.youtube.com/embed/oOZkoY7WSZY?rel=0&modestbranding=1&autoplay=0'
    }
  ],
  illustrator: [
    {
      id: 'ai-sublimation',
      title: 'Illustrator Sublimation Automation',
      videoId: 'oOZkoY7WSZY',
      embedUrl: 'https://www.youtube.com/embed/oOZkoY7WSZY?rel=0&modestbranding=1&autoplay=0'
    }
  ]
};

function VectorCardScaler({ targetWidth, targetHeight, children, className = '' }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const computeScale = () => {
      const parent = el.parentElement;
      const w = parent ? parent.clientWidth : el.clientWidth;
      const h = parent ? parent.clientHeight : el.clientHeight;
      if (w > 0 && h > 0) {
        const s = Math.min(w / targetWidth, h / targetHeight);
        setScale(s);
      }
    };

    computeScale();

    const ro = new ResizeObserver(() => {
      computeScale();
    });
    if (el.parentElement) ro.observe(el.parentElement);
    ro.observe(el);

    window.addEventListener('resize', computeScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeScale);
    };
  }, [targetWidth, targetHeight]);

  return (
    <div
      ref={containerRef}
      className={`vector-card-scaler ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          width: `${targetWidth}px`,
          height: `${targetHeight}px`,
          minWidth: `${targetWidth}px`,
          minHeight: `${targetHeight}px`,
          maxWidth: `${targetWidth}px`,
          maxHeight: `${targetHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          pointerEvents: 'auto',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SizeManagerHeroCard() {
  return (
    <div className="am-electron-window size-manager-window ps-module-card">
      <div className="am-win-header">
        <div className="am-app-title-group">
          <img src={ANTIMANUAL_LOGO} alt="Antimanual" className="am-header-icon" draggable={false} />
          <span className="am-header-title">Antimanual</span>
        </div>
        <div className="header-status-area">
          <span className="am-connection-status">
            <span className="am-status-dot" />
            Ps Connected
          </span>
        </div>
        <div className="am-win-controls">
          <div className="am-win-btn" title="Minimize">
            <svg width="9" height="9" viewBox="0 0 11 11" fill="none"><rect y="5" width="11" height="1.2" fill="currentColor" /></svg>
          </div>
          <div className="am-win-btn" title="Maximize">
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><rect x="0.6" y="0.6" width="8.8" height="8.8" stroke="currentColor" strokeWidth="1.2" /></svg>
          </div>
          <div className="am-win-btn am-close-action" title="Close">
            <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </div>
        </div>
      </div>
      <div className="am-dashboard-layout">
        <div className="am-sidebar-nav">
          <div className="am-sidebar-top">
            <div className="am-sidebar-toggle-btn">
              <Menu size={13} className="am-nav-icon" />
              <span className="am-nav-label font-bold">Photoshop</span>
            </div>
            <div className="am-sidebar-btn">
              <FileSpreadsheet size={12} className="am-nav-icon" />
              <span className="am-nav-label">Resize / Rename</span>
            </div>
            <div className="am-sidebar-btn">
              <Copy size={12} className="am-nav-icon" />
              <span className="am-nav-label">Smart Copies</span>
            </div>
            <div className="am-sidebar-btn active">
              <Sliders size={12} className="am-nav-icon" />
              <span className="am-nav-label font-bold">Size Manager</span>
            </div>
            <div className="am-sidebar-btn">
              <LayoutGrid size={12} className="am-nav-icon" />
              <span className="am-nav-label">Auto-Nesting</span>
            </div>
          </div>
        </div>
        <div className="am-content-frame">
          <div className="sm-subtabs-bar">
            <button className="sm-subtab-btn active">Sizing Data</button>
            <button className="sm-subtab-btn">Add Size (%)</button>
            <button className="sm-subtab-btn">Custom Size</button>
          </div>
          <div className="sm-tab-content-pane">
            <div className="sm-cards-row">
              <div className="sm-card sm-garment-card">
                <h3 className="sm-card-title">Select Active Garment</h3>
                <p className="sm-card-desc">Select a category to view and edit size presets:</p>
                <div className="sm-category-selector">
                  <label className="sm-field-label">Garment:</label>
                  <div className="sm-mock-select">Mens Basketball Jersey</div>
                  <button className="sm-action-btn">Rename</button>
                  <button className="sm-action-btn sm-btn-del">Delete</button>
                </div>
              </div>
              <div className="sm-card sm-settings-card">
                <h3 className="sm-card-title">Size Manager Settings</h3>
                <p className="sm-card-desc">Configure active measurement unit:</p>
                <div className="sm-category-selector">
                  <label className="sm-field-label">Active:</label>
                  <div className="sm-mock-select sm-unit-select">Percent (%)</div>
                </div>
              </div>
            </div>
            <div className="sm-card sm-table-card">
              <h3 className="sm-card-title">Active Preset Sizing Database</h3>
              <div className="sm-table-container">
                <div className="sm-table-header">
                  <span className="sm-col-name">Size Format</span>
                  <span className="sm-col-width">Width (%)</span>
                  <span className="sm-col-height">Height (%)</span>
                  <span className="sm-col-action"></span>
                </div>
                <div className="sm-table-body">
                  <div className="sm-table-row">
                    <span className="sm-col-name font-bold">3XS</span>
                    <span className="sm-col-width font-mono">76.00 %</span>
                    <span className="sm-col-height font-mono">80.00 %</span>
                    <span className="sm-col-action"><button className="sm-delete-btn">✕</button></span>
                  </div>
                  <div className="sm-table-row">
                    <span className="sm-col-name font-bold">2XS</span>
                    <span className="sm-col-width font-mono">82.00 %</span>
                    <span className="sm-col-height font-mono">85.00 %</span>
                    <span className="sm-col-action"><button className="sm-delete-btn">✕</button></span>
                  </div>
                  <div className="sm-table-row">
                    <span className="sm-col-name font-bold">XS</span>
                    <span className="sm-col-width font-mono">88.00 %</span>
                    <span className="sm-col-height font-mono">90.00 %</span>
                    <span className="sm-col-action"><button className="sm-delete-btn">✕</button></span>
                  </div>
                  <div className="sm-table-row">
                    <span className="sm-col-name font-bold">S</span>
                    <span className="sm-col-width font-mono">94.00 %</span>
                    <span className="sm-col-height font-mono">95.00 %</span>
                    <span className="sm-col-action"><button className="sm-delete-btn">✕</button></span>
                  </div>
                  <div className="sm-table-row selected">
                    <span className="sm-col-name font-bold sm-master-text">M</span>
                    <span className="sm-col-width font-mono sm-master-text">100.00 %</span>
                    <span className="sm-col-height font-mono sm-master-text">100.00 %</span>
                    <span className="sm-col-action"><button className="sm-delete-btn">✕</button></span>
                  </div>
                  <div className="sm-table-row">
                    <span className="sm-col-name font-bold">L</span>
                    <span className="sm-col-width font-mono">106.50 %</span>
                    <span className="sm-col-height font-mono">105.00 %</span>
                    <span className="sm-col-action"><button className="sm-delete-btn">✕</button></span>
                  </div>
                  <div className="sm-table-row">
                    <span className="sm-col-name font-bold">XL</span>
                    <span className="sm-col-width font-mono">113.00 %</span>
                    <span className="sm-col-height font-mono">110.00 %</span>
                    <span className="sm-col-action"><button className="sm-delete-btn">✕</button></span>
                  </div>
                  <div className="sm-table-row">
                    <span className="sm-col-name font-bold">2XL</span>
                    <span className="sm-col-width font-mono">120.00 %</span>
                    <span className="sm-col-height font-mono">116.00 %</span>
                    <span className="sm-col-action"><button className="sm-delete-btn">✕</button></span>
                  </div>
                  <div className="sm-table-row">
                    <span className="sm-col-name font-bold">3XL</span>
                    <span className="sm-col-width font-mono">127.00 %</span>
                    <span className="sm-col-height font-mono">122.00 %</span>
                    <span className="sm-col-action"><button className="sm-delete-btn">✕</button></span>
                  </div>
                  <div className="sm-table-row">
                    <span className="sm-col-name font-bold">4XL</span>
                    <span className="sm-col-width font-mono">134.00 %</span>
                    <span className="sm-col-height font-mono">128.00 %</span>
                    <span className="sm-col-action"><button className="sm-delete-btn">✕</button></span>
                  </div>
                  <div className="sm-table-row">
                    <span className="sm-col-name font-bold">5XL</span>
                    <span className="sm-col-width font-mono">141.00 %</span>
                    <span className="sm-col-height font-mono">134.00 %</span>
                    <span className="sm-col-action"><button className="sm-delete-btn">✕</button></span>
                  </div>
                </div>
              </div>
              <div className="sm-row-helper-desc">
                Click any size row to load it into the preview visualizer.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintFlowHeroCard() {
  return (
    <div className="am-electron-window basic-mode-window">
      <div className="am-win-header">
        <div className="am-app-title-group">
          <img src={ANTIMANUAL_LOGO} alt="Antimanual" className="am-header-icon" draggable={false} />
          <span className="am-header-title">Antimanual</span>
        </div>
        <div className="am-header-status">
          <span className="am-connection-status">
            <span className="am-status-dot" />
            Ps Connected
          </span>
        </div>
        <div className="am-win-controls">
          <div className="am-win-btn" title="Minimize">
            <svg width="9" height="9" viewBox="0 0 11 11" fill="none"><rect y="5" width="11" height="1.2" fill="currentColor" /></svg>
          </div>
          <div className="am-win-btn" title="Maximize">
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><rect x="0.6" y="0.6" width="8.8" height="8.8" stroke="currentColor" strokeWidth="1.2" /></svg>
          </div>
          <div className="am-win-btn am-close-action" title="Close">
            <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </div>
        </div>
      </div>
      <div className="bm-gate-card">
        <div className="bm-gate-title">Comparing CSV columns with Photoshop layers:</div>
        <table className="bm-response-table">
          <thead>
            <tr>
              <th>CSV Column</th>
              <th>Layer Match</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PLAYER_NAME</td>
              <td className="bm-gate-count-ok">14 matches</td>
            </tr>
            <tr>
              <td>PLAYER_NUMBER</td>
              <td className="bm-gate-count-ok">14 matches</td>
            </tr>
            <tr>
              <td>SIZE_CODE</td>
              <td className="bm-gate-count-ok">14 matches</td>
            </tr>
          </tbody>
        </table>
        <div className="bm-gate-btns">
          <button className="bm-gate-btn bm-gate-btn-confirm">Confirm</button>
          <button className="bm-gate-btn bm-gate-btn-secondary">Resize Only</button>
          <button className="bm-gate-btn bm-gate-btn-cancel">Cancel</button>
        </div>
      </div>
      <div className="bm-input-area">
        <div className="bm-input-card">
          <div className="bm-file-chip">
            <div className="bm-file-chip-icon">
              <FileSpreadsheet size={13} />
            </div>
            <div className="bm-file-chip-details">
              <span className="bm-file-chip-name">roster_orders_2026.csv</span>
              <span className="bm-file-chip-meta">1.8 KB</span>
            </div>
          </div>
          <div className="bm-toolbar">
            <div className="bm-mock-garment">Mens Jersey</div>
            <button className="bm-garment-rules-btn">Rules</button>
            <span className="bm-spacer" />
            <button className="bm-send-btn" title="Run Batch">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IllustratorBatchHeroCard() {
  return (
    <div className="tab-panel illu-batch-panel" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e', overflow: 'hidden' }}>
      {/* Window Header */}
      <div className="window-header">
        <div className="app-title-group">
          <img src={ANTIMANUAL_LOGO} alt="Icon" className="header-icon" />
          <span id="header-title" className="header-title">Antimanual</span>
        </div>
        <div className="header-status-area">
          <span id="app-connection-status" className="connection-status">Ai Connected</span>
        </div>
        <div className="window-controls">
          <div id="min-btn" className="win-btn">&minus;</div>
          <div id="max-btn" className="win-btn">&#9633;</div>
          <div id="close-btn" className="win-btn close-action">&times;</div>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Left Sidebar Navbar */}
        <div className="dashboard-sidebar-nav navbar" id="navbar">
          <div className="top-buttons-frame" id="top-buttons-frame">
            <div className="sidebar-header-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 6px', marginBottom: '2px' }}>
              <button id="sidebar-toggle-btn" className="sidebar-toggle-btn" title="Toggle Sidebar" style={{ background: 'none', border: 'none', padding: 0, margin: 0, width: 'auto', height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888888', cursor: 'pointer', flexShrink: 0 }}>
                <span className="sidebar-btn-icon sidebar-toggle-icon" style={{ display: 'flex', alignItems: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </span>
              </button>
              <span className="sidebar-title-text" style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#f0f0f0', whiteSpace: 'nowrap' }}>Illustrator</span>
            </div>
            <button className="sidebar-btn active">
              <span className="sidebar-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
              </span>
              <span className="sidebar-btn-text">Design Transfer</span>
            </button>
            <button className="sidebar-btn">
              <span className="sidebar-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line></svg>
              </span>
              <span className="sidebar-btn-text">Batch Rename</span>
            </button>
            <button className="sidebar-btn">
              <span className="sidebar-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </span>
              <span className="sidebar-btn-text">Auto Box</span>
            </button>
            <button className="sidebar-btn">
              <span className="sidebar-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line></svg>
              </span>
              <span className="sidebar-btn-text">2D Nesting</span>
            </button>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="content-frame" id="content-frame" style={{ flexDirection: 'column' }}>
          {/* Header (Fixed) */}
          <div className="sm-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2e2e2e', padding: '12px 20px 8px 20px', flexShrink: 0 }}>
            <div style={{ textAlign: 'left' }}>
              <h1 className="welcome-title" style={{ margin: 0, fontSize: '13px', fontWeight: 300, textAlign: 'left', color: '#ffffff' }}>Illustrator Design Transfer Batch</h1>
              <p className="welcome-desc" style={{ margin: '2px 0 0 0', fontSize: '9.5px', color: '#888', textAlign: 'left' }}>Batch process design transfers and logo guide configs across folder templates.</p>
            </div>
            <div>
              <button id="illu-batch-transfer-btn" className="sm-btn sm-btn-secondary" style={{ height: '26px', padding: '0 10px', fontSize: '9.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
                Transfer Mapping
              </button>
            </div>
          </div>

          {/* Two-Column Batch Container */}
          <div className="illu-batch-container" style={{ flex: 1, display: 'flex', gap: '10px', padding: '10px 16px', overflow: 'hidden', minHeight: 0, boxSizing: 'border-box' }}>
            {/* Left Column: File Explorer */}
            <div className="illu-batch-left" style={{ flex: 1.2, display: 'flex', flexDirection: 'column', background: '#161616', border: '1px solid #2e2e2e', borderRadius: '6px', overflow: 'hidden', minHeight: 0 }}>
              {/* Path Selection Bar */}
              <div style={{ padding: '6px 10px', borderBottom: '1px solid #2e2e2e', display: 'flex', gap: '6px', alignItems: 'center', background: '#1a1a1a' }}>
                <span style={{ fontSize: '9.5px', color: '#888', whiteSpace: 'nowrap' }}>Source Folder:</span>
                <input type="text" id="illu-trans-folder-input" className="sm-input" value="/Templates/2026_Jerseys/" readOnly style={{ flex: 1, height: '22px', background: '#222', fontSize: '9.5px', cursor: 'pointer', color: '#ccc' }} />
                <button id="illu-trans-folder-browse" className="sm-btn sm-btn-secondary" style={{ height: '22px', margin: 0, padding: '0 8px', fontSize: '9.5px' }}>Browse</button>
              </div>

              {/* Breadcrumbs & Actions */}
              <div style={{ padding: '4px 10px', borderBottom: '1px solid #252525', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1c1c1c', gap: '6px' }}>
                <div id="illu-trans-breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', flex: 1, fontSize: '9.5px', color: '#aaa', whiteSpace: 'nowrap' }}>
                  <span>Root</span>
                  <span style={{ color: '#666' }}>/</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>2026_Jerseys</span>
                </div>
                <div className="search-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <button id="illu-trans-search-toggle" style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', outline: 'none' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </button>
                </div>
              </div>

              {/* Explorer File List */}
              <div id="illu-trans-explorer-list" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', background: '#141414', minHeight: 0 }}>
                <div className="explorer-row explorer-file" style={{ display: 'flex', alignItems: 'center', padding: '4px 10px', borderBottom: '1px solid #1c1c1c', gap: '8px' }}>
                  <input type="checkbox" className="explorer-file-chk" defaultChecked style={{ accentColor: '#b61942' }} />
                  <span style={{ color: '#888', display: 'flex', alignItems: 'center' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  </span>
                  <span style={{ fontSize: '9.5px', color: '#bbb', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Mens_Jersey_Home.ai</span>
                </div>
                <div className="explorer-row explorer-file" style={{ display: 'flex', alignItems: 'center', padding: '4px 10px', borderBottom: '1px solid #1c1c1c', gap: '8px' }}>
                  <input type="checkbox" className="explorer-file-chk" defaultChecked style={{ accentColor: '#b61942' }} />
                  <span style={{ color: '#888', display: 'flex', alignItems: 'center' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  </span>
                  <span style={{ fontSize: '9.5px', color: '#bbb', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Mens_Jersey_Away.ai</span>
                </div>
                <div className="explorer-row explorer-file" style={{ display: 'flex', alignItems: 'center', padding: '4px 10px', borderBottom: '1px solid #1c1c1c', gap: '8px' }}>
                  <input type="checkbox" className="explorer-file-chk" defaultChecked style={{ accentColor: '#b61942' }} />
                  <span style={{ color: '#888', display: 'flex', alignItems: 'center' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  </span>
                  <span style={{ fontSize: '9.5px', color: '#bbb', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Alternate_Jersey.ai</span>
                </div>
                <div className="explorer-row explorer-file" style={{ display: 'flex', alignItems: 'center', padding: '4px 10px', borderBottom: '1px solid #1c1c1c', gap: '8px' }}>
                  <input type="checkbox" className="explorer-file-chk" defaultChecked style={{ accentColor: '#b61942' }} />
                  <span style={{ color: '#888', display: 'flex', alignItems: 'center' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  </span>
                  <span style={{ fontSize: '9.5px', color: '#bbb', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Youth_Jersey_Home.ai</span>
                </div>
                <div className="explorer-row explorer-file" style={{ display: 'flex', alignItems: 'center', padding: '4px 10px', borderBottom: '1px solid #1c1c1c', gap: '8px' }}>
                  <input type="checkbox" className="explorer-file-chk" defaultChecked style={{ accentColor: '#b61942' }} />
                  <span style={{ color: '#888', display: 'flex', alignItems: 'center' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  </span>
                  <span style={{ fontSize: '9.5px', color: '#bbb', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Warmup_Hoodie_Master.ai</span>
                </div>
                <div className="explorer-row explorer-file" style={{ display: 'flex', alignItems: 'center', padding: '4px 10px', borderBottom: '1px solid #1c1c1c', gap: '8px' }}>
                  <input type="checkbox" className="explorer-file-chk" defaultChecked style={{ accentColor: '#b61942' }} />
                  <span style={{ color: '#888', display: 'flex', alignItems: 'center' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  </span>
                  <span style={{ fontSize: '9.5px', color: '#bbb', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Goalkeeper_Pro_Kit.ai</span>
                </div>
              </div>

              {/* Status Bar */}
              <div style={{ padding: '6px 10px', borderTop: '1px solid #2e2e2e', background: '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#888' }}>
                <div id="illu-trans-explorer-status">0 folder(s), 10 file(s)</div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <label className="sm-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', userSelect: 'none', color: '#ccc' }}>
                    <input type="checkbox" id="illu-trans-select-all" defaultChecked style={{ accentColor: '#b61942' }} /> Select All
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', userSelect: 'none' }}>
                    <label className="switch-toggle" style={{ margin: 0 }}>
                      <input type="checkbox" id="illu-trans-select-global" defaultChecked />
                      <span className="switch-slider"></span>
                    </label>
                    <span style={{ fontSize: '9px', color: '#ccc' }}>Select Global</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Settings & Execution Logs */}
            <div className="illu-batch-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', minHeight: 0, boxSizing: 'border-box' }}>
              {/* Settings Card */}
              <div className="sm-card" style={{ margin: 0, flexShrink: 0, boxSizing: 'border-box' }}>
                <h3 className="sm-card-title">Batch Configuration</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <label style={{ fontSize: '9px', color: '#aaa', width: '80px' }}>Garment Config:</label>
                    <select id="illu-trans-garment-select" className="dashboard-select" style={{ flex: 1 }}>
                      <option>Mens Basketball Jersey</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <label style={{ fontSize: '9px', color: '#aaa', width: '80px' }}>Background Fit:</label>
                    <select id="illu-trans-fit-select" className="dashboard-select" style={{ flex: 1 }}>
                      <option value="scale">Scale Cover (Uniform)</option>
                      <option value="stretch">Stretch Fill (Non-Uniform)</option>
                    </select>
                  </div>
                  <label className="sm-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', cursor: 'pointer', color: '#ccc' }}>
                    <input type="checkbox" id="illu-trans-skip-existing" defaultChecked style={{ accentColor: '#b61942' }} /> Skip files already processed in DONE/
                  </label>
                  <label className="sm-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', cursor: 'pointer', color: '#ccc' }}>
                    <input type="checkbox" id="illu-trans-show-tag" defaultChecked style={{ accentColor: '#b61942' }} /> Enable Name Tag Visibility
                  </label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <label style={{ fontSize: '9px', color: '#aaa', width: '80px' }}>Neck Tag Name:</label>
                    <input type="text" id="illu-trans-neck-tag-value" className="sm-input" defaultValue="NECK_TAG" style={{ flex: 1, height: '22px', fontSize: '9px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <label style={{ fontSize: '9px', color: '#aaa', width: '80px' }}>Neck Tag Color:</label>
                    <input type="text" id="illu-trans-neck-color" className="sm-input" defaultValue="#FFFFFF" style={{ flex: 1, height: '22px', fontSize: '9px' }} />
                  </div>
                </div>
              </div>

              {/* Log Console Card */}
              <div className="sm-card" style={{ margin: 0, flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', minHeight: '100px' }}>
                <h3 className="sm-card-title">Real-Time Log</h3>
                <div id="illu-trans-log-console" style={{ flex: 1, background: '#121212', border: '1px solid #252525', borderRadius: '4px', padding: '6px 8px', overflowY: 'auto', fontFamily: "'SFMono-Regular', Menlo, Monaco, Consolas, monospace", fontSize: '9px', color: '#adadad', lineHeight: '1.45', whiteSpace: 'pre-wrap' }}>
                  [TRANSFER] Connected to Adobe Illustrator CC.{"\n"}
                  [BATCH] 10 templates verified across source directory.{"\n"}
                  Ready to run batch execution.
                </div>
              </div>
            </div>
          </div>

          {/* Footer (Fixed) */}
          <div style={{ background: '#181818', borderTop: '1px solid #2e2e2e', padding: '6px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexShrink: 0, boxSizing: 'border-box', minHeight: '44px' }}>
            {/* Left Side: Integrated Execution Progress */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#aaa' }}>
                <span id="illu-trans-step-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#ccc' }}>Ready. Click Run Batch to start.</span>
                <span id="illu-trans-progress-percent" style={{ fontWeight: 600, color: '#ccc', marginLeft: '10px' }}>100%</span>
              </div>
              <div className="progress-bar-wrap" style={{ height: '4px', background: '#252525', borderRadius: '2px', overflow: 'hidden', width: '100%' }}>
                <div id="illu-trans-progress-inner" className="progress-bar-inner" style={{ height: '100%', background: '#b61942', width: '100%' }}></div>
              </div>
            </div>

            {/* Right Side: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <button id="illu-trans-btn-pause" className="sm-btn sm-btn-secondary" style={{ height: '26px', padding: '0 8px', fontSize: '9px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                Pause
              </button>
              <button id="illu-trans-btn-cancel" className="sm-btn stop-btn" style={{ height: '26px', padding: '0 8px', fontSize: '9px', background: '#333', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16"></rect></svg>
                Stop
              </button>
              <button id="illu-trans-btn-run" className="sm-btn" style={{ height: '26px', padding: '0 12px', fontWeight: 'bold', fontSize: '9.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Run Batch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IllustratorRenameHeroCard() {
  return (
    <div className="tab-panel illu-rename-panel" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e', overflow: 'hidden' }}>
      {/* Window Header */}
      <div className="window-header">
        <div className="app-title-group">
          <img src={ANTIMANUAL_LOGO} alt="Icon" className="header-icon" />
          <span id="header-title" className="header-title">Antimanual</span>
        </div>
        <div className="header-status-area">
          <span id="app-connection-status" className="connection-status">Ai Connected</span>
        </div>
        <div className="window-controls">
          <div id="min-btn" className="win-btn">&minus;</div>
          <div id="max-btn" className="win-btn">&#9633;</div>
          <div id="close-btn" className="win-btn close-action">&times;</div>
        </div>
      </div>

      {/* Header (Fixed) */}
      <div className="sm-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2e2e2e', padding: '8px 16px 6px 16px', flexShrink: 0 }}>
        <div style={{ textAlign: 'left' }}>
          <h1 className="welcome-title" style={{ margin: 0, fontSize: '12px', fontWeight: 300, textAlign: 'left', color: '#ffffff' }}>Illustrator Batch Rename</h1>
          <p className="welcome-desc" style={{ margin: '2px 0 0 0', fontSize: '8.5px', color: '#888', textAlign: 'left' }}>Batch process design files from CSV data, apply auto-scaling limits, and export to multiple formats.</p>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="brand-scrollbar-active" style={{ flex: 1, overflowY: 'auto', padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0, boxSizing: 'border-box' }}>
        
        {/* Row 1: File Paths */}
        <div className="sm-card" style={{ margin: 0, width: '100%', boxSizing: 'border-box', flexShrink: 0, padding: '7px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
            <h3 className="sm-card-title" style={{ margin: 0, fontSize: '10px' }}>File Paths</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '8.5px', color: '#aaa' }}>Enable Section</span>
              <label className="switch-toggle">
                <input type="checkbox" id="illu-filepaths-switch" defaultChecked />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>
          <p className="sm-card-desc" style={{ fontSize: '8.5px', margin: '2px 0 4px 0' }}>Select the CSV mapping file containing layout names, sizes, and labels:</p>
          <div id="illu-filepaths-body" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <input type="text" id="illu-csv-input" className="sm-input" value="/Data/roster_orders_2026.csv" readOnly style={{ flex: 1, height: '24px', cursor: 'pointer', background: '#222', fontSize: '9px' }} />
            <button id="illu-csv-browse" className="sm-btn sm-btn-secondary" style={{ height: '24px', margin: 0, padding: '0 8px', fontSize: '9px' }}>Browse</button>
          </div>
        </div>

        {/* Row 2: Auto-Scale & Bounding Limits */}
        <div id="illu-autoscale-card" className="sm-card" style={{ margin: 0, width: '100%', boxSizing: 'border-box', flexShrink: 0, padding: '7px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
            <h3 className="sm-card-title" style={{ margin: 0, fontSize: '10px' }}>Auto-Scale & Bounding Limits</h3>
            <button id="illu-btn-add-layer" className="sm-btn sm-btn-secondary" style={{ height: '20px', padding: '0 6px', fontSize: '8.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Field
            </button>
          </div>
          <div id="illu-limits-container" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#161616', padding: '3px 6px', borderRadius: '4px', border: '1px solid #282828' }}>
              <span style={{ fontSize: '9px', fontWeight: 600, color: '#fff', width: '38%' }}>PLAYER_NAME</span>
              <span style={{ fontSize: '8.5px', color: '#aaa', fontFamily: 'monospace' }}>10.50" × 3.00"</span>
              <span style={{ marginLeft: 'auto', fontSize: '8px', background: '#222', color: '#aaa', border: '1px solid #333', padding: '1px 4px', borderRadius: '2px', fontWeight: 500 }}>Auto-Fit</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#161616', padding: '3px 6px', borderRadius: '4px', border: '1px solid #282828' }}>
              <span style={{ fontSize: '9px', fontWeight: 600, color: '#fff', width: '38%' }}>PLAYER_NUMBER</span>
              <span style={{ fontSize: '8.5px', color: '#aaa', fontFamily: 'monospace' }}>8.00" × 10.00"</span>
              <span style={{ marginLeft: 'auto', fontSize: '8px', background: '#222', color: '#aaa', border: '1px solid #333', padding: '1px 4px', borderRadius: '2px', fontWeight: 500 }}>Auto-Fit</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#161616', padding: '3px 6px', borderRadius: '4px', border: '1px solid #282828' }}>
              <span style={{ fontSize: '9px', fontWeight: 600, color: '#fff', width: '38%' }}>TEAM_LOGO</span>
              <span style={{ fontSize: '8.5px', color: '#aaa', fontFamily: 'monospace' }}>4.50" × 4.50"</span>
              <span style={{ marginLeft: 'auto', fontSize: '8px', background: '#222', color: '#aaa', border: '1px solid #333', padding: '1px 4px', borderRadius: '2px', fontWeight: 500 }}>Fixed</span>
            </div>
          </div>
        </div>

        {/* Row 3: Save Options and Logs */}
        <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box', alignItems: 'stretch' }}>
          {/* Left: Save Options */}
          <div className="sm-card" style={{ flex: 1.2, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', boxSizing: 'border-box', padding: '7px 10px' }}>
            <h3 className="sm-card-title" style={{ fontSize: '10px' }}>Save Options</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <label className="sm-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8.5px', cursor: 'pointer', color: '#ccc' }}>
                <input type="checkbox" id="illu-save-ai" defaultChecked style={{ accentColor: '#b61942' }} /> Adobe AI
              </label>
              <label className="sm-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8.5px', cursor: 'pointer', color: '#ccc' }}>
                <input type="checkbox" id="illu-save-pdf" defaultChecked style={{ accentColor: '#b61942' }} /> Adobe PDF
              </label>
              <label className="sm-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8.5px', cursor: 'pointer', color: '#ccc' }}>
                <input type="checkbox" id="illu-save-png" defaultChecked style={{ accentColor: '#b61942' }} /> PNG Image
              </label>
              <label className="sm-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8.5px', cursor: 'pointer', color: '#ccc' }}>
                <input type="checkbox" id="illu-save-eps" style={{ accentColor: '#b61942' }} /> EPS
              </label>
            </div>
            <div id="illu-panel-ai" className="illu-format-panel" style={{ background: '#161616', padding: '6px 8px', borderRadius: '4px', border: '1px solid #252525' }}>
              <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#888', marginBottom: '4px' }}>AI OPTIONS</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <label style={{ fontSize: '8.5px', color: '#ccc' }}>Compat:</label>
                <select id="illu-ai-compat" className="dashboard-select" style={{ flex: 1, height: '20px', fontSize: '8.5px' }}>
                  <option>Illustrator CC (24)</option>
                </select>
                <label className="sm-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '8.5px', color: '#ccc' }}>
                  <input type="checkbox" id="illu-ai-compressed" defaultChecked style={{ accentColor: '#b61942' }} /> Comp
                </label>
              </div>
            </div>
          </div>

          {/* Right: Execution Log */}
          <div className="sm-card" style={{ flex: 1, margin: 0, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', padding: '7px 10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <h3 className="sm-card-title" style={{ margin: 0, fontSize: '10px' }}>Execution Log</h3>
              <button id="illu-log-copy" className="sm-btn sm-btn-secondary" style={{ height: '18px', padding: '0 4px', fontSize: '8px', margin: 0 }}>Copy</button>
            </div>
            <div id="illu-log-console" className="brand-scrollbar-active" style={{ flex: 1, background: '#131313', border: '1px solid #252525', borderRadius: '4px', padding: '6px', overflowY: 'auto', fontFamily: "'SFMono-Regular', Menlo, Monaco, Consolas, monospace", fontSize: '8.5px', color: '#adadad', lineHeight: '1.45', whiteSpace: 'pre-wrap' }}>
              [CSV] 14 order rows detected.{"\n"}
              [SCALE] Constraints mapped.{"\n"}
              Ready to execute.
            </div>
          </div>
        </div>
      </div>

      {/* Footer (Fixed) */}
      <div style={{ background: '#181818', borderTop: '1px solid #2e2e2e', padding: '6px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexShrink: 0, boxSizing: 'border-box', minHeight: '44px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#aaa' }}>
            <span id="illu-step-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#ccc' }}>Ready. Click Run Batch.</span>
            <span id="illu-progress-percent" style={{ fontWeight: 600, color: '#ccc', marginLeft: '10px' }}>0%</span>
          </div>
          <div className="progress-bar-wrap" style={{ height: '4px', background: '#252525', borderRadius: '2px', overflow: 'hidden', width: '100%' }}>
            <div id="illu-progress-inner" className="progress-bar-inner" style={{ height: '100%', background: '#b61942', width: '0%' }}></div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button id="illu-btn-save" className="sm-btn sm-btn-secondary" style={{ height: '26px', padding: '0 8px', fontSize: '9px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Save Only
          </button>
          <button id="illu-btn-run" className="sm-btn" style={{ height: '26px', padding: '0 12px', fontWeight: 'bold', fontSize: '9.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Run Batch
          </button>
        </div>
      </div>
    </div>
  );
}

const cardSlideVariants = {
  enter: (dir) => ({
    y: dir > 0 ? '70%' : '-70%',
    scale: 0.88,
    rotateX: dir > 0 ? 14 : -14,
    rotateY: dir > 0 ? -4 : 4,
    opacity: 0,
    filter: 'blur(10px)',
  }),
  center: {
    y: '0%',
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: (dir) => ({
    y: dir > 0 ? '-70%' : '70%',
    scale: 0.88,
    rotateX: dir > 0 ? -14 : 14,
    rotateY: dir > 0 ? 4 : -4,
    opacity: 0,
    filter: 'blur(10px)',
  }),
};

const backCardTransition = {
  type: 'spring',
  stiffness: 240,
  damping: 22,
  mass: 0.85,
};

const frontCardTransition = {
  type: 'spring',
  stiffness: 270,
  damping: 24,
  mass: 0.8,
  delay: 0.03,
};

function HeroBackgroundStage({ isOverlayActive, activeSoftware, setActiveSoftware }) {
  const containerRef = useRef(null);
  const backSliderRef = useRef(null);
  const frontSliderRef = useRef(null);
  const samuraiRef = useRef(null);
  const [slideDirection, setSlideDirection] = useState(1);

  const targetMouseNorm = useRef({ x: 0, y: 0 });
  const currentMouseNorm = useRef({ x: 0, y: 0 });

  const lastSnapTimeRef = useRef(0);

  const triggerSnap = (direction, nextSoftware) => {
    const now = Date.now();
    if (now - lastSnapTimeRef.current < 450) return;
    lastSnapTimeRef.current = now;
    setSlideDirection(direction);
    if (setActiveSoftware) {
      setActiveSoftware(nextSoftware);
    }
  };

  // Snap Scroll Wheel & Touch Gestures
  useEffect(() => {
    if (isOverlayActive) return;

    let touchStartY = null;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) < 6) return;
      if (e.deltaY > 0) {
        triggerSnap(1, activeSoftware === 'photoshop' ? 'illustrator' : 'photoshop');
      } else {
        triggerSnap(-1, activeSoftware === 'photoshop' ? 'illustrator' : 'photoshop');
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (touchStartY === null || !e.touches || e.touches.length === 0) return;
      const currentY = e.touches[0].clientY;
      const diff = touchStartY - currentY;
      if (diff > 25) {
        triggerSnap(1, activeSoftware === 'photoshop' ? 'illustrator' : 'photoshop');
        touchStartY = currentY;
      } else if (diff < -25) {
        triggerSnap(-1, activeSoftware === 'photoshop' ? 'illustrator' : 'photoshop');
        touchStartY = currentY;
      }
    };

    const handleTouchEnd = () => {
      touchStartY = null;
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        triggerSnap(1, activeSoftware === 'photoshop' ? 'illustrator' : 'photoshop');
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        triggerSnap(-1, activeSoftware === 'photoshop' ? 'illustrator' : 'photoshop');
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSoftware, setActiveSoftware, isOverlayActive]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetMouseNorm.current.x = (e.clientX - w / 2) / (w / 2);
      targetMouseNorm.current.y = (e.clientY - h / 2) / (h / 2);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animId;

    const render = (time) => {
      animId = requestAnimationFrame(render);
      const t = time * 0.001;

      // Lerp mouse coordinates
      currentMouseNorm.current.x += (targetMouseNorm.current.x - currentMouseNorm.current.x) * 0.08;
      currentMouseNorm.current.y += (targetMouseNorm.current.y - currentMouseNorm.current.y) * 0.08;

      // Apply multi-depth 3D floating mouse parallax to sliders
      if (backSliderRef.current) {
        const bx = currentMouseNorm.current.x * -16;
        const by = currentMouseNorm.current.y * -12;
        const rx = currentMouseNorm.current.y * 3.5;
        const ry = currentMouseNorm.current.x * -4.5;
        backSliderRef.current.style.transform = `translate3d(${bx.toFixed(2)}px, ${by.toFixed(2)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      }

      if (frontSliderRef.current) {
        const fx = currentMouseNorm.current.x * 20;
        const fy = currentMouseNorm.current.y * 15;
        const rx = currentMouseNorm.current.y * 4.5;
        const ry = currentMouseNorm.current.x * -5.5;
        frontSliderRef.current.style.transform = `translate3d(${fx.toFixed(2)}px, ${fy.toFixed(2)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      }

      // Idle breathing physics + smooth dynamic rotateY turning on samurai
      if (samuraiRef.current) {
        const sx = currentMouseNorm.current.x * 10;
        const sy = currentMouseNorm.current.y * 5;
        const idleTurn = Math.sin(t * 0.9) * 2.2;
        const mouseTurn = currentMouseNorm.current.x * 9.5;
        const totalTurnY = mouseTurn + idleTurn;
        const breathY = Math.sin(t * 1.8) * 3.5;
        const breathScale = 1 + Math.sin(t * 1.8) * 0.005;
        samuraiRef.current.style.transform = `translate3d(${sx.toFixed(2)}px, ${(sy + breathY).toFixed(2)}px, 0) rotateY(${totalTurnY.toFixed(2)}deg) scale(${breathScale.toFixed(4)})`;
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="hero-stage-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div className="hero-stage-canvas">
        {/* Background Layer 1: Back Window (Photoshop Size Manager / Illustrator Design Transfer Batch) */}
        <div
          className="slider-positioner back-slider-positioner cursor-pointer"
          onClick={() => triggerSnap(1, activeSoftware === 'photoshop' ? 'illustrator' : 'photoshop')}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          title="Click to toggle software view"
        >
          <div ref={backSliderRef} className="parallax-layer layer-back-slider">
            <AnimatePresence initial={false} custom={slideDirection}>
              {activeSoftware === 'photoshop' ? (
                <motion.div
                  key="ps-back-window"
                  custom={slideDirection}
                  variants={cardSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={backCardTransition}
                  className="slider-card-motion-wrap"
                >
                  <VectorCardScaler targetWidth={737} targetHeight={486}>
                    <SizeManagerHeroCard />
                  </VectorCardScaler>
                </motion.div>
              ) : (
                <motion.div
                  key="ai-back-window"
                  custom={slideDirection}
                  variants={cardSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={backCardTransition}
                  className="slider-card-motion-wrap"
                >
                  <VectorCardScaler targetWidth={737} targetHeight={486}>
                    <IllustratorBatchHeroCard />
                  </VectorCardScaler>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Middle Layer 2: Samurai Character (Subtle Morphing + Soft Ripple Wipe Centered Reveal) */}
        <div className="samurai-positioner">
          <div ref={samuraiRef} className="layer-samurai">
            <div className="samurai-visual-box">
              <div className="samurai-ambient-aura" />
              <SamuraiMorph
                baseSrc={SAMURAI_BASE}
                revealSrc={SAMURAI_REVEAL}
              />
            </div>
          </div>
        </div>

        {/* Foreground Layer 3: Front Window (Photoshop Basic Mode / Illustrator Batch Rename) */}
        <div
          className="slider-positioner front-slider-positioner cursor-pointer"
          onClick={() => triggerSnap(1, activeSoftware === 'photoshop' ? 'illustrator' : 'photoshop')}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          title="Click to toggle software view"
        >
          <div ref={frontSliderRef} className="parallax-layer layer-front-slider">
            <AnimatePresence initial={false} custom={slideDirection}>
              {activeSoftware === 'photoshop' ? (
                <motion.div
                  key="ps-front-window"
                  custom={slideDirection}
                  variants={cardSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={frontCardTransition}
                  className="slider-card-motion-wrap"
                >
                  <VectorCardScaler targetWidth={454} targetHeight={300}>
                    <PrintFlowHeroCard />
                  </VectorCardScaler>
                </motion.div>
              ) : (
                <motion.div
                  key="ai-front-window"
                  custom={slideDirection}
                  variants={cardSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={frontCardTransition}
                  className="slider-card-motion-wrap"
                >
                  <VectorCardScaler targetWidth={454} targetHeight={300}>
                    <IllustratorRenameHeroCard />
                  </VectorCardScaler>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const BASE_LIKES = 5000;
const COUNTER_NAMESPACE = 'antimanual-release';
const COUNTER_KEY = 'likes';

async function fetchLikesCount() {
  try {
    const res = await fetch(`https://abacus.jasoncameron.dev/get/${COUNTER_NAMESPACE}/${COUNTER_KEY}`);
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') return data.value;
    }
  } catch (e) {
    // try fallback
  }
  try {
    const fallbackRes = await fetch(`https://countapi.mileshilliard.com/api/v1/get/antimanual_release_likes`);
    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      if (typeof data.value === 'number') return data.value;
    }
  } catch (e) {
    // ignore
  }
  return 0;
}

async function incrementLikesCount() {
  try {
    const res = await fetch(`https://abacus.jasoncameron.dev/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`);
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') return data.value;
    }
  } catch (e) {
    // try fallback
  }
  try {
    const fallbackRes = await fetch(`https://countapi.mileshilliard.com/api/v1/hit/antimanual_release_likes`);
    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      if (typeof data.value === 'number') return data.value;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'features' | 'howItWorks'
  const [activeSoftware, setActiveSoftware] = useState('photoshop');
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [likes, setLikes] = useState(() => {
    const cached = localStorage.getItem('antimanual_likes_cache');
    return cached ? parseInt(cached, 10) : BASE_LIKES;
  });
  const [hasLiked, setHasLiked] = useState(() => {
    return localStorage.getItem('antimanual_user_has_liked') === 'true';
  });
  const [isLiking, setIsLiking] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const menuRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    fetchLikesCount().then((val) => {
      if (isMounted && typeof val === 'number') {
        const total = BASE_LIKES + val;
        setLikes(total);
        localStorage.setItem('antimanual_likes_cache', total.toString());
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLike = async () => {
    if (hasLiked || isLiking) return;
    setIsLiking(true);
    setHasLiked(true);
    setLikeAnim(true);
    localStorage.setItem('antimanual_user_has_liked', 'true');

    // Optimistic UI update
    setLikes((prev) => {
      const next = prev + 1;
      localStorage.setItem('antimanual_likes_cache', next.toString());
      return next;
    });
    setTimeout(() => setLikeAnim(false), 500);

    const newVal = await incrementLikesCount();
    if (typeof newVal === 'number') {
      const total = BASE_LIKES + newVal;
      setLikes(total);
      localStorage.setItem('antimanual_likes_cache', total.toString());
    }
    setIsLiking(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (contactRef.current && !contactRef.current.contains(event.target)) {
        setContactOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentFeatures = SOFTWARE_FEATURES[activeSoftware] || SOFTWARE_FEATURES.photoshop;
  const activeFeature = currentFeatures[activeFeatureIndex] || currentFeatures[0];

  const currentVideos = HOW_IT_WORKS_VIDEOS[activeSoftware] || HOW_IT_WORKS_VIDEOS.photoshop;
  const activeVideo = currentVideos[activeVideoIndex] || currentVideos[0];

  const isOverlayActive = activeView !== 'landing';

  const handlePrevVideo = () => {
    setActiveVideoIndex((prev) => (prev > 0 ? prev - 1 : currentVideos.length - 1));
  };

  const handleNextVideo = () => {
    setActiveVideoIndex((prev) => (prev < currentVideos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={`hero-viewport ${isOverlayActive ? 'overlay-active' : ''}`}>
      {/* Black Circle Custom Cursor */}
      <CustomCursor />

      {/* Hero Background Stage with Parallax, Sliders & Samurai Tech-Dissolve */}
      <HeroBackgroundStage
        isOverlayActive={isOverlayActive}
        activeSoftware={activeSoftware}
        setActiveSoftware={setActiveSoftware}
      />

      {/* Fixed Navbar (Top) */}
      <motion.header
        className="navbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="navbar-inner">
          {/* Left Side: Logo & Contact */}
          <div className="navbar-left">
            <div className="logo-group" onClick={() => setActiveView('landing')}>
              <div className="logo-icon" aria-hidden="true">
                <img
                  src={ANTIMANUAL_LOGO}
                  alt="Antimanual"
                  className="logo-icon-img"
                  draggable={false}
                />
              </div>
              <span className="brand-name">Antimanual</span>
            </div>

            {/* Contact Us Trigger & Popup */}
            <div className="contact-container" ref={contactRef}>
              <button
                type="button"
                className={`contact-nav-button ${contactOpen ? 'active' : ''}`}
                aria-label="Contact us"
                aria-expanded={contactOpen}
                onClick={() => {
                  setContactOpen((prev) => !prev);
                  setMenuOpen(false);
                }}
              >
                <span className="contact-nav-icon">
                  <MessageSquare size={12} strokeWidth={2.2} />
                </span>
                <span className="contact-nav-label">Contact us</span>
              </button>

              <AnimatePresence>
                {contactOpen && (
                  <motion.div
                    className="contact-dropdown"
                    initial={{ opacity: 0, scale: 0.96, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -4 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  >
                    <div className="contact-dropdown-header">
                      <span className="contact-dropdown-title">Contact Us</span>
                      <button
                        type="button"
                        className="contact-dropdown-close"
                        onClick={() => setContactOpen(false)}
                        aria-label="Close contact popup"
                      >
                        ×
                      </button>
                    </div>

                    <div className="contact-channels-container">
                      {/* Facebook */}
                      <a
                        href="https://www.facebook.com/profile.php?id=61576564507548"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-channel-item"
                      >
                        <div className="contact-icon-box fb-icon-bg">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C20.512 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </div>
                        <div className="contact-channel-body">
                          <div className="contact-channel-title">Facebook</div>
                          <div className="contact-channel-desc">Antimanual Page</div>
                        </div>
                        <ExternalLink size={13} className="contact-channel-ext" />
                      </a>

                      {/* WhatsApp */}
                      <a
                        href="https://wa.me/639686369796"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-channel-item"
                      >
                        <div className="contact-icon-box wa-icon-bg">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.118 4.08 4.183-1.096z" />
                          </svg>
                        </div>
                        <div className="contact-channel-body">
                          <div className="contact-channel-title">WhatsApp</div>
                          <div className="contact-channel-desc">09686369796</div>
                        </div>
                        <ExternalLink size={13} className="contact-channel-ext" />
                      </a>

                      {/* Gmail */}
                      <a
                        href="mailto:jonescamargo7@gmail.com"
                        className="contact-channel-item"
                      >
                        <div className="contact-icon-box gm-icon-bg">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                          </svg>
                        </div>
                        <div className="contact-channel-body">
                          <div className="contact-channel-title">Gmail</div>
                          <div className="contact-channel-desc">jonescamargo7@gmail.com</div>
                        </div>
                        <ExternalLink size={13} className="contact-channel-ext" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Tags Pill & Menu Button */}
          <div className="navbar-right">
            {/* Compact Mobile Like Button */}
            <button
              type="button"
              className={`mobile-like-btn ${hasLiked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={hasLiked || isLiking}
              title={hasLiked ? 'You liked Antimanual!' : 'Click to like Antimanual'}
              aria-label="Like Antimanual"
            >
              <motion.span
                className="like-icon-wrap"
                animate={likeAnim ? { scale: [1, 1.45, 1], rotate: [0, -15, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <ThumbsUp size={12} strokeWidth={2.2} className={hasLiked ? 'liked-icon' : ''} />
              </motion.span>
              <span>{likes.toLocaleString()}</span>
            </button>

            <div className="tags-pill">
              <span className="tag-label">Free access</span>
              <span className="tag-label">No credit card required</span>
              <button
                type="button"
                className={`tag-label highlight-tag like-btn ${hasLiked ? 'liked' : ''}`}
                onClick={handleLike}
                disabled={hasLiked || isLiking}
                title={hasLiked ? 'You liked Antimanual!' : 'Click to like Antimanual'}
                aria-label="Like Antimanual"
              >
                <motion.span
                  className="like-icon-wrap"
                  animate={likeAnim ? { scale: [1, 1.45, 1], rotate: [0, -15, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <ThumbsUp size={12} strokeWidth={2.2} className={hasLiked ? 'liked-icon' : ''} />
                </motion.span>
                <span>{likes.toLocaleString()} likes</span>
              </button>
            </div>

            <div className="menu-container" ref={menuRef}>
              <button
                className={`menu-button ${menuOpen ? 'active' : ''}`}
                aria-label="Download"
                aria-expanded={menuOpen}
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                  setContactOpen(false);
                }}
              >
                <span className={`menu-icon-circle ${menuOpen ? 'rotated' : ''}`}>
                  <Plus size={12} strokeWidth={3} />
                </span>
                <span className="menu-label">Download</span>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="menu-dropdown"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: EASE }}
                  >
                    <div className="menu-dropdown-title">Download</div>
                    <a
                      href={PHOTOSHOP_DOWNLOAD_URL}
                      download="antimanual.Setup.v4.53.8.exe"
                      className="menu-dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="dropdown-item-text">Adobe Photoshop</span>
                      <ExternalLink size={12} style={{ opacity: 0.5, flexShrink: 0 }} />
                    </a>
                    <button
                      className="menu-dropdown-item"
                      onClick={() => {
                        setActiveSoftware('illustrator');
                        setActiveView('features');
                        setMenuOpen(false);
                      }}
                    >
                      <span className="dropdown-item-text">Adobe Illustrator</span>
                    </button>
                    <div className="menu-dropdown-item disabled">
                      <span className="dropdown-item-text">CorelDRAW</span>
                      <span className="dropdown-item-badge">Coming soon</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Spacer */}
      <main className="hero-main" />

      {/* Landing Footer Banner OR Features Overlay OR How It Works Carousel */}
      <AnimatePresence mode="wait">
        {activeView === 'landing' && (
          <motion.footer
            className="landing-footer"
            key="landing-footer"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1, transition: { duration: 0.45 } }}
          >
            <div className="footer-container">
              <div className="footer-hero-row">
                {/* Left Block */}
                <motion.div
                  className="footer-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE } }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  {/* Tagline */}
                  <div className="subtitle-row">
                    <span className="subtitle-dot" aria-hidden="true" />
                    <span className="subtitle-text">Zero Manual Work. Infinite Creative Flow.</span>
                  </div>

                  {/* Heading */}
                  <h1 className="hero-heading">
                    Sublimation Automation
                  </h1>

                  {/* Paragraph */}
                  <p className="hero-paragraph">
                    Automate grading, sizing, renaming, nesting, and more.
                  </p>

                  {/* Buttons */}
                  <div className="cta-row">
                    <button
                      className="btn-primary"
                      onClick={() => setActiveView('features')}
                    >
                      See Features
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setActiveView('howItWorks')}
                    >
                      How It Works
                    </button>
                  </div>
                </motion.div>

                {/* Right Block */}
                <motion.div
                  className="footer-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE } }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <div className="tag-badges">
                    <span className="tag-badge">100% Accurate</span>
                    <span className="tag-badge">Accurate Grading</span>
                    <span className="tag-badge">Consistent Sizing</span>
                    <span className="tag-badge">Easy to use</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.footer>
        )}

        {activeView === 'features' && (
          /* Features Section - Dedicated Top Bar + Centered 2-Column Layout */
          <motion.div
            className="features-overlay-view"
            key="features-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="features-wrapper">
              {/* Dedicated Top Row for Back Button */}
              <div className="features-top-row">
                <button
                  className="features-back-btn"
                  onClick={() => setActiveView('landing')}
                  aria-label="Back to landing"
                >
                  <span className="back-btn-icon">
                    <Plus size={11} strokeWidth={3} />
                  </span>
                  <span className="back-btn-text">Back</span>
                </button>
              </div>

              <div className="features-section-row">
                {/* Left Side: Header, Software Switch, Feature Titles */}
                <div className="features-left-column">
                  <div className="features-left-header">
                    <div className="subtitle-row">
                      <span className="subtitle-dot" aria-hidden="true" />
                      <span className="subtitle-text">Antimanual Core Suite</span>
                    </div>

                    <h2 className="features-main-heading">
                      Engineered for
                      <br />
                      Automated Production
                    </h2>

                    {/* Software Switch: AI, PS, CorelDRAW */}
                    <div className="software-switch">
                      <button
                        className={`software-pill ${activeSoftware === 'photoshop' ? 'active' : ''}`}
                        onClick={() => {
                          setActiveSoftware('photoshop');
                          setActiveFeatureIndex(0);
                        }}
                      >
                        {activeSoftware === 'photoshop' && (
                          <motion.div
                            className="software-pill-active-bg"
                            layoutId="activeSoftwarePill"
                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                          />
                        )}
                        <span className="software-pill-text">PS</span>
                      </button>
                      <button
                        className={`software-pill ${activeSoftware === 'illustrator' ? 'active' : ''}`}
                        onClick={() => {
                          setActiveSoftware('illustrator');
                          setActiveFeatureIndex(0);
                        }}
                      >
                        {activeSoftware === 'illustrator' && (
                          <motion.div
                            className="software-pill-active-bg"
                            layoutId="activeSoftwarePill"
                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                          />
                        )}
                        <span className="software-pill-text">AI</span>
                      </button>
                      <div className="software-pill disabled" title="CorelDRAW coming soon">
                        <span>CorelDRAW</span>
                        <span className="software-badge">Soon</span>
                      </div>
                    </div>
                  </div>

                  <div className="features-tabs-list">
                    {currentFeatures.map((feat, idx) => {
                      const isActive = activeFeatureIndex === idx;
                      return (
                        <button
                          key={`${activeSoftware}-${feat.id}`}
                          className={`feature-tab-item ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            setActiveFeatureIndex(idx);
                          }}
                        >
                          {isActive && (
                            <motion.div
                              className="feature-tab-active-bg"
                              layoutId="activeFeatureTab"
                              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                            />
                          )}
                          <span className="tab-num">{feat.id}</span>
                          <span className="tab-title">{feat.title}</span>
                          <span className="tab-arrow" aria-hidden="true">→</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Active Feature Description */}
                <div className="features-right-column">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activeSoftware}-${activeFeature.id}`}
                      className="feature-detail-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      <span className="detail-tag">{activeFeature.shortDesc}</span>
                      <h2 className="detail-headline">{activeFeature.headline}</h2>
                      <p className="detail-description">{activeFeature.description}</p>

                      <div className="detail-highlights">
                        {activeFeature.highlights.map((item, i) => {
                          const parts = item.split(' — ');
                          return (
                            <div className="highlight-item" key={i}>
                              <span className="highlight-dot" />
                              <div className="highlight-text">
                                {parts.length > 1 ? (
                                  <>
                                    <strong className="highlight-title">{parts[0]}</strong>
                                    <span className="highlight-sep"> — </span>
                                    <span className="highlight-desc">{parts[1]}</span>
                                  </>
                                ) : (
                                  item
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'howItWorks' && (
          /* How It Works Section - Pure Video Carousel with Software Switch directly near the thumbnail */
          <motion.div
            className="features-overlay-view video-carousel-overlay-view"
            key="how-it-works-carousel-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="features-wrapper video-carousel-wrapper">
              {/* Dedicated Top Row for Back Button */}
              <div className="features-top-row">
                <button
                  className="features-back-btn"
                  onClick={() => setActiveView('landing')}
                  aria-label="Back to landing"
                >
                  <span className="back-btn-icon">
                    <Plus size={11} strokeWidth={3} />
                  </span>
                  <span className="back-btn-text">Back</span>
                </button>
              </div>

              {/* Centered Carousel: Switch directly near the thumbnail + Video + Title */}
              <div className="video-carousel-container">
                {/* Software Switch: PS, AI, CorelDRAW directly near the top of the video thumbnail */}
                <div className="software-switch video-near-switch">
                  <button
                    className={`software-pill ${activeSoftware === 'photoshop' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSoftware('photoshop');
                      setActiveVideoIndex(0);
                    }}
                  >
                    {activeSoftware === 'photoshop' && (
                      <motion.div
                        className="software-pill-active-bg"
                        layoutId="howItWorksSoftwarePill"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="software-pill-text">PS</span>
                  </button>
                  <button
                    className={`software-pill ${activeSoftware === 'illustrator' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSoftware('illustrator');
                      setActiveVideoIndex(0);
                    }}
                  >
                    {activeSoftware === 'illustrator' && (
                      <motion.div
                        className="software-pill-active-bg"
                        layoutId="howItWorksSoftwarePill"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="software-pill-text">AI</span>
                  </button>
                  <div className="software-pill disabled" title="CorelDRAW coming soon">
                    <span>CorelDRAW</span>
                    <span className="software-badge">Soon</span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeSoftware}-${activeVideo.id}`}
                    className="video-carousel-slide"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {/* Responsive Video Embed Frame */}
                    <div className="video-embed-stage">
                      <iframe
                        src={activeVideo.embedUrl}
                        title={activeVideo.title}
                        className="video-embed-iframe"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>

                    {/* Video Title */}
                    <div className="video-slide-title-wrap">
                      <h2 className="video-slide-title">{activeVideo.title}</h2>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls (If multiple videos in playlist) */}
                {currentVideos.length > 1 && (
                  <div className="video-carousel-nav-row">
                    <button
                      className="video-nav-arrow-btn"
                      onClick={handlePrevVideo}
                      aria-label="Previous video"
                    >
                      <ChevronLeft size={20} strokeWidth={2} />
                    </button>
                    <div className="video-carousel-dots">
                      {currentVideos.map((_, idx) => (
                        <button
                          key={idx}
                          className={`carousel-dot ${activeVideoIndex === idx ? 'active' : ''}`}
                          onClick={() => setActiveVideoIndex(idx)}
                          aria-label={`Go to video ${idx + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      className="video-nav-arrow-btn"
                      onClick={handleNextVideo}
                      aria-label="Next video"
                    >
                      <ChevronRight size={20} strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
