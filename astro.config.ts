// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { redirects } from "./src/redirects";

export default defineConfig({
  site: "https://sametbasbug.dev",
  // Eski site bu biçimde indekslendi; sözlük ve yasal sayfaların URL'leri
  // birebir korunsun diye aynı biçimde devam ediyoruz.
  trailingSlash: "always",
  redirects,
  integrations: [
    sitemap({
      // Yönlendirme sayfaları sitemap'e girmemeli.
      filter: (page) => !Object.keys(redirects).some((from) => page.endsWith(from.slice(1))),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { dark: "vesper", light: "github-light" },
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
