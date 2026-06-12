import express from "express";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import path from "path";
import cors from "cors";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // Initialize Resend lazily
  const getResend = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is required");
    }
    return new Resend(apiKey);
  };

  // API Route for sending emails
  app.post("/api/send-email", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const resend = getResend();
      const { data, error } = await resend.emails.send({
        from: "InnerVisio Web <onboarding@resend.dev>",
        to: ["innervisio@gmail.com"],
        subject: `Nová poptávka z webu: ${subject}`,
        replyTo: email,
        text: `Jméno: ${name}\nEmail: ${email}\n\nZpráva:\n${message}`,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, data });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ 
        error: err instanceof Error ? err.message : "Failed to send email. Please ensure RESEND_API_KEY is configured." 
      });
    }
  });

  // API Route for newsletter subscription
  app.post("/api/subscribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const resend = getResend();
      const { data, error } = await resend.emails.send({
        from: "InnerVisio Web <onboarding@resend.dev>",
        to: ["innervisio@gmail.com"],
        subject: `Nový odběratel newsletteru: ${email}`,
        text: `Nový uživatel se přihlásil k odběru newsletteru: ${email}`,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, data });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ 
        error: err instanceof Error ? err.message : "Failed to subscribe. Please ensure RESEND_API_KEY is configured." 
      });
    }
  });

  // Serve static asset folders from the workspace root during development
  if (process.env.NODE_ENV !== "production") {
    const assetFolders = [
      '2DPudorysy',
      '3DPudorys',
      'Banner',
      'Bludovice',
      'Exteriér',
      'HeroSection',
      'Lipence',
      'RezidenceHorska',
      'VizualizaceBludovice',
      'VizualizaceExterieruSkorkov',
      'VizualizaceExterieruTran',
      'VizualizaceInterieru3',
      'VizualizaceKancelare'
    ];

    for (const folder of assetFolders) {
      const folderPath = path.resolve(process.cwd(), folder);
      if (fs.existsSync(folderPath)) {
        app.use(`/${folder}`, express.static(folderPath));
        
        // Handle case and diacritic variations specifically for Exterier / Exteriér
        if (folder === 'Exteriér') {
          app.use('/Exterier', express.static(folderPath));
          app.use('/exterier', express.static(folderPath));
        }
      }
    }
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));

    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
