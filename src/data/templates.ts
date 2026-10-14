import type { StudioTemplate } from "../types/template";

export const templates: StudioTemplate[] = [
  {
    id: "brief",
    title: "Project brief",
    category: "PLAN & CREATE",
    icon: "brief",
    description: "A little clarity before the first line of code.",
    variables: [
      {
        key: "project",
        label: "Project name",
        value: "A better digital experience",
      },
      { key: "author", label: "Created by", value: "Ignatius Seto" },
      { key: "client", label: "Client / team", value: "Studio North" },
      { key: "stack", label: "Tech stack", value: "React · TypeScript · Vite" },
    ],
    html: `<p style="color:#527263;font-size:11px;letter-spacing:2px"><strong>PROJECT BRIEF / 001</strong></p>
<h1>{{project}}</h1>
<p style="color:#71766e">Thoughtful design. Purposeful development.</p>
<hr />
<table style="width:100%;border-collapse:collapse"><tbody><tr><td style="border:0;padding:8px 0"><small>PREPARED BY</small><br /><strong>{{author}}</strong></td><td style="border:0;padding:8px 0"><small>FOR</small><br /><strong>{{client}}</strong></td></tr></tbody></table>
<h2>The idea</h2>
<p>Build an intuitive, accessible web experience that turns a complex workflow into something beautifully simple.</p>
<h2>What we're making</h2>
<ul><li>A responsive interface that feels at home on every screen.</li><li>Reusable components with a clear visual language.</li><li>A fast, accessible experience, from the first click to the last.</li></ul>
<h2>The approach</h2>
<p>Start with the people using it. Prototype the essentials, refine the details, and build with <strong>{{stack}}</strong>.</p>
<blockquote>Good tools get out of the way and let ideas take shape.</blockquote>
<p style="font-size:12px;color:#71766e">Made with care. Ready to make your own.</p>`,
  },
  {
    id: "case-study",
    title: "Case study",
    category: "SHOW YOUR WORK",
    icon: "case",
    description: "Tell the story behind what you built.",
    variables: [
      { key: "project", label: "Project name", value: "Template Studio" },
      { key: "author", label: "Created by", value: "Ignatius Seto" },
      {
        key: "stack",
        label: "Tech stack",
        value: "React, TypeScript & HugeRTE",
      },
    ],
    html: `<p style="color:#527263;font-size:11px;letter-spacing:2px"><strong>SELECTED WORK / CASE STUDY</strong></p><h1>{{project}}</h1><p>A small tool. A thoughtful experience.</p><hr /><h2>The challenge</h2><p>How can editing a reusable document feel as natural as writing one?</p><h2>The solution</h2><p>A focused workspace combining rich text editing, dynamic variables, and an instant preview. Built by <strong>{{author}}</strong> using {{stack}}.</p><h2>Under the hood</h2><table style="border-collapse:collapse;width:100%"><thead><tr><th>Focus</th><th>Implementation</th></tr></thead><tbody><tr><td>Interface</td><td>Responsive layouts & reusable React components</td></tr><tr><td>Reliability</td><td>TypeScript, local persistence & automated tests</td></tr><tr><td>Editing</td><td>MIT-licensed HugeRTE, HTML export & safe preview</td></tr></tbody></table><h2>What I learned</h2><p>Use this space to share your decisions, tradeoffs, and lessons. Add your own results to make the story yours.</p><blockquote>Details make the difference.</blockquote>`,
  },
  {
    id: "profile",
    title: "Developer profile",
    category: "INTRODUCE YOURSELF",
    icon: "resume",
    description: "A clean introduction to your craft.",
    variables: [
      { key: "author", label: "Your name", value: "Ignatius Seto" },
      { key: "role", label: "Your focus", value: "Frontend development" },
      {
        key: "stack",
        label: "Tech stack",
        value: "React · TypeScript · Accessible UI",
      },
    ],
    html: `<p style="color:#527263;font-size:11px;letter-spacing:2px"><strong>HELLO, I'M</strong></p><h1>{{author}}</h1><p>{{role}} / Thoughtful interfaces for the web.</p><hr /><h2>My toolkit</h2><p>{{stack}}</p><h2>Featured project</h2><h3>Template Studio</h3><p>A responsive document workspace exploring rich text editing, reusable templates, browser persistence, and accessible interaction.</p><h2>How I build</h2><ul><li>Clear components and strongly typed state.</li><li>Layouts that adapt to people and their devices.</li><li>Meaningful tests for the interactions that matter.</li></ul><h2>Let's connect</h2><p>Explore my code on <a href="https://github.com/iseto">GitHub</a>.</p><p style="color:#71766e;font-size:12px">Personalize this profile with your experience, projects, and contact details.</p>`,
  },
  {
    id: "blank",
    title: "Blank canvas",
    category: "START FRESH",
    icon: "blank",
    description: "Your next idea starts here.",
    variables: [{ key: "author", label: "Created by", value: "Ignatius Seto" }],
    html: "<h1>Something worth writing.</h1><p>Make room for your next idea. Start typing, add a table, or insert a variable.</p>",
  },
];

export const freshDraft = (id: string) => {
  const template =
    templates.find((template) => template.id === id) ?? templates[0];
  return {
    title: template.title,
    html: template.html,
    variables: template.variables.map((variable) => ({ ...variable })),
  };
};
