import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        boka: resolve(__dirname, "boka-resa.html"),
        bokadresa: resolve(__dirname, "bokad-resa.html"),
        minabokaderesor: resolve(__dirname, "mina-bokade-resor.html"),
        faq: resolve(__dirname, "vanliga-fragor.html"),
        kontaktaoss: resolve(__dirname, "kontakta-oss.html"),
        minasidor: resolve(__dirname, "mina-sidor.html"),
        omboka: resolve(__dirname, "omboka-resa.html"),
        ombokadresa: resolve(__dirname, "ombokad-resa.html"),
        avbokadresa: resolve(__dirname, "avbokad-resa.html"),
        tillganglighetsredogorelse: resolve(__dirname, "tillganglighetsredogorelse.html"),
        synpunktertillganglighet: resolve(__dirname, "synpunkter-tillganglighet.html"),
        loggaut: resolve(__dirname, "loggaut.html")
      }
    }
  },
  css: {
    devSourcemap: true
  }
});