import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        boka: resolve(__dirname, "boka-resa.html"),
        bokadresa: resolve(__dirname, "bokad-resa.html"),
        minabokningar: resolve(__dirname, "mina-bokningar.html"),
        faq: resolve(__dirname, "vanliga-fragor.html"),
        kontakt: resolve(__dirname, "kontakta-oss.html"),
        minasidor: resolve(__dirname, "mina-sidor.html"),
        omboka: resolve(__dirname, "omboka-resa.html"),
        ombokadresa: resolve(__dirname, "ombokad-resa.html"),
        avboka: resolve(__dirname, "avboka-resa.html"),
        avbokadresa: resolve(__dirname, "avbokad-resa.html"),
        tillganglighetsredogorelse: resolve(__dirname, "tillganglighetsredogorelse.html"),
        synpunkter: resolve(__dirname, "synpunkter-tillgangliget.html"),
        logout: resolve(__dirname, "loggaut.html")
      }
    }
  },
  css: {
    devSourcemap: true
  }
});