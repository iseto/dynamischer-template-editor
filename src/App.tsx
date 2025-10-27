import TemplateForm from "./components/TemplateForm";

export default function App() {
  return (
    <div className="app">
      <header role="banner">
        <h1>Dynamischer Template-Editor</h1>
        <p>Live-Preview App</p>
      </header>
      <main role="banner">
        <TemplateForm />
      </main>
    </div>
  );
}
