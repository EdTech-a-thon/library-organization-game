<script lang="ts">
  import { bookQuests, obstacles, sections, type BookQuest, type DeweySection } from './lib/gameData'

  type GameState = 'needQuest' | 'searching' | 'carrying' | 'correct' | 'incorrect'

  let player = $state({ x: 48.5, y: 88 })
  let gameState = $state<GameState>('needQuest')
  let quest = $state<BookQuest | null>(null)
  let carriedSection = $state<DeweySection | null>(null)
  let score = $state(0)
  let message = $state('Walk to Ms. Maple at the desk to get your first mission!')
  let showHelp = $state(true)

  const playerSize = { width: 3, height: 5 }
  const librarian = { x: 50, y: 39 }

  const nearLibrarian = $derived(
    Math.hypot(player.x + 1.5 - librarian.x, player.y + 2.5 - librarian.y) < 10,
  )
  const nearbySection = $derived(
    sections.find((section) => {
      const closestX = Math.max(section.x, Math.min(player.x + 1.5, section.x + section.width))
      const closestY = Math.max(section.y, Math.min(player.y + 2.5, section.y + section.height))
      return Math.hypot(player.x + 1.5 - closestX, player.y + 2.5 - closestY) < 5
    }) ?? null,
  )

  function collides(x: number, y: number) {
    if (x < 1 || y < 2 || x + playerSize.width > 99 || y + playerSize.height > 98) return true
    return obstacles.some(
      (obstacle) =>
        x < obstacle.x + obstacle.width &&
        x + playerSize.width > obstacle.x &&
        y < obstacle.y + obstacle.height &&
        y + playerSize.height > obstacle.y,
    )
  }

  function move(dx: number, dy: number) {
    const step = 1.35
    const nextX = player.x + dx * step
    const nextY = player.y + dy * step
    if (!collides(nextX, player.y)) player.x = nextX
    if (!collides(player.x, nextY)) player.y = nextY
  }

  function handleKeydown(event: KeyboardEvent) {
    const directions: Record<string, [number, number]> = {
      ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    }
    const direction = directions[event.key]
    if (direction) {
      event.preventDefault()
      move(...direction)
    }
    if ((event.key === ' ' || event.key === 'Enter') && (nearLibrarian || nearbySection)) {
      event.preventDefault()
      doAction()
    }
  }

  function startQuest() {
    let next = bookQuests[Math.floor(Math.random() * bookQuests.length)]
    while (next === quest) next = bookQuests[Math.floor(Math.random() * bookQuests.length)]
    quest = next
    carriedSection = null
    gameState = 'searching'
    message = `Please find “${next.title}.” It belongs in ${sections[next.sectionId].shortName}. Use the quick guide to choose the right stack!`
  }

  function pickUpBook() {
    if (!nearbySection || gameState !== 'searching') return
    carriedSection = nearbySection
    gameState = 'carrying'
    message = `You picked up “${quest?.title}” from the ${nearbySection.range} stack. Bring it back to Ms. Maple!`
  }

  function checkBook() {
    if (!carriedSection || !quest) return
    if (carriedSection.id === quest.sectionId) {
      score += 1
      gameState = 'correct'
      message = `Yes! “${quest.title}” belongs in ${sections[quest.sectionId].shortName}, the ${carriedSection.range} stack. Wonderful work!`
    } else {
      const answer = sections[quest.sectionId]
      gameState = 'incorrect'
      message = `Not quite. “${quest.title}” belongs in ${answer.shortName}. Check the quick guide and try again!`
      carriedSection = null
    }
  }

  function doAction() {
    if (nearLibrarian) {
      if (gameState === 'needQuest' || gameState === 'correct') startQuest()
      else if (gameState === 'carrying') checkBook()
      else if (gameState === 'incorrect') {
        gameState = 'searching'
        message = `Try again: “${quest?.title}” belongs in ${quest ? sections[quest.sectionId].shortName : ''}. Match that topic to a range in the quick guide!`
      } else {
        message = `Your mission is “${quest?.title}.” It belongs in ${quest ? sections[quest.sectionId].shortName : ''}. Use the quick guide to find its stack!`
      }
    } else if (nearbySection) pickUpBook()
  }

  function actionLabel() {
    if (nearLibrarian) {
      if (gameState === 'needQuest') return 'Talk to Ms. Maple'
      if (gameState === 'carrying') return 'Return Book'
      if (gameState === 'correct') return 'Get Next Mission'
      if (gameState === 'incorrect') return 'Try Again'
      return 'Hear Mission Again'
    }
    if (nearbySection && gameState === 'searching') return `Check ${nearbySection.range} Stack`
    return null
  }

  function resetGame() {
    player = { x: 48.5, y: 88 }
    gameState = 'needQuest'
    quest = null
    carriedSection = null
    score = 0
    message = 'Walk to Ms. Maple at the desk to get your first mission!'
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<main>
  <header class="titlebar">
    <div class="brand">
      <span class="brand-book" aria-hidden="true">📚</span>
      <div><span>Maple Street Library</span><h1>Dewey Dash</h1></div>
    </div>
    <div class="header-actions">
      <div class="score"><span aria-hidden="true">⭐</span><strong>{score}</strong> books found</div>
      <button class="round-button" onclick={() => (showHelp = true)} aria-label="How to play">?</button>
      <button class="reset-button" onclick={resetGame}>Start over</button>
    </div>
  </header>

  <section class="guide" aria-label="Dewey Decimal guide">
    <div class="guide-title"><span>QUICK<br />GUIDE</span><b>Match each topic<br />to its number range!</b></div>
    <div class="guide-scroll">
      {#each sections as section}
        <div class="guide-item" style:--section-color={section.color}>
          <span class="guide-icon" aria-hidden="true">{section.icon}</span>
          <span><strong>{section.range}</strong><small>{section.shortName}</small></span>
        </div>
      {/each}
    </div>
  </section>

  <section class="mission-bar" aria-live="polite">
    <div class="portrait" aria-hidden="true">👩🏾‍🦱</div>
    <div class="mission-copy"><strong>Ms. Maple says:</strong><span>{message}</span></div>
    {#if quest && gameState !== 'correct'}
      <div class="book-mission"><small>FIND THIS BOOK</small><strong>{quest.title}</strong><span>{sections[quest.sectionId].shortName}</span></div>
    {/if}
    {#if carriedSection}
      <div class="inventory"><span aria-hidden="true">📕</span><small>CARRYING</small><b>{carriedSection.range}</b></div>
    {/if}
  </section>

  <div class="game-shell">
    <div class="library" role="application" aria-label="Top-down library game. Use arrow keys to move.">
      <div class="wall-top"><span>✦</span><b>THE READING ROOM</b><span>✦</span></div>
      <div class="window window-one">☀️</div><div class="window window-two">☁️</div>

      {#each sections as section}
        <div class="bookshelf" class:nearby={nearbySection?.id === section.id} style:left={`${section.x}%`} style:top={`${section.y}%`} style:width={`${section.width}%`} style:height={`${section.height}%`} style:--section-color={section.color}>
          <div class="shelf-sign"><strong>{section.range}</strong></div>
          <div class="book-spines" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        </div>
      {/each}

      <div class="short-shelf s1"></div><div class="short-shelf s2"></div>
      <div class="short-shelf s3"></div><div class="short-shelf s4"></div>
      <div class="short-shelf s5"></div><div class="short-shelf s6"></div>
      <div class="reading-rug"><span>📖</span><small>STORY SPOT</small></div>
      <div class="table"><span>🌱</span></div>
      <div class="plant p1">🪴</div><div class="plant p2">🪴</div>

      <div class="desk" class:active={nearLibrarian}>
        <div class="librarian" aria-label="Ms. Maple the librarian"><span>👩🏾‍🦱</span></div>
        <div class="desk-top">CHECK OUT <span>📚</span></div>
      </div>

      <div class="player" style:left={`${player.x}%`} style:top={`${player.y}%`} aria-label="Your character">
        {#if carriedSection}<span class="held-book" aria-hidden="true">📕</span>{/if}
        <span class="player-head">🙂</span><span class="player-body">👕</span>
      </div>
      <div class="entrance">WELCOME <span>↟</span></div>
    </div>

    <div class="game-controls">
      <div class="dpad" aria-label="Movement controls">
        <button class="up" onpointerdown={() => move(0, -1)} aria-label="Move up">▲</button>
        <button class="left" onpointerdown={() => move(-1, 0)} aria-label="Move left">◀</button>
        <span aria-hidden="true">✦</span>
        <button class="right" onpointerdown={() => move(1, 0)} aria-label="Move right">▶</button>
        <button class="down" onpointerdown={() => move(0, 1)} aria-label="Move down">▼</button>
      </div>
      <div class="control-hint"><b>MOVE</b><span>Arrow keys or buttons</span></div>
      {#if actionLabel()}
        <button class="action-button" onclick={doAction}><span>✋</span>{actionLabel()}<small>Space / Enter</small></button>
      {:else}
        <div class="action-prompt">Walk near Ms. Maple or a bookshelf</div>
      {/if}
    </div>
  </div>
</main>

{#if showHelp}
  <div class="modal-backdrop" role="presentation">
    <dialog class="help-card" open aria-labelledby="help-title">
      <button class="modal-close" onclick={() => (showHelp = false)} aria-label="Close instructions">×</button>
      <span class="help-art" aria-hidden="true">🗺️</span>
      <p class="eyebrow">YOUR LIBRARY MISSION</p>
      <h2 id="help-title">How to Play Dewey Dash</h2>
      <ol>
        <li><span>1</span><div><b>Visit Ms. Maple</b><small>She will give you a book title and tell you its topic.</small></div></li>
        <li><span>2</span><div><b>Use the quick guide</b><small>Match the book’s topic to its Dewey Decimal number range.</small></div></li>
        <li><span>3</span><div><b>Find and return the book</b><small>Choose the stack with that number range, then bring the book back to Ms. Maple.</small></div></li>
      </ol>
      <button class="primary-button" onclick={() => (showHelp = false)}>Let's find some books!</button>
    </dialog>
  </div>
{/if}
