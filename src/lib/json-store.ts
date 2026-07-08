import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { getDataDirectory } from "@/lib/data-directory";

type GitHubContentResponse = {
  content?: string;
  sha?: string;
};

const dataDirectory = getDataDirectory();
const githubApi = "https://api.github.com";

function githubConfig() {
  const token = process.env.GITHUB_DATA_TOKEN;
  const repo =
    process.env.GITHUB_DATA_REPO ||
    (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
      ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
      : "");
  const branch = process.env.GITHUB_DATA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main";
  if (!token || !repo) return null;
  return { token, repo, branch };
}

function encodeBase64(value: string) {
  return Buffer.from(value, "utf8").toString("base64");
}

function decodeBase64(value: string) {
  return Buffer.from(value.replace(/\s/g, ""), "base64").toString("utf8");
}

async function githubRequest<T>(pathName: string, init: RequestInit = {}) {
  const config = githubConfig();
  if (!config) throw new Error("GITHUB_DATA_NOT_CONFIGURED");

  const response = await fetch(`${githubApi}/repos/${config.repo}${pathName}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`GITHUB_DATA_REQUEST_FAILED:${response.status}:${body}`);
  }

  return response.json() as Promise<T>;
}

async function readFromGitHub(fileName: string) {
  if (process.env.NEXT_PHASE === "phase-production-build") return null;
  const config = githubConfig();
  if (!config) return null;
  const filePath = `data/${fileName}`;
  const result = await githubRequest<GitHubContentResponse>(`/contents/${filePath}?ref=${encodeURIComponent(config.branch)}`);
  return result.content ? decodeBase64(result.content) : "";
}

async function writeToGitHub(fileName: string, contents: string) {
  const config = githubConfig();
  if (!config) return false;
  const filePath = `data/${fileName}`;
  const current = await githubRequest<GitHubContentResponse>(`/contents/${filePath}?ref=${encodeURIComponent(config.branch)}`);

  await githubRequest(`/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      branch: config.branch,
      content: encodeBase64(contents),
      message: `Update ${filePath} from admin panel`,
      sha: current.sha,
    }),
  });

  return true;
}

async function readFromFile(fileName: string) {
  const filePath = path.join(dataDirectory, fileName);
  return readFile(filePath, "utf8");
}

async function writeToFile(fileName: string, contents: string) {
  await mkdir(dataDirectory, { recursive: true });
  const filePath = path.join(dataDirectory, fileName);
  const temporaryFile = `${filePath}.tmp`;
  await writeFile(temporaryFile, contents, "utf8");
  await rename(temporaryFile, filePath);
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const contents = await readFromGitHub(fileName) ?? await readFromFile(fileName);
    return JSON.parse(contents) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

export async function writeJsonFile(fileName: string, value: unknown) {
  const contents = `${JSON.stringify(value, null, 2)}\n`;
  if (await writeToGitHub(fileName, contents)) return;
  if (process.env.VERCEL) throw new Error("PERSISTENT_DATA_NOT_CONFIGURED");
  await writeToFile(fileName, contents);
}
