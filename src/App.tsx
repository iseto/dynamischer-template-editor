import { useEffect, useMemo, useRef, useState } from "react";
import type { Editor as HugeEditor } from "hugerte";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Braces,
  Check,
  ChevronRight,
  Code2,
  FilePlus2,
  FileText,
  FolderOpen,
  GitBranch,
  LayoutTemplate,
  Menu,
  Monitor,
  MoreHorizontal,
  PanelLeftClose,
  PenLine,
  Plus,
  RotateCcw,
  Smartphone,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import RichEditor from "./components/RichEditor";
import useStudio from "./hooks/useStudio";
import { templates } from "./data/templates";
import { exportDocument, renderDocument } from "./utils/document";

const templateIcons = {
  brief: FileText,
  case: FolderOpen,
  resume: Code2,
  blank: FilePlus2,
};

export default function App() {
  const { selected, draft, saveStatus, select, updateDraft, reset } =
    useStudio();
  const [view, setView] = useState<"edit" | "preview" | "html">("edit");
  const [mobilePreview, setMobilePreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [editorError, setEditorError] = useState(false);
  const [notice, setNotice] = useState("");
  const [addingVariable, setAddingVariable] = useState(false);
  const [newKey, setNewKey] = useState("");
  const editorRef = useRef<HugeEditor | null>(null);
  const aboutRef = useRef<HTMLDialogElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const template = templates.find((template) => template.id === selected)!;
  const rendered = useMemo(
    () => renderDocument(draft.html, draft.variables),
    [draft.html, draft.variables],
  );
  const words = useMemo(
    () =>
      new DOMParser()
        .parseFromString(rendered, "text/html")
        .body.textContent?.trim()
        .split(/\s+/)
        .filter(Boolean).length ?? 0,
    [rendered],
  );
  useEffect(() => {
    if (aboutOpen) aboutRef.current?.showModal();
    else aboutRef.current?.close();
  }, [aboutOpen]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 800px)");
    const previousOverflow = document.body.style.overflow;
    const updateVisibility = () => {
      sidebarRef.current?.toggleAttribute(
        "inert",
        query.matches && !sidebarOpen,
      );
      document.body.style.overflow =
        sidebarOpen && query.matches ? "hidden" : previousOverflow;
    };
    updateVisibility();
    query.addEventListener("change", updateVisibility);
    const previousFocus = document.activeElement as HTMLElement | null;
    if (sidebarOpen && query.matches) {
      document.body.style.overflow = "hidden";
      sidebarRef.current
        ?.querySelector<HTMLButtonElement>(".mobile-close")
        ?.focus();
    }
    const handleKeys = (event: KeyboardEvent) => {
      if (!sidebarOpen || !query.matches) return;
      if (event.key === "Escape") {
        setSidebarOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const elements = Array.from(
        sidebarRef.current?.querySelectorAll<HTMLElement>("a, button, input") ??
          [],
      ).filter((element) => element.getBoundingClientRect().width > 0);
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKeys);
    return () => {
      query.removeEventListener("change", updateVisibility);
      document.removeEventListener("keydown", handleKeys);
      document.body.style.overflow = previousOverflow;
      if (sidebarOpen) previousFocus?.focus();
    };
  }, [sidebarOpen]);

  function chooseTemplate(id: string) {
    if (id === selected) {
      setView("edit");
      setSidebarOpen(false);
      return;
    }
    editorRef.current = null;
    setEditorError(false);
    setReady(false);
    select(id);
    setView("edit");
    setSidebarOpen(false);
  }
  function insertVariable(key: string) {
    if (view === "edit" && editorRef.current) {
      editorRef.current.focus();
      editorRef.current.insertContent(`{{${key}}}`);
      setNotice(`Inserted {{${key}}}`);
    } else {
      updateDraft({ html: `${draft.html}<p>{{${key}}}</p>` });
      setNotice(`Added {{${key}} to the document`);
    }
  }
  function addVariable(event: React.FormEvent) {
    event.preventDefault();
    const key = newKey.trim().toLowerCase().replace(/\s+/g, "_");
    if (!/^[a-z][a-z0-9_]*$/.test(key)) {
      setNotice("Start with a letter. Use letters, numbers, or underscores.");
      return;
    }
    if (draft.variables.some((variable) => variable.key === key)) {
      setNotice("That variable already exists.");
      return;
    }
    updateDraft({
      variables: [
        ...draft.variables,
        { key, label: key.replace(/_/g, " "), value: "" },
      ],
    });
    setNewKey("");
    setAddingVariable(false);
  }
  function download() {
    const blob = new Blob([exportDocument(draft.title, rendered)], {
      type: "text/html;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${
      draft.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "document"
    }.html`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Your HTML document has been exported.");
  }

  return (
    <div className="studio">
      <a className="skip-link" href="#workspace">
        Skip to editor
      </a>
      {sidebarOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        id="template-navigation"
        className={`sidebar ${sidebarOpen ? "is-open" : ""}`}
        aria-label="Template navigation"
      >
        <a className="brand" href="#workspace">
          <span className="brand-mark">
            <LayoutTemplate size={21} strokeWidth={1.7} />
          </span>
          <span>
            template<span className="brand-light">studio</span>
            <span className="brand-dot">.</span>
          </span>
        </a>
        <div className="sidebar-section-label">
          YOUR WORKSPACE{" "}
          <button
            className="mobile-close icon-button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>
        <div className="workspace-label">
          <span className="workspace-avatar">IS</span>
          <span>
            Ignatius's workspace<small>Personal playground</small>
          </span>
        </div>
        <div className="sidebar-section-label templates-label">
          TEMPLATES <span>{templates.length.toString().padStart(2, "0")}</span>
        </div>
        <nav className="template-nav">
          {templates.map((item) => {
            const Icon = templateIcons[item.icon];
            return (
              <button
                key={item.id}
                className={`template-link ${selected === item.id ? "active" : ""}`}
                onClick={() => chooseTemplate(item.id)}
                aria-current={selected === item.id ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={1.6} />
                <span>{item.title}</span>
                {selected === item.id && <span className="active-dot" />}
              </button>
            );
          })}
        </nav>
        <button
          className="new-document"
          onClick={() => chooseTemplate("blank")}
        >
          <Plus size={17} /> Start from scratch
        </button>
        <div className="sidebar-bottom">
          <div className="opensource-card">
            <span className="open-source-icon">
              <Braces size={20} />
            </span>
            <h3>Big ideas. Open source.</h3>
            <p>
              Powered by HugeRTE.
              <br />A rich text editor, freely yours.
            </p>
            <a href="https://hugerte.org" target="_blank" rel="noreferrer">
              Explore HugeRTE <ArrowUpRight size={14} />
            </a>
            <span className="license-pill">MIT LICENSE</span>
          </div>
          <button className="profile" onClick={() => setAboutOpen(true)}>
            <span className="profile-avatar">
              is
              <span />
            </span>
            <span>
              Ignatius Seto<small>Behind the build</small>
            </span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              aria-controls="template-navigation"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={21} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={13} />
            <strong>Template editor</strong>
          </div>
          <div className="topbar-right">
            <span className="demo-badge">
              <span /> INTERACTIVE DEMO
            </span>
            <a
              className="github-link"
              href="https://github.com/iseto/dynamischer-template-editor"
              target="_blank"
              rel="noreferrer"
              aria-label="View project on GitHub"
            >
              <GitBranch size={18} />
            </a>
          </div>
        </header>
        <main id="workspace" tabIndex={-1}>
          <section className="intro">
            <div className="eyebrow">
              <span /> A SMALL TOOL FOR BIG IDEAS
            </div>
            <div className="intro-row">
              <div>
                <h1>
                  Your words. <span>Your canvas.</span>
                </h1>
                <p>Create, personalize, and bring your documents to life.</p>
              </div>
              <button className="build-link" onClick={() => setAboutOpen(true)}>
                About this build <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="feature-pills">
              <span>
                <PenLine size={13} /> Rich text editing
              </span>
              <span>
                <Braces size={13} /> Dynamic variables
              </span>
              <span>
                <Monitor size={13} /> Live preview
              </span>
              <span className="open-pill">
                <span /> Open source
              </span>
            </div>
          </section>

          <section className="editor-workspace" aria-label="Document workspace">
            <div className="document-header">
              <div className="document-heading">
                <span className="document-icon">
                  <FileText size={21} strokeWidth={1.5} />
                </span>
                <div>
                  <input
                    className="document-title"
                    aria-label="Document title"
                    value={draft.title}
                    onChange={(event) =>
                      updateDraft({ title: event.target.value })
                    }
                  />
                  <p>{template.description}</p>
                </div>
              </div>
              <button className="primary-button" onClick={download}>
                <ArrowDownToLine size={16} /> Export HTML
              </button>
            </div>
            <div className="workspace-grid">
              <div className="editor-column">
                <div
                  className="editor-tabs"
                  role="tablist"
                  aria-label="Document view"
                >
                  {(
                    [
                      { id: "edit", label: "Editor", icon: PenLine },
                      { id: "preview", label: "Preview", icon: Monitor },
                      { id: "html", label: "HTML", icon: Code2 },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      id={`tab-${tab.id}`}
                      role="tab"
                      aria-selected={view === tab.id}
                      aria-controls="document-panel"
                      className={view === tab.id ? "selected" : ""}
                      onClick={() => setView(tab.id)}
                      onKeyDown={(event) => {
                        const views = ["edit", "preview", "html"] as const;
                        const direction =
                          event.key === "ArrowRight"
                            ? 1
                            : event.key === "ArrowLeft"
                              ? -1
                              : 0;
                        if (direction) {
                          event.preventDefault();
                          const next =
                            views[(views.indexOf(view) + direction + 3) % 3];
                          setView(next);
                          document.getElementById(`tab-${next}`)?.focus();
                        }
                      }}
                      tabIndex={view === tab.id ? 0 : -1}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  ))}
                  <span className="document-type">.html</span>
                </div>
                <div
                  className={`document-panel ${view !== "edit" ? "paper-panel" : ""}`}
                  id="document-panel"
                  role="tabpanel"
                  aria-labelledby={`tab-${view}`}
                >
                  <div
                    className={
                      view === "edit" ? "editor-visible" : "editor-hidden"
                    }
                    aria-hidden={view !== "edit"}
                  >
                    {!ready && (
                      <div className="editor-loading">
                        {editorError
                          ? "The editor could not load. Reload the page to try again. Your draft is still available in Preview and HTML."
                          : "Preparing your canvas…"}
                      </div>
                    )}
                    <RichEditor
                      key={selected}
                      html={draft.html}
                      onChange={(html) => updateDraft({ html })}
                      editorRef={editorRef}
                      onReady={() => {
                        setReady(true);
                        setEditorError(false);
                      }}
                      onLoadError={() => setEditorError(true)}
                    />
                  </div>
                  {view === "preview" && (
                    <>
                      <div className="preview-controls">
                        <span>LIVE PREVIEW</span>
                        <div>
                          <button
                            className={`icon-button ${!mobilePreview ? "pressed" : ""}`}
                            aria-label="Desktop preview"
                            aria-pressed={!mobilePreview}
                            onClick={() => setMobilePreview(false)}
                          >
                            <Monitor size={16} />
                          </button>
                          <button
                            className={`icon-button ${mobilePreview ? "pressed" : ""}`}
                            aria-label="Mobile preview"
                            aria-pressed={mobilePreview}
                            onClick={() => setMobilePreview(true)}
                          >
                            <Smartphone size={16} />
                          </button>
                        </div>
                      </div>
                      <iframe
                        className={`document-preview ${mobilePreview ? "mobile-preview" : ""}`}
                        title="Live document preview"
                        sandbox=""
                        srcDoc={exportDocument(draft.title, rendered)}
                      />
                    </>
                  )}
                  {view === "html" && (
                    <div className="html-view">
                      <div className="source-label">
                        <Code2 size={16} /> Generated HTML{" "}
                        <span>Variables resolved</span>
                      </div>
                      <pre>
                        <code>{rendered}</code>
                      </pre>
                    </div>
                  )}
                </div>
                <div className="editor-status">
                  <span>
                    <span
                      className={`status-dot ${saveStatus === "Storage unavailable" ? "warning" : ""}`}
                    />
                    {saveStatus}
                  </span>
                  <span>
                    {words} words <span className="status-divider">/</span>{" "}
                    Powered by{" "}
                    <a
                      href="https://hugerte.org"
                      target="_blank"
                      rel="noreferrer"
                    >
                      HugeRTE
                    </a>
                  </span>
                </div>
              </div>
              <aside
                className="variables-panel"
                aria-labelledby="variables-heading"
              >
                <div className="variables-title">
                  <h2 id="variables-heading">
                    <Braces size={17} /> Variables
                  </h2>
                  <span>{draft.variables.length}</span>
                </div>
                <p className="variables-description">
                  A personal touch, everywhere.
                  <br /> Update a value. Watch it flow.
                </p>
                <div className="variable-list">
                  {draft.variables.map((variable) => (
                    <div className="variable-field" key={variable.key}>
                      <div className="variable-label">
                        <label htmlFor={`variable-${variable.key}`}>
                          {variable.label}
                        </label>
                        <button
                          className="remove-variable icon-button"
                          aria-label={`Remove ${variable.label} variable`}
                          onClick={() =>
                            updateDraft({
                              variables: draft.variables.filter(
                                (item) => item.key !== variable.key,
                              ),
                            })
                          }
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <input
                        id={`variable-${variable.key}`}
                        value={variable.value}
                        placeholder="Enter a value"
                        onChange={(event) =>
                          updateDraft({
                            variables: draft.variables.map((item) =>
                              item.key === variable.key
                                ? { ...item, value: event.target.value }
                                : item,
                            ),
                          })
                        }
                      />
                      <button
                        className="variable-token"
                        onClick={() => insertVariable(variable.key)}
                        aria-label={`Insert ${variable.key} variable`}
                      >
                        <span>{`{{${variable.key}}}`}</span>
                        <Plus size={11} />
                      </button>
                    </div>
                  ))}
                </div>
                {addingVariable ? (
                  <form className="add-variable-form" onSubmit={addVariable}>
                    <label htmlFor="new-variable">Variable name</label>
                    <input
                      id="new-variable"
                      value={newKey}
                      onChange={(event) => setNewKey(event.target.value)}
                      placeholder="e.g. company"
                      required
                    />
                    <div>
                      <button className="small-button" type="submit">
                        Add variable
                      </button>
                      <button
                        className="icon-button"
                        type="button"
                        aria-label="Cancel new variable"
                        onClick={() => setAddingVariable(false)}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    className="add-variable"
                    onClick={() => setAddingVariable(true)}
                  >
                    <Plus size={14} /> Add variable
                  </button>
                )}
                <div className="variable-tip">
                  <Sparkles size={16} />
                  <p>
                    Click a <strong>{"{{variable}}"}</strong> to insert it at
                    your cursor. Preview brings it to life.
                  </p>
                </div>
                <button
                  className="reset-button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Restore this template? Your edits to this document and its variables will be replaced.",
                      )
                    ) {
                      reset();
                      setNotice("Template restored.");
                    }
                  }}
                >
                  <RotateCcw size={13} /> Restore template
                </button>
              </aside>
            </div>
          </section>
          <section
            className="capability-strip"
            aria-label="Editor capabilities"
          >
            <div className="capability-icon">
              <Sparkles size={19} />
            </div>
            <div>
              <h2>More than just bold & italic.</h2>
              <p>
                Tables, images, code blocks, and a whole lot of possibility.
              </p>
            </div>
            <button
              onClick={() => {
                setView("edit");
                editorRef.current?.focus();
                editorRef.current?.execCommand("mceInsertTable", false, {
                  rows: 3,
                  columns: 2,
                });
                setNotice("Table inserted. Make it your own.");
              }}
              disabled={!ready}
            >
              <span>Try adding a table</span>
              <ArrowUpRight size={15} />
            </button>
          </section>
          <footer className="page-footer">
            <span>
              Designed & built by{" "}
              <button onClick={() => setAboutOpen(true)}>
                Ignatius Seto <ArrowUpRight size={11} />
              </button>
            </span>
            <span>
              React <span>·</span> TypeScript <span>·</span> HugeRTE{" "}
              <MoreHorizontal size={15} />
            </span>
          </footer>
        </main>
      </div>
      <div
        className={`toast ${notice ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice && (
          <>
            <Check size={16} />
            {notice}
          </>
        )}
      </div>
      <dialog
        ref={aboutRef}
        className="about-dialog"
        onCancel={() => setAboutOpen(false)}
        aria-labelledby="about-heading"
      >
        <button
          className="dialog-close icon-button"
          aria-label="Close about dialog"
          onClick={() => setAboutOpen(false)}
        >
          <X size={20} />
        </button>
        <span className="eyebrow">BEHIND THE BUILD</span>
        <h2 id="about-heading">
          Simple on the surface.
          <br />
          <em>Thoughtful underneath.</em>
        </h2>
        <p>
          I'm Ignatius Seto. Template Studio is a hands-on portfolio project
          exploring how reusable documents can feel personal.
        </p>
        <div className="about-skills">
          <span>React & TypeScript</span>
          <span>Responsive UI</span>
          <span>Accessible interactions</span>
          <span>Automated testing</span>
        </div>
        <p>
          Edit rich text, insert tables and images, inspect HTML, and
          personalize documents with variables. Your drafts stay in this
          browser. There is no account or server upload.
        </p>
        <p>
          The editor is{" "}
          <a href="https://hugerte.org" target="_blank" rel="noreferrer">
            HugeRTE
          </a>
          , a free, MIT-licensed open-source project. Its license is included
          with the locally served editor assets.
        </p>
        <a
          className="primary-button"
          href="https://github.com/iseto/dynamischer-template-editor"
          target="_blank"
          rel="noreferrer"
        >
          <GitBranch size={17} /> Explore the source <ArrowUpRight size={15} />
        </a>
      </dialog>
    </div>
  );
}
