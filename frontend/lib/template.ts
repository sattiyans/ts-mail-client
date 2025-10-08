export function extractTemplateVariables(content: string): string[] {
  if (!content) return [];
  const matches = content.match(/\{\{([^}]+)\}\}/g) || [];
  return matches
    .map((m) => m.replace(/[{}]/g, "").trim())
    .filter((v, i, arr) => v.length > 0 && arr.indexOf(v) === i);
}

export function diffVariableSets(required: string[], provided: string[]): {
  missing: string[];
  extras: string[];
} {
  const req = new Set(required);
  const prov = new Set(provided);
  const missing: string[] = [];
  const extras: string[] = [];

  req.forEach((v) => {
    if (!prov.has(v)) missing.push(v);
  });
  prov.forEach((v) => {
    if (!req.has(v)) extras.push(v);
  });
  return { missing, extras };
}


