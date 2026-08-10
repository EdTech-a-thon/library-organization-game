<script lang="ts">
  import PageHeader from '../components/PageHeader.svelte'
  import Footer from '../components/Footer.svelte'
</script>

<main class="page">
  <PageHeader />

  <div class="page-body">
    <h2 class="page-title">Privacy</h2>
    <p class="page-subtitle">What we collect, what we don't, and why.</p>

    <section class="card">
      <p>
        Dewey Dash does not collect personal information from visitors or students. We use
        Cloudflare Web Analytics to anonymously count the number of visits, which helps us
        understand how Dewey Dash is being used in classrooms. Cloudflare Web Analytics is
        cookieless, does not fingerprint visitors, and does not track users across other sites. See
        Cloudflare's
        <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
          privacy policy
        </a>
        for details. We do not share, sell, or otherwise transfer any visitor data to third parties.
      </p>
      <p>
        Your score, streak, and progress live only in the page while you play, and are gone as soon
        as you close or refresh the tab. Nothing about your game is saved or sent anywhere. The game
        also loads its lettering from Google Fonts, which means your browser requests those font
        files from Google.
      </p>
      <p>
        Questions or concerns? Email
        <a href="mailto:support@deweydash.net?subject=dewey%20dash%20privacy">
          support@deweydash.net
        </a>.
      </p>
    </section>
  </div>

  <Footer />
</main>

<style>
  .page {
    display: flex;
    flex-direction: column;
  }
  .page-body {
    flex: 1;
    width: min(760px, 100%);
    margin: 0 auto;
    padding: 26px 18px 34px;
  }
  .page-title {
    margin: 0 0 6px;
    color: #31566c;
    font-family: 'Baloo 2', sans-serif;
    font-size: 34px;
    line-height: 1;
  }
  .page-subtitle {
    margin: 0 0 22px;
    color: #66747b;
    font-size: 15px;
    font-weight: 800;
  }
  .card {
    padding: 20px 22px;
    background: #fff9ea;
    border: 3px solid #e0ae50;
    border-radius: 18px 6px 18px 6px;
    box-shadow: 0 5px 0 #d1b47f;
  }
  .card p {
    margin: 0 0 14px;
    color: #4c5a62;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.45;
  }
  .card p:last-child {
    margin-bottom: 0;
  }
  .card a {
    color: #a55242;
    font-weight: 900;
    text-underline-offset: 3px;
  }

  @media (max-width: 800px) {
    .page-body {
      padding: 18px 12px 26px;
    }
    .card {
      padding: 16px;
    }
  }
</style>
