import { renderHook, act } from "@testing-library/react";
import useTemplate from "../hooks/useTemplate";
import type { TemplateField } from "../types/template";
import { vi } from "vitest";

describe("useTemplate hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Storage.prototype, "setItem");
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
    expect(localStorage.setItem).toHaveBeenCalled();

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
});
