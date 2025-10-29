import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import TemplateForm from "../components/TemplateForm";
import * as useTemplateHook from "../hooks/useTemplate";
import { vi } from "vitest";

vi.mock("../hooks/useTemplate");
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("TemplateForm-Komponente", () => {
  const mockUpdateField = vi.fn();
  const mockUpdateLabel = vi.fn();
  const mockAddField = vi.fn();
  const mockRemoveField = vi.fn();
  const mockClearAll = vi.fn();

  const mockFields = [
    { id: "1", label: "Name", value: "Max", type: "text" },
    { id: "2", label: "Adresse", value: "Musterstraße", type: "textarea" },
  ];

  beforeEach(() => {
    vi.spyOn(useTemplateHook, "default").mockReturnValue({
      fields: mockFields,
      updateField: mockUpdateField,
      updateLabel: mockUpdateLabel,
      addField: mockAddField,
      removeField: mockRemoveField,
      clearAll: mockClearAll,
    });
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rendert alle Formularfelder und Vorschau", () => {
    render(<TemplateForm />);

    expect(
      screen.getByRole("heading", { name: /Eingabefelder/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Live Preview/i })
    ).toBeInTheDocument();

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4);
    expect(screen.getByDisplayValue("Max")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Musterstraße")).toBeInTheDocument();
  });

  it("aktualisiert das Label beim Eingeben von Text in das Label-Eingabefeld", async () => {
    render(<TemplateForm />);
    const nameInput = screen.getByDisplayValue("Name");

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "Vorname" } });
      await flushPromises();
    });

    expect(mockUpdateLabel).toHaveBeenCalledWith("1", "Vorname");
  });

  it("aktualisiert den Feldwert bei der Eingabe in das Eingabefeld.", async () => {
    render(<TemplateForm />);
    const fieldInputs = screen.getAllByRole("textbox");

    await act(async () => {
      fireEvent.change(fieldInputs[1], { target: { value: "Erika" } });
      await flushPromises();
    });

    expect(mockUpdateField).toHaveBeenCalledWith("1", "Erika");
  });

  it("fügt ein neues Feld hinzu, wenn „Feld hinzufügen” angeklickt wird", async () => {
    render(<TemplateForm />);
    const addButton = screen.getByRole("button", { name: /Feld hinzufügen/i });

    await act(async () => {
      fireEvent.click(addButton);
    });

    expect(mockAddField).toHaveBeenCalledTimes(1);
  });

  it("zeigt einen Bestätigungsdialog an und löscht die Felder nach der Bestätigung.", async () => {
    render(<TemplateForm />);

    const resetButton = screen.getByRole("button", {
      name: /Alles zurücksetzen/i,
    });

    await act(async () => {
      fireEvent.click(resetButton);
    });

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringMatching(/wirklich alle Felder/i)
    );
    expect(mockClearAll).toHaveBeenCalled();
  });

  it("löscht Felder nicht, wenn der Benutzer die Bestätigung abbricht", async () => {
    (window.confirm as jest.Mock).mockReturnValueOnce(false);
    render(<TemplateForm />);
    const resetButton = screen.getByRole("button", {
      name: /Alles zurücksetzen/i,
    });

    await act(async () => {
      fireEvent.click(resetButton);
    });

    expect(mockClearAll).toHaveBeenCalled();
  });

  it("fokussiert die neueste Feldeingabe, wenn ein neues Feld hinzugefügt wird.", async () => {
    const fields = [
      ...mockFields,
      { id: "3", label: "Neu", value: "", type: "text" },
    ];
    let rerender: any;

    const { rerender: rer } = render(<TemplateForm />);
    rerender = rer;

    (useTemplateHook.default as any).mockReturnValue({
      fields,
      updateField: mockUpdateField,
      updateLabel: mockUpdateLabel,
      addField: mockAddField,
      removeField: mockRemoveField,
      clearAll: mockClearAll,
    });

    await act(async () => {
      rerender(<TemplateForm />);
      await flushPromises();
    });

    const newestInput = screen.getByDisplayValue("Neu");
    expect(document.activeElement).toBe(newestInput);
  });
});
