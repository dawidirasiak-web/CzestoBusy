import path from "node:path";

export function getDataDirectory() {
  const directory = process.env.DATA_DIR || "data";
  return path.isAbsolute(directory) ? directory : path.join(/* turbopackIgnore: true */ process.cwd(), directory);
}
