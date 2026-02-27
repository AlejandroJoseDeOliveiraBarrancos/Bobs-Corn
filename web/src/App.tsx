import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import { CheckCircle2, AlertTriangle, Activity, ShoppingCart } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type BuyResponse = {
  success: boolean;
  item: string;
  quantity: number;
};

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

async function apiHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

async function apiBuy(): Promise<{
  data?: BuyResponse;
  retryAfter?: string;
  status: number;
}> {
  const payload = { name: "corn", quantity: 1 };

  const res = await fetch(`${API_BASE_URL}/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const retryAfter = res.headers.get("Retry-After") ?? undefined;

  if (res.ok) return { status: res.status, data: await res.json() };
  return { status: res.status, retryAfter };
}

export default function App() {
  const [health, setHealth] = useState<"checking" | "up" | "down">("checking");
  const [lastResult, setLastResult] = useState<BuyResponse | null>(null);
  const [busy, setBusy] = useState(false);

  const statusLabel = useMemo(() => {
    if (health === "checking") return "Checking…";
    if (health === "up") return "Online";
    return "Offline";
  }, [health]);

  useEffect(() => {
    apiHealth()
      .then(() => setHealth("up"))
      .catch(() => setHealth("down"));
  }, []);

  const onBuy = async () => {
    setBusy(true);
    setLastResult(null);

    try {
      const r = await apiBuy();

      if (r.status === 200 && r.data) {
        setLastResult(r.data);
        toast.success("Order placed!");
        return;
      }

      if (r.status === 429) {
        toast.error(
          r.retryAfter
            ? `Please try again in ${r.retryAfter} seconds.`
            : "You're doing that too fast. Please try again in a moment."
        );
        return;
      }

      toast.error("Something went wrong. Please try again.");
    } catch {
      toast.error("We couldn’t reach the service. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />

      <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">Bobs Corn</h1>
                <p className="mt-1 text-sm text-zinc-300">
                  One-click purchase demo.
                </p>
              </div>

              <div
                className={classNames(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border",
                  health === "up" &&
                    "bg-emerald-500/15 text-emerald-200 border-emerald-500/20",
                  health === "down" &&
                    "bg-red-500/15 text-red-200 border-red-500/20",
                  health === "checking" &&
                    "bg-sky-500/15 text-sky-200 border-sky-500/20"
                )}
              >
                <Activity
                  className={classNames("h-4 w-4", health === "checking" && "animate-pulse")}
                />
                {statusLabel}
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {/* Product Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-white/10 bg-zinc-950/30 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <span className="text-xl">🌽</span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Corn</p>
                      <p className="text-sm text-zinc-300">
                        Quantity: <span className="font-semibold text-zinc-100">1</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-zinc-400">Price</p>
                    <p className="text-lg font-semibold">$1.00</p>
                  </div>
                </div>

                <button
                  onClick={onBuy}
                  disabled={busy || health !== "up"}
                  className={classNames(
                    "mt-5 w-full rounded-xl px-4 py-3 font-semibold transition inline-flex items-center justify-center gap-2",
                    "bg-white text-zinc-950 hover:bg-zinc-200",
                    (busy || health !== "up") && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {busy ? "Processing…" : "Buy now"}
                </button>

                <p className="mt-3 text-xs text-zinc-400">
                  If the service is busy, we’ll ask you to try again shortly.
                </p>
              </motion.div>

              {/* Success panel */}
              <AnimatePresence>
                {lastResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-300 mt-0.5" />
                      <div>
                        <p className="font-semibold text-emerald-100">Order confirmed</p>
                        <p className="text-sm text-emerald-200/90">
                          You bought <span className="font-semibold">{lastResult.quantity}</span>{" "}
                          <span className="font-semibold">{lastResult.item}</span>.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Offline panel */}
              {health === "down" && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-300 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-100">Service unavailable</p>
                      <p className="text-sm text-red-200/90">Please try again later.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}