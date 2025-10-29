import { renderHook, act } from "@testing-library/react";
import useTemplate from "../hooks/useTemplate";
import type { TemplateField } from "../types/template";
import { vi } from "vitest";

describe("useTemplate hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Storage.prototype, "setItem");
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("fügt Felder hinzu, aktualisiert sie, entfernt sie und speichert sie dauerhaft", () => {
    const { result } = renderHook(() => useTemplate());

    expect(result.current.fields.length).toBeGreaterThan(0);

    act(() => {
      result.current.addField("Firma");
    });
    const added: TemplateField | undefined = result.current.fields.find(
      (f) => f.label === "Firma"
    );
    expect(added).toBeTruthy();

    act(() => {
      result.current.updateField(added!.id, "AGFirma");
    });
    const updated = result.current.fields.find((f) => f.id === added!.id);
    expect(updated?.value).toBe("AGFirma");

    act(() => {
      result.current.removeField(added!.id);
    });
    const removed = result.current.fields.find((f) => f.id === added!.id);
    expect(removed).toBeUndefined();
  });

  it("kann alle Felder löschen und auf die Standardeinstellungen zurücksetzen", () => {
    const { result } = renderHook(() => useTemplate());

    act(() => {
      result.current.addField("Temp");
    });
    expect(result.current.fields.some((f) => f.label === "Temp")).toBe(true);

    act(() => {
      result.current.clearAll();
    });
    // default fields wieder da
    expect(result.current.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "name" }),
        expect.objectContaining({ id: "vorname" }),
        expect.objectContaining({ id: "adresse" }),
      ])
    );
  });

  it("kann eine Feldbezeichnung aktualisieren", () => {
    const { result } = renderHook(() => useTemplate());
    const first = result.current.fields[0];

    act(() => {
      result.current.updateLabel(first.id, "Neues Label");
    });

    expect(result.current.fields.find((f) => f.id === first.id)?.label).toBe(
      "Neues Label"
    );
  });

  it("Felder können neu angeordnet werden", () => {
    const { result } = renderHook(() => useTemplate());
    const reversed = [...result.current.fields].reverse();

    act(() => {
      result.current.reorderFields(reversed);
    });

    expect(result.current.fields[0].id).toBe(reversed[0].id);
  });

  it("Lädt Felder aus localStorage, falls vorhanden", () => {
    const fake: TemplateField[] = [
      { id: "x", label: "X", value: "1", type: "text" },
    ];
    localStorage.setItem("dte:fields_v1", JSON.stringify(fake));
    const { result } = renderHook(() => useTemplate());
    expect(result.current.fields).toEqual(fake);
  });

  it("Änderungen mit Debounce beibehalten", () => {
    const { result } = renderHook(() => useTemplate());

    act(() => {
      result.current.addField("PersistTest");
    });

    vi.advanceTimersByTime(300);
    const stored = JSON.parse(
      localStorage.getItem("dte:fields_v1") as string
    ) as TemplateField[];

    expect(stored.some((f) => f.label === "PersistTest")).toBe(true);
  });
});
