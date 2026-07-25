"use client";

import Editor from "@monaco-editor/react";
import { Code, ChevronDown } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "typescript", label: "TypeScript" },
];

export default function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
}: CodeEditorProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/40 overflow-hidden space-y-0">
      {/* Header Bar */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 font-mono">
          <Code className="w-4 h-4 text-indigo-400" />
          <span>Code Editor</span>
        </div>

        {/* Language Selector */}
        <div className="relative flex items-center">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="appearance-none bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold rounded-lg pl-3 pr-8 py-1.5 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-zinc-900 text-white">
                {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="pt-2">
        <Editor
          height="350px"
          theme="vs-dark"
          language={language}
          value={value}
          onChange={(val) => onChange(val || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12 },
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, Monaco, monospace",
          }}
        />
      </div>
    </div>
  );
}
