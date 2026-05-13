import {
  ArrowRight,
  BookOpen,
  Box,
  Brain,
  Camera,
  ChevronDown,
  CircleDot,
  Gauge,
  EyeOff,
  Grid3X3,
  Heart,
  Info,
  Leaf,
  MessageCircle,
  Library,
  Microscope,
  Plus,
  RotateCcw,
  Settings,
  Sparkles,
  Star,
  Target,
  type LucideIcon,
} from "lucide-react";
import type { TFunction } from "i18next";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Trans, useTranslation } from "react-i18next";
import { CellScene } from "./components/CellScene";
import { cells, getCellById, type CellItem, type OrganelleItem, type ViewMode } from "./data/cells";

type ModeOption = {
  id: ViewMode;
  labelKey: string;
  Icon: LucideIcon;
};

const modeOptions: ModeOption[] = [
  { id: "mesh", labelKey: "app.controls.mesh", Icon: Box },
  { id: "focus", labelKey: "app.controls.focus", Icon: CircleDot },
];

const initialCell = getCellById("animal");

function translateCell(cell: CellItem, t: TFunction): CellItem {
  return {
    ...cell,
    name: t(`cells.${cell.id}.name`, { defaultValue: cell.name }),
    type: t(`cells.${cell.id}.type`, { defaultValue: cell.type }),
    occurrence: {
      ...cell.occurrence,
      title: t(`cells.${cell.id}.occurrence.title`, { defaultValue: cell.occurrence.title }),
      body: t(`cells.${cell.id}.occurrence.body`, { defaultValue: cell.occurrence.body }),
    },
    microscope: cell.microscope.map((image) => ({
      ...image,
      label: t(`microscope.${image.label}`, { defaultValue: image.label }),
    })),
    organelles: cell.organelles.map((organelle) => ({
      ...organelle,
      name: t(`cells.${cell.id}.organelles.${organelle.id}.name`, { defaultValue: organelle.name }),
      subtitle: t(`cells.${cell.id}.organelles.${organelle.id}.subtitle`, { defaultValue: organelle.subtitle }),
      note: t(`cells.${cell.id}.organelles.${organelle.id}.note`, { defaultValue: organelle.note }),
      fact: t(`cells.${cell.id}.organelles.${organelle.id}.fact`, { defaultValue: organelle.fact }),
      attributes: organelle.attributes.map((item) => ({
        label: t(`attributes.${item.label}`, { defaultValue: item.label }),
        value: t(`attributeValues.${item.value}`, { defaultValue: item.value }),
      })),
    })),
  };
}

type TutorPromptId = "survival" | "quiz" | "guide";

function buildTutorPrompt(
  promptId: TutorPromptId,
  t: TFunction,
  cell: CellItem,
  organelle: OrganelleItem,
  comparison: CellItem,
) {
  return t(`app.tutorPrompts.${promptId}`, {
    cell: cell.name,
    organelle: organelle.name,
    comparison: comparison.name,
  });
}

function Header({ cell }: { cell: CellItem }) {
  const { i18n, t } = useTranslation();
  const nextLanguage = i18n.language === "zh" ? "en" : "zh";

  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-orb" aria-hidden="true">
          <Sparkles size={26} />
        </div>
        <div>
          <h1>Cell Architecture Studio</h1>
          <p>{t("app.tagline")}</p>
        </div>
      </div>

      <nav className="top-nav" aria-label={t("app.nav.primary")}>
        <a href="#gallery">
          <Grid3X3 size={24} />
          <span>{t("app.nav.gallery")}</span>
        </a>
        <a href="#library">
          <Library size={24} />
          <span>{t("app.nav.library")}</span>
        </a>
        <a href="#notebooks">
          <BookOpen size={24} />
          <span>{t("app.nav.notebooks")}</span>
        </a>
        <a href="#settings">
          <Settings size={24} />
          <span>{t("app.nav.settings")}</span>
        </a>
        <button
          className="language-switch"
          type="button"
          aria-label={t("app.language.switchTo", { language: nextLanguage })}
          onClick={() => i18n.changeLanguage(nextLanguage)}
        >
          <span className={i18n.language === "en" ? "is-active" : ""}>en</span>
          <span className={i18n.language === "zh" ? "is-active" : ""}>zh</span>
        </button>
        <button className="avatar-button" type="button" aria-label={t("app.nav.userMenu")}>
          <span className="avatar-core" style={{ background: cell.accentSoft }}>
            <span style={{ background: cell.accent }} />
          </span>
          <ChevronDown size={20} />
        </button>
      </nav>
    </header>
  );
}

