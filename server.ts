// Local development server: Vite with hot reload + the same /api/* handlers that run on Netlify,
// so the contact form and newsletter behave locally exactly as in production.
// Production is served by Netlify (static dist/ + netlify/functions); see netlify.toml.
import express from "express";
import { createServer as createViteServer } from "vite";
import type { Handler, HandlerEvent } from "@netlify/functions";
import { handler as sendEmail } from "./netlify/functions/send-email";
import { handler as subscribe } from "./netlify/functions/subscribe";
import { handler as unsubscribe } from "./netlify/functions/unsubscribe";

const PORT = 3000;
const FUNCTIONS: Record<string, Handler> = {
  "send-email": sendEmail,
  subscribe,
  unsubscribe,
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "100kb" }));

  app.all("/api/:fn", async (req, res) => {
    const fn = FUNCTIONS[req.params.fn];
    if (!fn) return res.status(404).json({ error: "Not found" });

    const event = {
      httpMethod: req.method,
      headers: req.headers as Record<string, string>,
      body: JSON.stringify(req.body ?? {}),
    } as HandlerEvent;

    const result = await fn(event, {} as never);
    if (!result) return res.status(204).end();
    res.status(result.statusCode).set(result.headers ?? {}).send(result.body ?? "");
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
