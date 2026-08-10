<script lang="ts">
  import { router } from './lib/router.svelte'
  import App from './App.svelte'
  import AboutPage from './pages/AboutPage.svelte'
  import PrivacyPage from './pages/PrivacyPage.svelte'
</script>

{#if router.path === '/about'}
  <AboutPage />
{:else if router.path === '/privacy'}
  <PrivacyPage />
{:else}
  <App />
{/if}
