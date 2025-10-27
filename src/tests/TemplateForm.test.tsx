import { render, screen, fireEvent } from "@testing-library/react";
import TemplateForm from "../components/TemplateForm";
// import useTemplate from "../hooks/useTemplate";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock useTemplate
vi.mock("../hooks/useTemplate", () => {
  return {
    default: () => ({
      fields: [
        { id: "name", label: "Name", value: "", type: "text" },
        { id: "bio", label: "Bio", value: "", type: "textarea" },
      ],
      updateField: vi.fn(),
      addField: vi.fn(),
      removeField: vi.fn(),
      clearAll: vi.fn(),
    }),
  };
});

describe("TemplateForm", () => {
  it("renders form and preview sections", () => {
    render(<TemplateForm />);
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /live preview/i })
    ).toBeInTheDocument();
  });

  // const mockedUseTemplate = vi.mocked(useTemplate);

  it("renders input and textarea fields", () => {
    render(<TemplateForm />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Bio")).toBeInTheDocument();
  });

  // it("calls updateField when input changes", () => {
  //   // const { default: useTemplate } = require("../hooks/useTemplate");
  //   // const updateField = useTemplate().updateField;

  //   render(<TemplateForm />);
  //   const nameInput = screen.getByLabelText("Name");
  //   fireEvent.change(nameInput, { target: { value: "Iggy" } });

  //   expect(mockedUseTemplate().updateField).toHaveBeenCalledWith(
  //     "name",
  //     "Iggy"
  //   );
  // });

  // it("calls removeField when remove button is clicked", () => {
  //   // const { default: useTemplate } = require("../hooks/useTemplate");
  //   // const removeField = useTemplate().removeField;

  //   render(<TemplateForm />);
  //   const removeButton = screen.getByRole("button", {
  //     name: /entferne name feld/i,
  //   });
  //   fireEvent.click(removeButton);

  //   expect(mockedUseTemplate().updateField).toHaveBeenCalledWith("name");
  // });

  // it("calls addField when add button is clicked", () => {
  //   // const { default: useTemplate } = require("../hooks/useTemplate");
  //   // const addField = useTemplate().addField;

  //   render(<TemplateForm />);
  //   const addButton = screen.getByText("Feld hinzufügen");
  //   fireEvent.click(addButton);

  //   expect(mockedUseTemplate().updateField).toHaveBeenCalled();
  // });

  // it("calls clearAll when reset button is clicked", () => {
  //   // const { default: useTemplate } = require("../hooks/useTemplate");
  //   // const clearAll = useTemplate().clearAll;

  //   render(<TemplateForm />);
  //   const resetButton = screen.getByText("Alles zurücksetzen");
  //   fireEvent.click(resetButton);

  //   expect(mockedUseTemplate().updateField).toHaveBeenCalled();
  // });
});
