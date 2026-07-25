export const STARTER_TEMPLATES: Record<string, string> = {
  javascript: `function solve() {\n  // write your logic here\n}`,
  typescript: `function solve(): void {\n  // write your logic here\n}`,
  python: `def solve():\n    # write your logic here\n    pass`,
  java: `class Solution {\n    public void solve() {\n        // write your logic here\n    }\n}`,
  cpp: `class Solution {\npublic:\n    void solve() {\n        // write your logic here\n    }\n};`,
};

export function getStarterTemplate(language: string): string {
  const langKey = language.toLowerCase();
  return STARTER_TEMPLATES[langKey] || STARTER_TEMPLATES.javascript;
}
