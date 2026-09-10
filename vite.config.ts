import { defineConfig, loadEnv, type Plugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Adds the Cloudflare Web Analytics beacon to built pages. CF_BEACON_TOKEN is
// set only on the production Vercel environment, so dev servers, local builds
// and preview deploys don't count visits.
function cloudflareAnalytics(token: string | undefined): Plugin {
  return {
    name: 'cloudflare-analytics',
    apply: 'build',
    transformIndexHtml() {
      if (!token) return []
      return [
        {
          tag: 'script',
          attrs: {
            defer: true,
            src: 'https://static.cloudflareinsights.com/beacon.min.js',
            'data-cf-beacon': JSON.stringify({ token }),
          },
          injectTo: 'body',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [svelte(), cloudflareAnalytics(loadEnv(mode, process.cwd(), '').CF_BEACON_TOKEN)],
  server: {
    host: '0.0.0.0',
    port: 8000,
    allowedHosts: ['.exe.xyz', '.edtechathon.com'],
  },
}))
