<script lang="ts">
  import PageHeader from '../components/PageHeader.svelte'
  import Footer from '../components/Footer.svelte'
  import edtechathonLogo from '../assets/logo.svg'
  import participants from '../assets/2026participants.jpg'
</script>

<main class="page">
  <PageHeader />

  <div class="page-body">
    <h2 class="page-title">About</h2>
    <p class="page-subtitle">
      A classroom-friendly library game that teaches the Dewey Decimal system.
    </p>

    <section class="card">
      <div class="card-heading">
        <img class="card-logo" src={edtechathonLogo} alt="" />
        <h3>Created by Mason Van Horn</h3>
      </div>
      <p>
        Dewey Dash is a project hosted by the
        <a href="https://edtechathon.com" target="_blank" rel="noopener noreferrer">EdTech-a-thon</a>,
        a community of builders making free tools for classrooms. Learn more about who we are and
        what else we're building at
        <a href="https://edtechathon.com" target="_blank" rel="noopener noreferrer">edtechathon.com</a>.
      </p>

      <figure class="polaroid">
        <img src={participants} alt="Participants of the 2026 EdTech-a-thon" />
        <figcaption>EdTech-a-thon 2026</figcaption>
      </figure>
    </section>

    <section class="card">
      <h3>Our promise</h3>
      <ul class="promise-list">
        <li><strong>Zero paywalls.</strong></li>
        <li><strong>Zero ads.</strong></li>
        <li><strong>Zero tracking of personal data.</strong></li>
      </ul>
    </section>

    <section class="card">
      <h3>Feedback &amp; ideas</h3>
      <p>
        We'd love to hear from you. Tell us what's working, what's not, or pitch us an idea for a
        tool you wish existed. We're here to help.
      </p>
      <a class="email-button" href="mailto:support@deweydash.net?subject=dewey%20dash%20feedback">
        Email support@deweydash.net
      </a>
    </section>

    <section class="card">
      <h3>Who built this</h3>
      <p>Programmers: Mason Van Horn and Duncan Johnson.</p>
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
    margin-bottom: 18px;
    padding: 20px 22px;
    background: #fff9ea;
    border: 3px solid #e0ae50;
    border-radius: 18px 6px 18px 6px;
    box-shadow: 0 5px 0 #d1b47f;
  }
  .card h3 {
    margin: 0 0 10px;
    color: #31566c;
    font-family: 'Baloo 2', sans-serif;
    font-size: 22px;
  }
  .card p {
    margin: 0 0 12px;
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
  .card-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }
  .card-heading h3 {
    margin: 0;
  }
  .card-logo {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
  }
  .polaroid {
    width: min(520px, 100%);
    margin: 22px auto 0;
    padding: 12px 12px 20px;
    background: #fff;
    border: 1px solid #e0d6c0;
    border-radius: 3px;
    box-shadow: 0 10px 20px #4a3c2b33;
    transform: rotate(-1deg);
  }
  .polaroid img {
    display: block;
    width: 100%;
    background: #f1ece2;
  }
  .polaroid figcaption {
    padding-top: 16px;
    color: #4c5a62;
    text-align: center;
    font-family: 'Segoe Script', 'Bradley Hand', 'Snell Roundhand', 'Comic Sans MS', cursive;
    font-size: 19px;
  }
  .promise-list {
    margin: 0;
    padding-left: 22px;
    color: #4c5a62;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.8;
  }
  .email-button {
    display: inline-block;
    padding: 11px 18px;
    color: #fff !important;
    background: #d45f47;
    border: 3px solid #f3b577;
    border-radius: 12px;
    box-shadow: 0 4px #783828;
    font-size: 15px;
    font-weight: 900;
    text-decoration: none;
  }
  .email-button:hover {
    background: #c1523c;
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
