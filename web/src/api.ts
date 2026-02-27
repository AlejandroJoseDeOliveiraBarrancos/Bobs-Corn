const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

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

export async function buy(payload: BuyRequest): Promise<BuyResponse> {
  const res = await fetch(`${API_BASE_URL}/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 429) {
    throw new Error("429 Too Many Requests (rate limit exceeded)");
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Buy failed (${res.status}): ${text}`);
  }

  return res.json();
}