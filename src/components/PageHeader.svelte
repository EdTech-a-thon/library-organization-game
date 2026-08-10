<script lang="ts">
  import { handleLinkClick } from '../lib/router.svelte'
</script>

<header class="titlebar">
  <a class="brand brand-link" href="/" onclick={(event) => handleLinkClick(event, '/')}>
    <img class="brand-logo" src="/favicon.svg" alt="" width="46" height="46" />
    <div><span>Maple Street Library</span><h1>Dewey Dash</h1></div>
  </a>
  <div class="header-actions">
    <a class="back-link" href="/" onclick={(event) => handleLinkClick(event, '/')}>← Back to game</a>
  </div>
</header>

<style>
  .brand-link {
    color: inherit;
    text-decoration: none;
  }
  .back-link {
    padding: 8px 13px;
    color: #fff;
    background: transparent;
    border: 2px solid #9bb0bb;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 900;
    text-decoration: none;
  }
  .back-link:hover {
    background: #244558;
  }
</style>
