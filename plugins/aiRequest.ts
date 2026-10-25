const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * POSTs to one of the /api/generate-* routes and returns its JSON.
 * Retries once when the server is busy or times out, and turns a plain-text
 * error page (e.g. a Vercel timeout, "An error occurred...") into a message
 * that says what to do instead of a JSON parse error.
 */
export async function postForAi<T>(url: string, body: unknown): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    let res: Response
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        // The route may take up to 60s with its own retry
        signal: AbortSignal.timeout(65000),
      })
    } catch {
      if (attempt < 2) continue
      throw new Error('The AI request timed out. Try again in a minute.')
    }

    const text = await res.text()
    let data: any = null
    try {
      data = JSON.parse(text)
    } catch {
      // Not JSON: a timeout or crash page from the host
    }

    if (res.ok && data) return data as T

    // A used-up free limit won't clear in 2 seconds, so don't retry it
    if (res.status !== 429 && res.status >= 500 && attempt < 2) {
      await sleep(2000)
      continue
    }

    throw new Error(
      data?.error ??
        (res.status === 504 || !data
          ? 'The AI took too long to answer. Try again in a minute.'
          : `Request failed (${res.status})`),
    )
  }
}
