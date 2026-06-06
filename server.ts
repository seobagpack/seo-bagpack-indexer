import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

// Resolving ESM dirpaths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple in-memory DB for prototype
const urlsMap = new Map();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/index", (req, res) => {
    const { urls, email } = req.body;
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "Array of URLs is required" });
    }

    const newEntries = urls.map((urlStr) => {
      let cleanedUrl = urlStr.trim();
      if (!cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
        cleanedUrl = 'https://' + cleanedUrl;
      }
      
      const entry = {
        id: uuidv4(),
        url: cleanedUrl,
        status: "pending",
        submittedAt: new Date().toISOString(),
        statusUpdatedAt: new Date().toISOString(),
        email: email || undefined,
      };
      urlsMap.set(entry.id, entry);
      return entry;
    });

    res.json({ success: true, count: newEntries.length, data: newEntries });
  });

  app.get("/api/urls", (req, res) => {
    const data = Array.from(urlsMap.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    res.json({ data });
  });

  // Background simulation for fake crawler/indexer
  setInterval(() => {
    urlsMap.forEach((entry) => {
      if (entry.status === "pending") {
        if (Math.random() > 0.6) { // 40% chance to progress
          entry.status = "crawled";
          entry.statusUpdatedAt = new Date().toISOString();
        }
      } else if (entry.status === "crawled") {
        if (Math.random() > 0.4) { // 60% chance to indexed or failed
          entry.status = Math.random() > 0.9 ? "failed" : "indexed";
          if (entry.status === "failed") {
            entry.errorMessage = "Connection timeout resolving hostname";
          }
          entry.statusUpdatedAt = new Date().toISOString();
          
          if (entry.email) {
             console.log(`[EMAIL MOCK] Notifying ${entry.email} about status change of ${entry.url} to ${entry.status}`);
          }
        }
      }
    });
  }, 4000); // Check every 4 seconds

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // In express 4, standard '*' matches. Using * handles SPA routing fallback. 
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
