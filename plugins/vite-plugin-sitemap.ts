import { createClient } from "@supabase/supabase-js";
import type { Plugin } from "vite";
import { writeFileSync } from "fs";
import path from "path";

const SITE_URL = "https://happy-bits-bloom.lovable.app";

const STATIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/pilots", changefreq: "daily", priority: "0.9" },
  { path: "/register", changefreq: "monthly", priority: "0.7" },
  { path: "/login", changefreq: "monthly", priority: "0.5" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

function escapeXml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toW3CDate(dateStr?: string) {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  return new Date(dateStr).toISOString().split("T")[0];
}

export function sitemapPlugin(): Plugin {
  return {
    name: "generate-sitemap",
    apply: "build",
    async closeBundle() {
      try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

        let pilotEntries = "";

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data: pilots } = await supabase
            .from("pilots")
            .select("id, created_at")
            .order("created_at", { ascending: false });

          if (pilots) {
            for (const p of pilots) {
              pilotEntries += `
  <url>
    <loc>${SITE_URL}/pilot/${p.id}</loc>
    <lastmod>${toW3CDate(p.created_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
            }
          }
          console.log(`[sitemap] Added ${pilots?.length ?? 0} pilot pages`);
        } else {
          console.warn("[sitemap] Supabase env vars missing — generating static-only sitemap");
        }

        const today = new Date().toISOString().split("T")[0];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_ROUTES.map(
  (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
).join("\n")}${pilotEntries}
</urlset>
`;
        const outPath = path.resolve("dist", "sitemap.xml");
        writeFileSync(outPath, xml, "utf-8");
        console.log(`[sitemap] Written to ${outPath}`);
      } catch (err) {
        console.error("[sitemap] Failed to generate:", err);
      }
    },
  };
}
