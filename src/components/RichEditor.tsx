import { Editor } from "@hugerte/hugerte-react";
import type { Editor as HugeEditor } from "hugerte";
import { useEffect, type MutableRefObject } from "react";
import { documentStyles } from "../utils/document";

function applyViewingStyles(editor: HugeEditor, styles: string) {
  const doc = editor.getDoc();
  if (!doc?.head) return;
  let style = doc.getElementById("studio-appearance");
  if (!style) {
    style = doc.createElement("style");
    style.id = "studio-appearance";
    doc.head.appendChild(style);
  }
  style.textContent = styles;
}

interface Props {
  viewingStyles: string;
  html: string;
  onChange: (html: string) => void;
  editorRef: MutableRefObject<HugeEditor | null>;
  onReady: () => void;
  onLoadError: () => void;
}
export default function RichEditor({
  viewingStyles,
  html,
  onChange,
  editorRef,
  onReady,
  onLoadError,
}: Props) {
  useEffect(() => {
    if (editorRef.current) applyViewingStyles(editorRef.current, viewingStyles);
  }, [viewingStyles, editorRef]);
  const base = `${import.meta.env.BASE_URL}vendor/hugerte`;
  return (
    <Editor
      hugerteScriptSrc={`${base}/hugerte.min.js`}
      value={html}
      onScriptsLoadError={onLoadError}
      onInit={(_, editor) => {
        editorRef.current = editor;
        applyViewingStyles(editor, viewingStyles);
        onReady();
      }}
      onEditorChange={onChange}
      init={{
        base_url: base,
        suffix: ".min",
        height: 635,
        menubar: "edit insert format tools table",
        plugins:
          "advlist autolink lists link image charmap searchreplace visualblocks code codesample fullscreen table wordcount",
        toolbar:
          "undo redo | blocks | bold italic underline | alignleft aligncenter | bullist numlist | link image table | codesample code fullscreen",
        toolbar_mode: "sliding",
        branding: false,
        promotion: false,
        resize: false,
        content_style: documentStyles,
        statusbar: false,
        iframe_aria_text: "Rich text document editor",
        contextmenu: "link image table",
        mobile: { menubar: false, toolbar_mode: "sliding" },
        image_title: true,
        image_description: true,
        automatic_uploads: true,
        images_upload_handler: (blob) =>
          new Promise((resolve, reject) => {
            if (blob.blob().size > 3 * 1024 * 1024) {
              reject("Choose an image smaller than 3 MB.");
              return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject("The image could not be read.");
            reader.readAsDataURL(blob.blob());
          }),
        file_picker_types: "image",
        file_picker_callback: (callback) => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;
            if (file.size > 3 * 1024 * 1024) {
              editorRef.current?.windowManager.alert(
                "Choose an image smaller than 3 MB.",
              );
              return;
            }
            const reader = new FileReader();
            reader.onload = () =>
              callback(String(reader.result), { alt: file.name });
            reader.readAsDataURL(file);
          };
          input.click();
        },
      }}
    />
  );
}
