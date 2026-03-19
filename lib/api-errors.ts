export function getApiErrorPayload(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return {
      error: error.message
    };
  }

  if (error && typeof error === "object") {
    const candidate = error as {
      message?: unknown;
      details?: unknown;
      hint?: unknown;
      code?: unknown;
    };

    return {
      error:
        typeof candidate.message === "string" && candidate.message.length > 0
          ? candidate.message
          : fallback,
      details: typeof candidate.details === "string" ? candidate.details : undefined,
      hint: typeof candidate.hint === "string" ? candidate.hint : undefined,
      code: typeof candidate.code === "string" ? candidate.code : undefined
    };
  }

  return { error: fallback };
}
