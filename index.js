// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { z } from "zod";
import PDFDocument from "pdfkit";
var contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters")
});
async function registerRoutes(app2) {
  app2.get("/api/analytics", async (req, res) => {
    try {
      const mockData = {
        visits: [120, 132, 145, 162, 158, 169, 175],
        achievements: 12,
        skillProgress: {
          "JavaScript": 85,
          "React": 90,
          "Node.js": 80
        },
        interactionStats: {
          clicks: 450,
          scrollDepth: 85,
          timeSpent: 240
        }
      };
      return res.status(200).json(mockData);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching analytics"
      });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      console.log("Contact form submission:", validatedData);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return res.status(200).json({
        success: true,
        message: "Message received! Thank you for reaching out."
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later."
      });
    }
  });
  app2.post("/api/generate-resume", async (req, res) => {
    try {
      const { selectedSections } = req.body;
      const doc = new PDFDocument();
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.type("application/pdf");
        res.send(pdfBuffer);
      });
      const { personalInfo, options } = req.body;
      doc.fontSize(24).text(personalInfo.name, { align: "center" });
      doc.fontSize(16).text(personalInfo.title, { align: "center" });
      doc.moveDown();
      if (selectedSections.personalInfo) {
        doc.fontSize(14).text("Contact Information", { underline: true });
        doc.fontSize(12).text(`Email: ${personalInfo.email}`);
        doc.text(`Phone: ${personalInfo.phone}`);
        doc.text(`Location: ${personalInfo.location}`);
        doc.moveDown();
        doc.fontSize(14).text("Professional Summary", { underline: true });
        doc.fontSize(12).text(personalInfo.summary);
        doc.moveDown();
      }
      if (selectedSections.experience) {
        doc.fontSize(14).text("Work Experience", { underline: true });
        personalInfo.experience.forEach((exp) => {
          doc.fontSize(12).text(exp.title, { bold: true });
          doc.text(`${exp.company} | ${exp.period}`);
          doc.moveDown(0.5);
        });
        doc.moveDown();
      }
      if (selectedSections.education) {
        doc.fontSize(14).text("Education", { underline: true });
        personalInfo.education.forEach((edu) => {
          doc.fontSize(12).text(edu.degree, { bold: true });
          doc.text(`${edu.institution} | ${edu.year}`);
          doc.moveDown(0.5);
        });
        doc.moveDown();
      }
      if (selectedSections.skills) {
        doc.fontSize(14).text("Skills", { underline: true });
        doc.fontSize(12).text(personalInfo.skills.join(", "));
        doc.moveDown();
      }
      if (selectedSections.includeCoverLetter && personalInfo.coverLetter) {
        doc.addPage();
        doc.fontSize(14).text("Cover Letter", { underline: true });
        doc.fontSize(12).text(personalInfo.coverLetter);
        doc.moveDown();
      }
      doc.end();
    } catch (error) {
      console.error("Error generating resume:", error);
      res.status(500).json({
        success: false,
        message: "Error generating resume"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
