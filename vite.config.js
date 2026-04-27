import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const COMMAND_FILE = path.resolve(".ai-command.json");
const RESULT_FILE  = path.resolve(".ai-result.json");

function aiBridgePlugin() {
  return {
    name: "ai-bridge",
    configureServer(server) {
      // POST /api/ai-command  — 스토리북이 명령을 저장
      server.middlewares.use("/api/ai-command", (req, res) => {
        if (req.method === "POST") {
          let body = "";
          req.on("data", d => body += d);
          req.on("end", () => {
            fs.writeFileSync(COMMAND_FILE, body, "utf-8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true }));
          });
        } else {
          // GET — 현재 명령 읽기 (Claude Code가 polling)
          const data = fs.existsSync(COMMAND_FILE) ? fs.readFileSync(COMMAND_FILE, "utf-8") : "{}";
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(data);
        }
      });

      // POST /api/ai-result — Claude Code가 결과를 저장
      server.middlewares.use("/api/ai-result", (req, res) => {
        if (req.method === "POST") {
          let body = "";
          req.on("data", d => body += d);
          req.on("end", () => {
            fs.writeFileSync(RESULT_FILE, body, "utf-8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true }));
          });
        } else {
          // GET — 스토리북이 결과를 polling
          const data = fs.existsSync(RESULT_FILE) ? fs.readFileSync(RESULT_FILE, "utf-8") : "null";
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(data);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), aiBridgePlugin()],
});