type SidebarProps = {
  selectedCell: CellItem;
  activeOrganelle: string;
  favorites: Set<string>;
  onSelectCell: (id: string) => void;
  onSelectOrganelle: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

function MiniCell({ cell }: { cell: CellItem }) {
  if (cell.renderImage?.url) {
    return (
      <span className="mini-cell has-preview" style={{ "--thumb": cell.accent } as CSSProperties}>
        <img src={cell.renderImage.url} alt="" aria-hidden="true" />
      </span>
    );
  }

  if (cell.modelAsset?.previewUrl) {
    return (
      <span className="mini-cell has-preview" style={{ "--thumb": cell.accent } as CSSProperties}>
        <img src={cell.modelAsset.previewUrl} alt="" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className={`mini-cell mini-cell-${cell.modelKind}`} style={{ "--thumb": cell.accent } as CSSProperties}>
      <span />
      <i />
      <b />
    </span>
  );
}

function Sidebar({
  selectedCell,
  activeOrganelle,
  favorites,
  onSelectCell,
  onSelectOrganelle,
  onToggleFavorite,
}: SidebarProps) {
  const { t } = useTranslation();
  const translatedCells = cells.map((cell) => translateCell(cell, t));

  return (
    <aside className="left-rail">
      <section className="panel cell-type-panel">
        <div className="panel-heading">
          <span>
            <Leaf size={18} />
            {t("app.panels.cellTypes")}
          </span>
          <ChevronDown size={18} />
        </div>

        <div className="cell-list">
          {translatedCells.map((cell) => {
            const selected = selectedCell.id === cell.id;
            return (
              <button
                className={`cell-row ${selected ? "is-active" : ""}`}
                type="button"
                key={cell.id}
                onClick={() => onSelectCell(cell.id)}
              >
                <MiniCell cell={cell} />
                <span className="cell-row-copy">
                  <strong>{cell.name}</strong>
                  <span>{cell.type}</span>
                </span>
                <span
                  className={`favorite-dot ${favorites.has(cell.id) ? "is-on" : ""}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(cell.id);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={t("app.controls.favoriteCell", { name: cell.name })}
                >
                  <Star size={18} fill="currentColor" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel organelle-panel">
        <div className="panel-heading">
          <span>
            <Sparkles size={16} />
            {t("app.panels.organelles")}
          </span>
          <ChevronDown size={18} />
        </div>

        <div className="organelle-list">
          {selectedCell.organelles.map((organelle) => (
            <button
              className={`organelle-row ${activeOrganelle === organelle.id ? "is-active" : ""}`}
              type="button"
              key={organelle.id}
              onClick={() => onSelectOrganelle(organelle.id)}
            >
              <span className="color-dot" style={{ background: organelle.color }} />
              <span>{organelle.name}</span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

type StageProps = {
  cell: CellItem;
  activeOrganelle: string;
  viewMode: ViewMode;
  crossSection: boolean;
  autoRotate: boolean;
  resetKey: number;
  onModeChange: (mode: ViewMode) => void;
  onCrossSectionChange: (value: boolean) => void;
  onAutoRotateChange: (value: boolean) => void;
  onReset: () => void;
  onToast: (message: string) => void;
};

function Stage({
  cell,
  activeOrganelle,
  viewMode,
  crossSection,
  autoRotate,
  resetKey,
  onModeChange,
  onCrossSectionChange,
  onAutoRotateChange,
  onReset,
  onToast,
}: StageProps) {
  const { t } = useTranslation();

  return (
    <main className="stage-column">
      <section className="stage-panel">
        <div className="stage-title">
          <div>
            <h2>{cell.name}</h2>
            <p>{cell.type}</p>
          </div>

          <div className="view-card">
            <span>{t("app.controls.viewMode")}</span>
            <div className="mode-switcher">
              {modeOptions.map(({ id, labelKey, Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={viewMode === id ? "is-active" : ""}
                  onClick={() => onModeChange(id)}
                  title={t(labelKey)}
                >
                  <Icon size={22} />
                </button>
              ))}
            </div>
            <label className="toggle-line">
              <span>{t("app.controls.crossSection")}</span>
              <input
                type="checkbox"
                checked={crossSection}
                onChange={(event) => onCrossSectionChange(event.target.checked)}
              />
              <i />
            </label>
          </div>
        </div>

        <div className="canvas-wrap">
          <CellScene
            cell={cell}
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            crossSection={crossSection}
            autoRotate={autoRotate}
            resetKey={resetKey}
          />
        </div>

        <div className="stage-toolbar">
          <button
            type="button"
            className={autoRotate ? "is-active" : ""}
            onClick={() => onAutoRotateChange(!autoRotate)}
          >
            <RotateCcw size={20} />
            {t("app.controls.rotate")}
          </button>
          <button type="button" onClick={() => onModeChange("focus")}>
            <CircleDot size={20} />
            {t("app.controls.isolate")}
          </button>
          <button type="button" onClick={() => onModeChange("focus")}>
            <EyeOff size={20} />
            {t("app.controls.hideOthers")}
          </button>
          <button type="button" onClick={onReset}>
            <RotateCcw size={20} />
            {t("app.controls.resetView")}
          </button>
        </div>

        <div className="export-toolbar">
          <button type="button" onClick={() => onToast(t("app.toasts.screenshotPlaceholder"))}>
            <Camera size={20} />
            {t("app.controls.screenshot")}
          </button>
          <button type="button" onClick={() => onToast(t("app.toasts.glbPlaceholder"))}>
            <Box size={20} />
            {t("app.controls.glbExport")}
          </button>
        </div>
      </section>
    </main>
  );
}

type RightPanelProps = {
  cell: CellItem;
  activeOrganelle: string;
  favorites: Set<string>;
  mastery: number;
  viewedCellCount: number;
  viewedOrganelleCount: number;
  totalOrganelleCount: number;
  tutorPromptId: TutorPromptId;
  onToggleFavorite: (id: string) => void;
  onTutorPrompt: (promptId: TutorPromptId) => void;
};

function RightPanel({
  cell,
  activeOrganelle,
  favorites,
  mastery,
  viewedCellCount,
  viewedOrganelleCount,
  totalOrganelleCount,
  tutorPromptId,
  onToggleFavorite,
  onTutorPrompt,
}: RightPanelProps) {
  const { t } = useTranslation();
  const organelle = cell.organelles.find((item) => item.id === activeOrganelle) ?? cell.organelles[0];
  const comparedCell = translateCell(getCellById(cell.comparison), t);
  const tutorPromptIds: TutorPromptId[] = ["survival", "quiz", "guide"];
  const tutorPrompt = buildTutorPrompt(tutorPromptId, t, cell, organelle, comparedCell);

  return (
    <aside className="right-rail">
      <section className="panel details-panel">
        <div className="panel-heading detail-heading">
          <span>{t("app.panels.organelleDetails")}</span>
          <button type="button" onClick={() => onToggleFavorite(cell.id)} aria-label={t("app.controls.toggleFavorite")}>
            <Heart size={22} fill={favorites.has(cell.id) ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="detail-hero">
          <span className="organelle-orb" style={{ background: organelle.color }} />
          <div>
            <h3>{organelle.name}</h3>
            <p>{organelle.subtitle}</p>
          </div>
        </div>

        <dl className="attribute-list">
          {organelle.attributes.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
          <div>
            <dt>{t("app.details.label")}</dt>
            <dd>
              <span className="mini-toggle is-on" />
              <span className="detail-dot" style={{ background: organelle.color }} />
            </dd>
          </div>
        </dl>
      </section>

      <section className="panel notes-panel">
        <div className="panel-heading">
          <span>{t("app.panels.biologicalNotes")}</span>
        </div>
        <p>{organelle.note}</p>
        <div className="fun-fact">
          <span>{t("app.details.funFact", { fact: organelle.fact })}</span>
          <Sparkles size={18} />
        </div>
      </section>

      <section className="panel learning-panel">
        <div className="panel-heading">
          <span>
            <Brain size={17} />
            {t("app.panels.aiTutor")}
          </span>
        </div>

        <div className="mastery-meter" style={{ "--progress": `${mastery}%` } as CSSProperties}>
          <div>
            <Gauge size={18} />
            <span>{t("app.details.mastery")}</span>
            <strong>{mastery}%</strong>
          </div>
          <i>
            <b />
          </i>
          <small>
            {t("app.details.progress", {
              viewedCellCount,
              cellCount: cells.length,
              viewedOrganelleCount,
              totalOrganelleCount,
            })}
          </small>
        </div>

        <div className="lesson-focus">
          <span>
            <Target size={17} />
            {t("app.details.currentLessonFocus")}
          </span>
          <p>
            <Trans
              i18nKey="app.details.lessonFocus"
              values={{ organelle: organelle.name, comparison: comparedCell.name }}
              components={{ strong: <strong /> }}
            />
          </p>
        </div>

        <div className="tutor-prompt">
          <span>
            <MessageCircle size={17} />
            {t("app.details.promptStaged")}
          </span>
          <p>{tutorPrompt}</p>
        </div>

        <div className="prompt-list">
          {tutorPromptIds.map((promptId) => (
            <button type="button" key={promptId} onClick={() => onTutorPrompt(promptId)}>
              {buildTutorPrompt(promptId, t, cell, organelle, comparedCell)}
            </button>
          ))}
        </div>
      </section>

      <section className="panel occurrence-panel">
        <div className="panel-heading">
          <span>{t("app.panels.whereItOccurs")}</span>
        </div>
        <div className={`occurrence-art occurrence-${cell.occurrence.motif}`}>
          <span />
          <i />
          <b />
        </div>
        <h4>{cell.occurrence.title}</h4>
        <p>{cell.occurrence.body}</p>
      </section>
    </aside>
  );
}

type BottomPanelsProps = {
  cell: CellItem;
  onCompare: () => void;
  onToast: (message: string) => void;
};

function BottomPanels({ cell, onCompare, onToast }: BottomPanelsProps) {
  const { t } = useTranslation();
  const comparedCell = translateCell(getCellById(cell.comparison), t);

  return (
    <section className="bottom-grid">
      <div className="panel microscope-panel">
        <div className="panel-heading">
          <span>
            {t("app.panels.microscopeView")}
            <Info size={16} />
          </span>
        </div>
        <div className="micro-card-row">
          {cell.microscope.map((image) => (
            <button
              type="button"
              key={image.label}
              className={`micro-card pattern-${image.pattern}`}
              style={{ "--micro": image.tone } as CSSProperties}
              onClick={() => onToast(t("app.toasts.imageSelected", { label: image.label }))}
            >
              <span />
              <strong>{image.label}</strong>
            </button>
          ))}
          <button type="button" className="micro-card add-card" onClick={() => onToast(t("app.toasts.imageUploadPlanned"))}>
            <Plus size={28} />
            <strong>{t("app.controls.addImage")}</strong>
          </button>
        </div>
      </div>

      <div className="panel compare-panel">
        <div className="panel-heading">
          <span>
            {t("app.panels.compareCells")}
            <Info size={16} />
          </span>
        </div>
        <div className="compare-row">
          <div>
            <MiniCell cell={cell} />
            <span>
              <strong>{cell.name}</strong>
              <em>{t("app.details.youAreHere")}</em>
            </span>
          </div>
          <b>{t("app.details.versus")}</b>
          <div>
            <span>
              <strong>{comparedCell.name}</strong>
              <em>{comparedCell.type}</em>
            </span>
            <MiniCell cell={comparedCell} />
          </div>
        </div>
        <button type="button" className="comparison-button" onClick={onCompare}>
          {t("app.controls.openComparisonView")}
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}

type ComparisonModalProps = {
  cell: CellItem;
  open: boolean;
  onClose: () => void;
};

function ComparisonModal({ cell, open, onClose }: ComparisonModalProps) {
  const { t } = useTranslation();
  const comparedCell = translateCell(getCellById(cell.comparison), t);
  if (!open) {
    return null;
  }

  const currentOrganelle = cell.organelles.find((item) => item.id === cell.defaultOrganelle) ?? cell.organelles[0];
  const comparedOrganelle =
    comparedCell.organelles.find((item) => item.id === comparedCell.defaultOrganelle) ?? comparedCell.organelles[0];

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label={t("app.comparison.label")}>
      <div className="comparison-modal">
        <button className="modal-close" type="button" onClick={onClose}>
          {t("app.controls.close")}
        </button>
        <div className="comparison-modal-head">
          <h3>{t("app.comparison.title")}</h3>
          <p>{t("app.comparison.subtitle", { cell: cell.name, comparison: comparedCell.name })}</p>
        </div>
        <div className="comparison-columns">
          {[cell, comparedCell].map((item) => {
            const organelle = item.id === cell.id ? currentOrganelle : comparedOrganelle;
            return (
              <section key={item.id}>
                <MiniCell cell={item} />
                <h4>{item.name}</h4>
                <p>{item.type}</p>
                <dl>
                  <div>
                    <dt>{t("app.comparison.defaultFocus")}</dt>
                    <dd>{organelle.name}</dd>
                  </div>
                  <div>
                    <dt>{t("app.comparison.mainNote")}</dt>
                    <dd>{organelle.subtitle}</dd>
                  </div>
                  <div>
                    <dt>{t("app.comparison.occursIn")}</dt>
                    <dd>{item.occurrence.title}</dd>
                  </div>
                </dl>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Toast({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }
  return <div className="toast">{message}</div>;
}

export default function App() {
  const { i18n, t } = useTranslation();
  const [selectedCellId, setSelectedCellId] = useState(initialCell.id);
  const [activeOrganelle, setActiveOrganelle] = useState(initialCell.defaultOrganelle);
  const [viewMode, setViewMode] = useState<ViewMode>("mesh");
  const [crossSection, setCrossSection] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set([initialCell.id]));
  const [viewedCells, setViewedCells] = useState<Set<string>>(() => new Set([initialCell.id]));
  const [viewedOrganelleKeys, setViewedOrganelleKeys] = useState<Set<string>>(
    () => new Set([`${initialCell.id}:${initialCell.defaultOrganelle}`]),
  );
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [tutorPromptId, setTutorPromptId] = useState<TutorPromptId>("guide");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const selectedCell = useMemo(() => translateCell(getCellById(selectedCellId), t), [i18n.language, selectedCellId, t]);
  const totalOrganelleCount = useMemo(
    () => cells.reduce((total, cell) => total + cell.organelles.length, 0),
    [],
  );
  const mastery = useMemo(() => {
    const cellCoverage = viewedCells.size / cells.length;
    const organelleCoverage = viewedOrganelleKeys.size / totalOrganelleCount;
    return Math.round((cellCoverage * 0.42 + organelleCoverage * 0.58) * 100);
  }, [totalOrganelleCount, viewedCells, viewedOrganelleKeys]);

  useEffect(() => {
    setActiveOrganelle(selectedCell.defaultOrganelle);
    setComparisonOpen(false);
  }, [selectedCell]);

  useEffect(() => {
    setViewedCells((current) => {
      const next = new Set(current);
      next.add(selectedCell.id);
      return next;
    });
    setViewedOrganelleKeys((current) => {
      const next = new Set(current);
      next.add(`${selectedCell.id}:${activeOrganelle}`);
      return next;
    });
  }, [activeOrganelle, selectedCell.id]);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const shellStyle = {
    "--accent": selectedCell.accent,
    "--accent-soft": selectedCell.accentSoft,
    "--cell-color": selectedCell.color,
  } as CSSProperties;

  return (
    <div className="app-shell" style={shellStyle}>
      <Header cell={selectedCell} />

      <div className="app-grid">
        <Sidebar
          selectedCell={selectedCell}
          activeOrganelle={activeOrganelle}
          favorites={favorites}
          onSelectCell={setSelectedCellId}
          onSelectOrganelle={setActiveOrganelle}
          onToggleFavorite={toggleFavorite}
        />

        <div className="center-stack">
          <Stage
            cell={selectedCell}
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            crossSection={crossSection}
            autoRotate={autoRotate}
            resetKey={resetKey}
            onModeChange={setViewMode}
            onCrossSectionChange={setCrossSection}
            onAutoRotateChange={setAutoRotate}
            onReset={() => {
              setResetKey((key) => key + 1);
              showToast(t("app.toasts.viewReset"));
            }}
            onToast={showToast}
          />
          <BottomPanels
            cell={selectedCell}
            onCompare={() => setComparisonOpen(true)}
            onToast={showToast}
          />
        </div>

        <RightPanel
          cell={selectedCell}
          activeOrganelle={activeOrganelle}
          favorites={favorites}
          mastery={mastery}
          viewedCellCount={viewedCells.size}
          viewedOrganelleCount={viewedOrganelleKeys.size}
          totalOrganelleCount={totalOrganelleCount}
          tutorPromptId={tutorPromptId}
          onToggleFavorite={toggleFavorite}
          onTutorPrompt={(promptId) => {
            setTutorPromptId(promptId);
            showToast(t("app.toasts.tutorPromptStaged"));
          }}
        />
      </div>

      <ComparisonModal cell={selectedCell} open={comparisonOpen} onClose={() => setComparisonOpen(false)} />
      <Toast message={toast} />
    </div>
  );
}
