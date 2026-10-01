import {
  API_BASE_URL,
  API_CHECK,
  API_FORMAT,
  API_RUN,
  API_VET,
} from "../constants/content.ts";

const JSON_HEADER = "application/json";

export type PracticeResult = {
  ok: boolean;
  stdout: string;
  stderr: string;
  formatted?: string;
  exitCode: number;
  unavailable?: boolean;
};

export type PracticeRequest = {
  source: string;
  lessonId?: string;
  exerciseId?: string;
};

const EMPTY: PracticeResult = {
  ok: false,
  stdout: "",
  stderr: "",
  exitCode: 1,
  unavailable: true,
};

export async function postPractice(path: string, body: PracticeRequest): Promise<PracticeResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": JSON_HEADER },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      return EMPTY;
    }
    return (await response.json()) as PracticeResult;
  } catch {
    return EMPTY;
  } finally {
    clearTimeout(timer);
  }
}

export function formatSource(source: string): Promise<PracticeResult> {
  return postPractice(API_FORMAT, { source });
}

export function vetSource(source: string): Promise<PracticeResult> {
  return postPractice(API_VET, { source });
}

export function runSource(source: string): Promise<PracticeResult> {
  return postPractice(API_RUN, { source });
}

export function checkSource(source: string, lessonId: string, exerciseId: string): Promise<PracticeResult> {
  return postPractice(API_CHECK, { source, lessonId, exerciseId });
}
