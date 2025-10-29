import { render, fireEvent } from "@testing-library/react";
import TemplateForm from "../components/TemplateForm";
import { vi } from "vitest";

describe("Reset confirmation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows a confirmation dialog before clearing", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValueOnce(true);
    const { getByText } = render(<TemplateForm />);
    fireEvent.click(getByText("Alles zurücksetzen"));
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it("cancels reset if user declines", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValueOnce(false);
    const { getByText } = render(<TemplateForm />);
    fireEvent.click(getByText("Alles zurücksetzen"));

    const stored = localStorage.getItem("dte:fields_v1");
    expect(stored).not.toBeNull();
    confirmSpy.mockRestore();
  });
});
