import { act, renderHook, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useStudio, { STORAGE_KEY } from "../hooks/useStudio";
import { renderDocument, exportDocument } from "../utils/document";

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("draft persistence", () => {
  it("keeps each template independent and restores edits after remounting", () => {
    const first = renderHook(() => useStudio());
    act(() =>
      first.result.current.updateDraft({
        title: "My brief",
        html: "<p>My work</p>",
      }),
    );
    act(() => first.result.current.select("profile"));
    expect(first.result.current.draft.title).toBe("Developer profile");
    act(() => first.result.current.updateDraft({ title: "My profile" }));
    act(() => first.result.current.select("brief"));
    expect(first.result.current.draft.html).toBe("<p>My work</p>");
    act(() => vi.advanceTimersByTime(300));
    first.unmount();
    const restored = renderHook(() => useStudio());
    expect(restored.result.current.draft.title).toBe("My brief");
    act(() => restored.result.current.select("profile"));
    expect(restored.result.current.draft.title).toBe("My profile");
  });
  it("recovers from malformed saved data without crashing", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selected: "brief",
        drafts: { brief: { title: "Invalid", html: 123, variables: [null] } },
      }),
    );
    const { result } = renderHook(() => useStudio());
    expect(result.current.draft.title).toBe("Project brief");
  });
  it("reports storage failure while keeping the draft editable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    const { result } = renderHook(() => useStudio());
    act(() => result.current.updateDraft({ title: "Unsaved draft" }));
    act(() => vi.advanceTimersByTime(300));
    expect(result.current.saveStatus).toBe("Storage unavailable");
    expect(result.current.draft.title).toBe("Unsaved draft");
  });
  it("restores only the selected template", () => {
    const { result } = renderHook(() => useStudio());
    act(() => result.current.updateDraft({ title: "Keep this" }));
    act(() => result.current.select("profile"));
    act(() => result.current.updateDraft({ title: "Discard this" }));
    act(() => result.current.reset());
    expect(result.current.draft.title).toBe("Developer profile");
    act(() => result.current.select("brief"));
    expect(result.current.draft.title).toBe("Keep this");
  });
});

describe("leaving the page", () => {
  it("flushes the latest edits before the debounce timer fires", () => {
    const { result } = renderHook(() => useStudio());
    act(() => result.current.updateDraft({ title: "Last-second edit" }));
    act(() => window.dispatchEvent(new Event("pagehide")));
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).drafts.brief.title,
    ).toBe("Last-second edit");
  });
});

describe("safe document generation", () => {
  it("substitutes repeated variables as text while retaining formatting", () => {
    const html = renderDocument(
      "<h1>{{name}}</h1><p><strong>{{name}}</strong> {{missing}}</p>",
      [
        {
          key: "name",
          label: "Name",
          value: "<img src=x onerror=alert(1)> & Seto",
        },
      ],
    );
    expect(html).toContain("&lt;img");
    expect(html).toContain("<strong>");
    expect(html).toContain("{{missing}}");
    expect(html).not.toContain("<img");
  });
  it("removes scripts, event handlers, and unsafe URLs before preview and export", () => {
    const html = renderDocument(
      '<script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">link</a><iframe src="https://example.com"></iframe>',
      [],
    );
    expect(html).not.toMatch(/script|onerror|javascript|iframe/);
    expect(html).toContain("link");
  });
  it("escapes exported titles and includes responsive document styles", () => {
    const exported = exportDocument(
      "</title><script>bad()</script>",
      "<h1>Hello</h1>",
    );
    expect(exported).toContain("&lt;/title&gt;");
    expect(exported).not.toContain("<script>");
    expect(exported).toContain('name="viewport"');
  });
});
