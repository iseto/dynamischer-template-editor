import { render, fireEvent } from "@testing-library/react";
import TemplateForm from "../components/TemplateForm";
import { vi } from "vitest";

describe("Bestätigung zum Zurücksetzen des Formulars", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("zeigt Bestätigung-Dialogfenster vor Zurücksetzen des Fomulars", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValueOnce(true);
    const { getByText } = render(<TemplateForm />);
    fireEvent.click(getByText("Alles zurücksetzen"));
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it("Löscht die Zurücksetzung, wenn der Benutzer ablehnt", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValueOnce(false);
    const { getByText } = render(<TemplateForm />);
    fireEvent.click(getByText("Alles zurücksetzen"));

    const stored = localStorage.getItem("dte:fields_v1");
    expect(stored).toBeNull();
    confirmSpy.mockRestore();
  });
});
