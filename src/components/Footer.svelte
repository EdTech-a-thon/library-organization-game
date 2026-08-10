<script lang="ts">
  import edtechathonLogo from '../assets/logo.svg'
  import { handleLinkClick } from '../lib/router.svelte'
</script>

<footer class="site-footer">
  <a class="footer-link" href="https://edtechathon.com" target="_blank" rel="noopener noreferrer">
    <img src={edtechathonLogo} alt="" />
    Built by the EdTech-a-thon
  </a>
  <a class="footer-link" href="/about" onclick={(event) => handleLinkClick(event, '/about')}>about</a>
  <a class="footer-link" href="/privacy" onclick={(event) => handleLinkClick(event, '/privacy')}>privacy</a>
</footer>

<style>
  .site-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px 20px;
    padding: 16px;
    background: #fbf4e7;
    border-top: 3px solid #c6a16a;
  }
  .footer-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6b7d87;
    font-size: 14px;
    font-weight: 800;
    text-decoration: none;
  }
  .footer-link:hover {
    color: #a55242;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  .footer-link img {
    width: 24px;
    height: 24px;
  }
</style>
