const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function retryAfterDelaySeconds(res: Response): Promise<number> {
  const v = res.headers.get("Retry-After");
  if (!v) return 1;
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(1, n) : 1;
}

export type BuyRequest = {
  name: string;
  quantity: number;
};

export type BuyResponse = {
  success: boolean;
  item: string;
  quantity: number;
};

export async function healthCheck(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

export async function apiBuy(): Promise<{
  data?: BuyResponse;
  retryAfter?: string;
  status: number;
}> {
  const payload = { name: "corn", quantity: 1 };

  const doRequest = async () => {
    return fetch(`${API_BASE_URL}/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  let res = await doRequest();

  if (res.status === 429) {
    const waitSeconds = await retryAfterDelaySeconds(res);
    await sleep(waitSeconds * 1000);
    res = await doRequest();
  }

  const retryAfter = res.headers.get("Retry-After") ?? undefined;

  if (res.ok) return { status: res.status, data: await res.json() };
  return { status: res.status, retryAfter };
}