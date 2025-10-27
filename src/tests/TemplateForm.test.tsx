import { render, screen, fireEvent } from "@testing-library/react";
import TemplateForm from "../components/TemplateForm";
import "@testing-library/jest-dom";

describe("Live-Preview App", () => {
  it("aktualisiert den Preview-Bereich wenn Felder sich geändert haben", () => {
    render(<TemplateForm />);
    const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Iggy" } });
    expect(screen.getByRole("region", { name: /preview/i })).toHaveTextContent(
      "Name: Iggy"
    );
  });
});
