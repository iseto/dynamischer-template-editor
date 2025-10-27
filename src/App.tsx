import React from "react";
import TemplateForm from "./components/TemplateForm";

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Dynamischer Template-Editor</h1>
        <p>Live-Preview App</p>
      </header>
      <main>
        <TemplateForm />
      </main>
    </div>
  );
}
