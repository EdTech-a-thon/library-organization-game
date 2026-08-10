<script lang="ts">
  import { onMount } from 'svelte'
  import { bookQuests, obstacles, sections, shelfRange, shelfRanges, shelfTopic, type BookQuest, type DeweySection } from './lib/gameData'
  import Footer from './components/Footer.svelte'

  type GameState = 'needQuest' | 'classifying' | 'searching' | 'shelving' | 'carrying' | 'correct' | 'incorrect'

  let player = $state({ x: 48.5, y: 88 })
  let gameState = $state<GameState>('needQuest')
  let quest = $state<BookQuest | null>(null)
  let carriedSection = $state<DeweySection | null>(null)
  let selectedShelfSection = $state<DeweySection | null>(null)
  let score = $state(0)
  let highScore = $state(0)
  let checkoutStreak = $state(0)
  let pendingStreakBonus = $state(0)
  let milestoneMessage = $state('')
  let message = $state('Walk to Ms. Maple at the desk to get your first mission!')
  let showHelp = $state(true)
  let onboardingStep = $state<'start' | 'instructions' | null>('start')
  let incorrectTopicId = $state<number | null>(null)
  let topicMistakes = $state(0)
  let incorrectShelfRange = $state<string | null>(null)
  let shelfMistakes = $state(0)
  let secondsRemaining = $state(60)
  let timerActive = $state(false)
  let showTimeUp = $state(false)
  let showVictory = $state(false)
  let musicEnabled = $state(true)
  let showAccessibility = $state(false)
  let accessiblePlay = $state(false)
  let spokenGuidance = $state(false)
  let noTimer = $state(false)
  let highContrast = $state(false)
  let largeText = $state(false)
  let showShelfSuccess = $state(false)
  let hasGoldenBook = $state(false)
  let hasLeftReadingRug = $state(false)
  let rugTime = $state(0)
  let rugSurpriseFound = $state(false)
  let rugMessageTime = $state(0)
  let showGoldenBookMessage = $state(false)
  let timeBookCollected = $state(false)
  let libraryFriend = $state({ x: 41, y: 25 })
  let friendStopTime = $state(2)
  let friendTargetIndex = $state(0)
  let firstBarrierEntering = $state(false)
  let libraryFriendTwo = $state({ x: 56, y: 57 })
  let friendTwoStopTime = $state(1)
  let friendTwoTargetIndex = $state(2)
  let secondBarrierEntering = $state(false)
  let firstBarrierEntered = $state(false)
  let secondBarrierEntered = $state(false)
  let topBarrier = $state({ x: 22, y: 21 })
  let topBarrierTargetIndex = $state(0)
  let bottomBarrier = $state({ x: 22, y: 75 })
  let bottomBarrierTargetIndex = $state(0)
  let leftColumnBarrier = $state({ x: 22, y: 7 })
  let leftColumnBarrierTargetIndex = $state(0)
  let rightColumnBarrier = $state({ x: 76, y: 7 })
  let rightColumnBarrierTargetIndex = $state(0)

  const playerSize = { width: 3, height: 5 }
  const friendSize = { width: 3, height: 5 }
  const librarian = { x: 50, y: 39 }
  const readingRug = { x: 38, y: 77, width: 24, height: 17 }
  const goldenBook = { x: 74, y: 75 }
  const timeBook = { x: 72, y: 67 }
  const doorEntrance = { x: 72, y: 9 }
  const pressedArrowKeys = new Set<string>()
  const movementSpeed = 24
  const milestoneCheers: Record<number, string> = {
    10: 'You are on the right chapter!',
    20: 'You know your library!',
    30: 'That is some shelf-control!',
    40: 'You are really booked and busy!',
    50: 'Halfway there - you are a real page-turner!',
    60: 'You have got this story under control!',
    70: 'Your library skills are novel!',
    80: 'You are checking out the competition!',
    90: 'You are one book away from a grand finale!',
    100: 'One hundred books? You are a library legend!',
  }
  const friendStops = [
    { x: 41, y: 25 },
    { x: 41, y: 41 },
    { x: 41, y: 57 },
  ]
  const friendTwoStops = [
    { x: 56, y: 25 },
    { x: 56, y: 41 },
    { x: 56, y: 57 },
  ]
  const topBarrierStops = [{ x: 22, y: 21 }, { x: 75, y: 21 }]
  const bottomBarrierStops = [{ x: 22, y: 75 }, { x: 75, y: 75 }]
  const leftColumnBarrierStops = [{ x: 22, y: 7 }, { x: 22, y: 61 }]
  const rightColumnBarrierStops = [{ x: 76, y: 7 }, { x: 76, y: 61 }]
  const entranceStops = [
    { x: 72, y: 25 },
    { x: 56, y: 25 },
    { x: 41, y: 25 },
  ]
  const libraryMelody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23]
  let audioContext: AudioContext | null = null
  let musicInterval: number | null = null
  let melodyStep = 0

  const nearLibrarian = $derived(
    Math.hypot(player.x + 1.5 - librarian.x, player.y + 2.5 - librarian.y) < 10,
  )
  const timerDisplay = $derived(
    `${Math.floor(secondsRemaining / 60)}:${String(secondsRemaining % 60).padStart(2, '0')}`,
  )
  const doorIsOpen = $derived(
    (firstBarrierEntered && libraryFriend.y < 14) ||
    (secondBarrierEntered && libraryFriendTwo.y < 14),
  )
  const barrierSpeed = 8
  const barrierPause = 2
  const nearbySection = $derived(
    sections.find((section) => {
      const closestX = Math.max(section.x, Math.min(player.x + 1.5, section.x + section.width))
      const closestY = Math.max(section.y, Math.min(player.y + 2.5, section.y + section.height))
      return Math.hypot(player.x + 1.5 - closestX, player.y + 2.5 - closestY) < 5
    }) ?? null,
  )

  function collides(x: number, y: number) {
    if (x < 1 || y < 2 || x + playerSize.width > 99 || y + playerSize.height > 98) return true
    const hitsObstacle = obstacles.some(
      (obstacle) =>
        x < obstacle.x + obstacle.width &&
        x + playerSize.width > obstacle.x &&
        y < obstacle.y + obstacle.height &&
        y + playerSize.height > obstacle.y,
    )
    const activeMovingBarriers = [
      ...(score >= 5 ? [libraryFriend] : []),
      ...(score >= 15 ? [libraryFriendTwo] : []),
      ...(score >= 25 ? [topBarrier] : []),
      ...(score >= 35 ? [bottomBarrier] : []),
      ...(score >= 45 ? [leftColumnBarrier] : []),
      ...(score >= 55 ? [rightColumnBarrier] : []),
    ]
    const hitsFriend = activeMovingBarriers.some(
      (friend) =>
        x < friend.x + friendSize.width &&
        x + playerSize.width > friend.x &&
        y < friend.y + friendSize.height &&
        y + playerSize.height > friend.y,
    )
    return hitsObstacle || hitsFriend
  }

  function moveFriend(
    friend: { x: number; y: number },
    stopTime: number,
    targetIndex: number,
    stops: { x: number; y: number }[],
    elapsedSeconds: number,
  ) {
    if (stopTime > 0) return { friend, stopTime: Math.max(0, stopTime - elapsedSeconds), targetIndex }

    const target = stops[(targetIndex + 1) % stops.length]
    const dx = target.x - friend.x
    const dy = target.y - friend.y
    const distance = Math.hypot(dx, dy)
    const step = barrierSpeed * elapsedSeconds

    if (distance <= step) {
      return { friend: { ...target }, stopTime: barrierPause, targetIndex: (targetIndex + 1) % stops.length }
    }
    return { friend: { x: friend.x + (dx / distance) * step, y: friend.y + (dy / distance) * step }, stopTime, targetIndex }
  }

  function moveEnteringFriend(
    friend: { x: number; y: number },
    targetIndex: number,
    targetStop: { x: number; y: number },
    elapsedSeconds: number,
  ) {
    const target = targetIndex < 2 ? entranceStops[targetIndex] : targetStop
    const dx = target.x - friend.x
    const dy = target.y - friend.y
    const distance = Math.hypot(dx, dy)
    const step = barrierSpeed * elapsedSeconds

    if (distance <= step) {
      return { friend: { ...target }, targetIndex: targetIndex + 1, arrived: targetIndex >= 2 }
    }
    return { friend: { x: friend.x + (dx / distance) * step, y: friend.y + (dy / distance) * step }, targetIndex, arrived: false }
  }

  function movePatrol(
    barrier: { x: number; y: number },
    targetIndex: number,
    stops: { x: number; y: number }[],
    elapsedSeconds: number,
  ) {
    const target = stops[(targetIndex + 1) % stops.length]
    const dx = target.x - barrier.x
    const dy = target.y - barrier.y
    const distance = Math.hypot(dx, dy)
    const step = barrierSpeed * elapsedSeconds

    if (distance <= step) return { barrier: { ...target }, targetIndex: (targetIndex + 1) % stops.length }
    return { barrier: { x: barrier.x + (dx / distance) * step, y: barrier.y + (dy / distance) * step }, targetIndex }
  }

  function updateLibraryFriends(elapsedSeconds: number) {
    if (score >= 5) {
      if (!firstBarrierEntered) {
        libraryFriend = { ...doorEntrance }
        friendStopTime = 0
        friendTargetIndex = 0
        firstBarrierEntered = true
        firstBarrierEntering = true
      }
      if (firstBarrierEntering) {
        const first = moveEnteringFriend(libraryFriend, friendTargetIndex, friendStops[0], elapsedSeconds)
        libraryFriend = first.friend
        friendTargetIndex = first.targetIndex
        if (first.arrived) {
          firstBarrierEntering = false
          friendStopTime = 2
          friendTargetIndex = 0
        }
      } else {
        const first = moveFriend(libraryFriend, friendStopTime, friendTargetIndex, friendStops, elapsedSeconds)
        libraryFriend = first.friend
        friendStopTime = first.stopTime
        friendTargetIndex = first.targetIndex
      }
    }

    if (score >= 15) {
      if (!secondBarrierEntered) {
        libraryFriendTwo = { ...doorEntrance }
        friendTwoStopTime = 0
        friendTwoTargetIndex = 0
        secondBarrierEntered = true
        secondBarrierEntering = true
      }
      if (secondBarrierEntering) {
        const second = moveEnteringFriend(libraryFriendTwo, friendTwoTargetIndex, friendTwoStops[0], elapsedSeconds)
        libraryFriendTwo = second.friend
        friendTwoTargetIndex = second.targetIndex
        if (second.arrived) {
          secondBarrierEntering = false
          friendTwoStopTime = 2
          friendTwoTargetIndex = 0
        }
      } else {
        const second = moveFriend(libraryFriendTwo, friendTwoStopTime, friendTwoTargetIndex, friendTwoStops, elapsedSeconds)
        libraryFriendTwo = second.friend
        friendTwoStopTime = second.stopTime
        friendTwoTargetIndex = second.targetIndex
      }
    }

    if (score >= 25) {
      const top = movePatrol(topBarrier, topBarrierTargetIndex, topBarrierStops, elapsedSeconds)
      topBarrier = top.barrier
      topBarrierTargetIndex = top.targetIndex
    }

    if (score >= 35) {
      const bottom = movePatrol(bottomBarrier, bottomBarrierTargetIndex, bottomBarrierStops, elapsedSeconds)
      bottomBarrier = bottom.barrier
      bottomBarrierTargetIndex = bottom.targetIndex
    }

    if (score >= 45) {
      const leftColumn = movePatrol(leftColumnBarrier, leftColumnBarrierTargetIndex, leftColumnBarrierStops, elapsedSeconds)
      leftColumnBarrier = leftColumn.barrier
      leftColumnBarrierTargetIndex = leftColumn.targetIndex
    }

    if (score >= 55) {
      const rightColumn = movePatrol(rightColumnBarrier, rightColumnBarrierTargetIndex, rightColumnBarrierStops, elapsedSeconds)
      rightColumnBarrier = rightColumn.barrier
      rightColumnBarrierTargetIndex = rightColumn.targetIndex
    }
  }

  function move(dx: number, dy: number, distance = 1.35) {
    const nextX = player.x + dx * distance
    const nextY = player.y + dy * distance
    if (!collides(nextX, player.y)) player.x = nextX
    if (!collides(player.x, nextY)) player.y = nextY
  }

  function isOnReadingRug() {
    return player.x + playerSize.width > readingRug.x && player.x < readingRug.x + readingRug.width && player.y + playerSize.height > readingRug.y && player.y < readingRug.y + readingRug.height
  }

  function isNearGoldenBook() {
    return Math.hypot(player.x + 1.5 - (goldenBook.x + 1.5), player.y + 2.5 - (goldenBook.y + 2)) < 5
  }

  function isNearTimeBook() {
    return Math.hypot(player.x + 1.5 - (timeBook.x + 1.5), player.y + 2.5 - (timeBook.y + 2)) < 5
  }

  function handleKeydown(event: KeyboardEvent) {
    if (showHelp || showTimeUp || showGoldenBookMessage || gameState === 'classifying' || gameState === 'shelving') return
    if (event.key.startsWith('Arrow')) {
      event.preventDefault()
      pressedArrowKeys.add(event.key)
    }
    if ((event.key === ' ' || event.key === 'Enter') && (nearLibrarian || nearbySection || isNearGoldenBook() || isNearTimeBook())) {
      event.preventDefault()
      doAction()
    }
  }

  function handleKeyup(event: KeyboardEvent) {
    if (event.key.startsWith('Arrow')) {
      event.preventDefault()
      pressedArrowKeys.delete(event.key)
    }
  }

  function startButtonMove(event: PointerEvent, key: string) {
    if (showHelp || showTimeUp || showGoldenBookMessage || gameState === 'classifying' || gameState === 'shelving') return
    event.currentTarget instanceof HTMLElement && event.currentTarget.setPointerCapture(event.pointerId)
    pressedArrowKeys.add(key)
    startMusic()
  }

  function stopButtonMove(key: string) {
    pressedArrowKeys.delete(key)
  }

  function playMusicNote() {
    if (!audioContext || audioContext.state !== 'running') return
    const oscillator = audioContext.createOscillator()
    const volume = audioContext.createGain()
    const now = audioContext.currentTime
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(libraryMelody[melodyStep], now)
    volume.gain.setValueAtTime(0.0001, now)
    volume.gain.exponentialRampToValueAtTime(0.045, now + 0.02)
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.32)
    oscillator.connect(volume)
    volume.connect(audioContext.destination)
    oscillator.start(now)
    oscillator.stop(now + 0.34)
    melodyStep = (melodyStep + 1) % libraryMelody.length
  }

  function playTimerTick() {
    if (!audioContext || audioContext.state !== 'running') return
    const oscillator = audioContext.createOscillator()
    const volume = audioContext.createGain()
    const now = audioContext.currentTime
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(880, now)
    volume.gain.setValueAtTime(0.0001, now)
    volume.gain.exponentialRampToValueAtTime(0.025, now + 0.005)
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)
    oscillator.connect(volume)
    volume.connect(audioContext.destination)
    oscillator.start(now)
    oscillator.stop(now + 0.07)
  }

  function startMusic() {
    audioContext ??= new AudioContext()
    audioContext.resume()
    if (!musicEnabled || musicInterval !== null) return
    audioContext.resume().then(() => {
      playMusicNote()
      musicInterval = window.setInterval(playMusicNote, 430)
    })
  }

  function speak(text: string) {
    if (!spokenGuidance || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
  }

  function announce(text: string) {
    message = text
    speak(text)
  }

  function toggleMusic() {
    musicEnabled = !musicEnabled
    if (musicEnabled) {
      startMusic()
    } else if (musicInterval !== null) {
      window.clearInterval(musicInterval)
      musicInterval = null
    }
  }

  onMount(() => {
    let animationFrame: number
    let previousTime = performance.now()
    const timer = window.setInterval(() => {
      if (!timerActive || noTimer) return
      if (secondsRemaining > 1) {
        secondsRemaining -= 1
        playTimerTick()
      } else {
        secondsRemaining = 0
        timerActive = false
        playTimerTick()
        showTimeUp = true
      }
    }, 1000)

    function updateMovement(time: number) {
      const elapsedSeconds = Math.min((time - previousTime) / 1000, 0.05)
      previousTime = time

      const dx = Number(pressedArrowKeys.has('ArrowRight')) - Number(pressedArrowKeys.has('ArrowLeft'))
      const dy = Number(pressedArrowKeys.has('ArrowDown')) - Number(pressedArrowKeys.has('ArrowUp'))
      if ((dx || dy) && !showHelp && gameState !== 'classifying' && gameState !== 'shelving') {
        const length = Math.hypot(dx, dy)
        move(dx / length, dy / length, movementSpeed * elapsedSeconds)
      }
      if (!showHelp && !showTimeUp) updateLibraryFriends(elapsedSeconds)
      if (!showHelp && !showTimeUp) {
        if (!isOnReadingRug()) {
          hasLeftReadingRug = true
          if (!rugSurpriseFound) rugTime = 0
        } else if (hasLeftReadingRug && !rugSurpriseFound) {
          rugTime += elapsedSeconds
          if (rugTime >= 10) {
            rugSurpriseFound = true
            rugMessageTime = 20
          }
        }
        if (rugMessageTime > 0) rugMessageTime = Math.max(0, rugMessageTime - elapsedSeconds)
      }

      animationFrame = requestAnimationFrame(updateMovement)
    }

    animationFrame = requestAnimationFrame(updateMovement)
    return () => {
      cancelAnimationFrame(animationFrame)
      window.clearInterval(timer)
      if (musicInterval !== null) window.clearInterval(musicInterval)
      audioContext?.close()
    }
  })

  function startQuest() {
    startMusic()
    if (score >= 100) return
    let next = bookQuests[Math.floor(Math.random() * bookQuests.length)]
    while (next === quest) next = bookQuests[Math.floor(Math.random() * bookQuests.length)]
    quest = next
    carriedSection = null
    selectedShelfSection = null
    incorrectTopicId = null
    topicMistakes = 0
    incorrectShelfRange = null
    shelfMistakes = 0
    pressedArrowKeys.clear()
    const baseTime = Math.max(20, 60 - Math.floor(score / 10) * 5)
    secondsRemaining = baseTime + pendingStreakBonus
    pendingStreakBonus = 0
    timerActive = false
    timeBookCollected = false
    gameState = 'classifying'
    announce(`Which topic should “${next.title}” fit under?`)
  }

  function chooseTopic(section: DeweySection) {
    if (!quest || gameState !== 'classifying') return
    startMusic()
    if (section.id !== quest.sectionId) {
      incorrectTopicId = section.id
      topicMistakes += 1
      checkoutStreak = 0
      return
    }

    const answer = sections[quest.sectionId]
    incorrectTopicId = null
    topicMistakes = 0
    gameState = 'searching'
    timerActive = true
      announce(`Find the ${answer.range} stack, then look for call number ${quest.callNumber}.`)
  }

  function pickUpBook() {
    if (!nearbySection || gameState !== 'searching') return
    selectedShelfSection = nearbySection
    gameState = 'shelving'
    incorrectShelfRange = null
    shelfMistakes = 0
  }

  function chooseShelfGroup(range: string) {
    if (!quest || !selectedShelfSection || gameState !== 'shelving') return
    startMusic()
    if (selectedShelfSection.id !== quest.sectionId || range !== shelfRange(quest.callNumber)) {
      incorrectShelfRange = range
      shelfMistakes += 1
      return
    }
    carriedSection = selectedShelfSection
    selectedShelfSection = null
    gameState = 'carrying'
    showShelfSuccess = true
    announce(`That's it! You found “${quest.title}” in the ${range} shelf. Bring it back to Ms. Maple.`)
  }

  function leaveShelf() {
    selectedShelfSection = null
    incorrectShelfRange = null
    shelfMistakes = 0
    gameState = 'searching'
    message = quest
      ? `Find the ${sections[quest.sectionId].range} stack, then look for call number ${quest.callNumber}.`
      : ''
  }

  function inspectMissionShelf() {
    if (!quest || gameState !== 'searching') return
    selectedShelfSection = sections[quest.sectionId]
    gameState = 'shelving'
    incorrectShelfRange = null
    shelfMistakes = 0
    speak(`You are inspecting the ${selectedShelfSection.range} shelves.`)
  }

  function checkBook() {
    if (!carriedSection || !quest) return
    if (carriedSection.id === quest.sectionId) {
      score += 1
      checkoutStreak += 1
      highScore = Math.max(highScore, score)
      secondsRemaining = 60
      timerActive = false
      gameState = 'correct'
      if (checkoutStreak === 3) {
        pendingStreakBonus = 10
        checkoutStreak = 0
        announce(`Three-book streak! You earned 10 bonus seconds for your next search.`)
      } else {
        announce(`Yes! “${quest.title}” belongs in ${sections[quest.sectionId].shortName}, the ${carriedSection.range} stack. Wonderful work!`)
      }
      if (score === 5) milestoneMessage = 'Library Level Up: a student has entered the library!'
      if (score === 15) milestoneMessage = 'Library Level Up: another student has entered the library!'
      if (score === 25) milestoneMessage = 'Library Level Up: a student is now patrolling the top aisle!'
      if (score === 35) milestoneMessage = 'Library Level Up: a student is now crossing the bottom aisle!'
      if (score === 45) milestoneMessage = 'Library Level Up: a student is now moving along the 000 to 600 aisle!'
      if (score === 55) milestoneMessage = 'Library Level Up: another student is now moving along the 300 to 700 aisle!'
      if (score === 100) showVictory = true
    } else {
      const answer = sections[quest.sectionId]
      gameState = 'incorrect'
      announce(`Not quite. “${quest.title}” belongs in ${answer.shortName}. Check the quick guide and try again!`)
      carriedSection = null
      checkoutStreak = 0
    }
  }

  function doAction() {
    if (!hasGoldenBook && isNearGoldenBook()) {
      hasGoldenBook = true
      showGoldenBookMessage = true
      return
    }
    if (!timeBookCollected && timerActive && secondsRemaining <= 30 && isNearTimeBook()) {
      secondsRemaining += 10
      timeBookCollected = true
      return
    }
    if (nearLibrarian) {
      if (gameState === 'needQuest' || gameState === 'correct') startQuest()
      else if (gameState === 'carrying') checkBook()
      else if (gameState === 'incorrect') {
        gameState = 'searching'
        message = quest
          ? `Try again. Find the stack of books for ${sections[quest.sectionId].shortName}: ${sections[quest.sectionId].range}.`
          : ''
      } else {
        message = quest
          ? `Find the stack of books for ${sections[quest.sectionId].shortName}: ${sections[quest.sectionId].range}.`
          : ''
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
    selectedShelfSection = null
    incorrectTopicId = null
    topicMistakes = 0
    incorrectShelfRange = null
    shelfMistakes = 0
    score = 0
    checkoutStreak = 0
    pendingStreakBonus = 0
    milestoneMessage = ''
    secondsRemaining = 60
    timerActive = false
    hasGoldenBook = false
    hasLeftReadingRug = false
    rugTime = 0
    rugSurpriseFound = false
    rugMessageTime = 0
    showGoldenBookMessage = false
    showVictory = false
    showShelfSuccess = false
    timeBookCollected = false
    firstBarrierEntered = false
    firstBarrierEntering = false
    secondBarrierEntered = false
    secondBarrierEntering = false
    libraryFriend = { x: 41, y: 25 }
    friendStopTime = 2
    friendTargetIndex = 0
    libraryFriendTwo = { x: 56, y: 57 }
    friendTwoStopTime = 1
    friendTwoTargetIndex = 2
    topBarrier = { x: 22, y: 21 }
    topBarrierTargetIndex = 0
    bottomBarrier = { x: 22, y: 75 }
    bottomBarrierTargetIndex = 0
    leftColumnBarrier = { x: 22, y: 7 }
    leftColumnBarrierTargetIndex = 0
    rightColumnBarrier = { x: 76, y: 7 }
    rightColumnBarrierTargetIndex = 0
    pressedArrowKeys.clear()
    message = 'Walk to Ms. Maple at the desk to get your first mission!'
  }

  function restartAfterTimeUp() {
    showTimeUp = false
    resetGame()
    showHelp = true
    onboardingStep = 'start'
  }

  function playAgain() {
    showVictory = false
    resetGame()
    showHelp = true
    onboardingStep = 'start'
  }
</script>

<svelte:window
  onkeydown={handleKeydown}
  onkeyup={handleKeyup}
  onblur={() => pressedArrowKeys.clear()}
/>

<main>
  <header class="titlebar">
    <div class="brand">
      <img class="brand-logo" src="/favicon.svg" alt="" width="46" height="46" />
      <div><span>Maple Street Library</span><h1>Dewey Dash</h1></div>
    </div>
      <div class="header-actions">
      <div class="score"><span aria-hidden="true">⭐</span><strong>{score}</strong> books found</div>
        <div class="streak" aria-label={`${checkoutStreak} book checkout streak`}>🔥 <strong>{checkoutStreak}</strong> streak</div>
       <button class="music-button" class:muted={!musicEnabled} onclick={toggleMusic} aria-pressed={musicEnabled} aria-label={musicEnabled ? 'Turn music off' : 'Turn music on'}>{musicEnabled ? '♫ Music' : 'Music off'}</button>
       <button class="accessibility-button" onclick={() => (showAccessibility = true)}>Accessibility</button>
      <button class="round-button" onclick={() => { pressedArrowKeys.clear(); showHelp = true; onboardingStep = 'instructions' }} aria-label="How to play">?</button>
      <button class="reset-button" onclick={resetGame}>Start over</button>
    </div>
  </header>

  <section class="guide" aria-label="Dewey Decimal guide">
      <div class="guide-title"><span>QUICK<br />GUIDE</span><b>Find the hundred, then the shelf of ten!</b></div>
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
      <div class="book-mission"><small>FIND THIS BOOK</small><strong>{quest.title}</strong>{#if gameState !== 'classifying'}<span>{sections[quest.sectionId].shortName} · {sections[quest.sectionId].range}</span>{/if}</div>
    {/if}
    {#if carriedSection}
      <div class="inventory"><span aria-hidden="true">📕</span><small>CARRYING</small><b>{carriedSection.range}</b></div>
    {/if}
  </section>
  {#if milestoneMessage}<div class="milestone" role="status">{milestoneMessage}</div>{/if}

  <div class:high-contrast={highContrast} class:large-text={largeText} class="game-shell">
    <div class="library" role="application" aria-label="Top-down library game. Use arrow keys to move.">
      <div class="wall-top"><span>✦</span><b>THE LIBRARY MEDIA CENTER</b><span>✦</span></div>
      <div class="window window-one" aria-hidden="true"><span class="sun-ray"></span><span class="cloud cloud-one"></span></div>
      <div class:open={doorIsOpen} class="wooden-door" aria-hidden="true"><span class="door-window"></span><span class="door-knob"></span></div>

      {#each sections as section}
            <div class="bookshelf" class:nearby={nearbySection?.id === section.id} style:left={`${section.x}%`} style:top={`${section.y}%`} style:width={`${section.width}%`} style:height={`${section.height}%`} style:--section-color={section.color}>
              <div class="shelf-sign"><strong>{section.range}</strong></div>
              <span class="shelf-trinket" role="img" aria-label={section.trinketLabel}>{section.trinket}</span>
              <div class="shelf-ranges" aria-hidden="true">{#each shelfRanges(section.id) as range}<small>{range}</small>{/each}</div>
              <div class="book-spines" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </div>
      {/each}

      <div class="short-shelf s1"></div><div class="short-shelf s2"></div>
      <div class="short-shelf s3"></div><div class="short-shelf s4"></div>
      <div class="short-shelf s5"></div><div class="short-shelf s6"></div>
      <div class="reading-rug"><span>📖</span><small>STORY SPOT</small>{#if rugMessageTime > 0}<b aria-hidden="true">🐛</b>{/if}</div>
      {#if !hasGoldenBook}<button class="golden-book" style:left={`${goldenBook.x}%`} style:top={`${goldenBook.y}%`} onclick={doAction} aria-label="A hidden golden book">📒</button>{/if}
      {#if timerActive && secondsRemaining <= 30 && !timeBookCollected}<button class="time-book" style:left={`${timeBook.x}%`} style:top={`${timeBook.y}%`} onclick={doAction} aria-label="A sparkling book that adds time">📘</button>{/if}
      {#if rugMessageTime > 0}<div class="easter-egg-message" aria-live="polite">The Story Spot sparkles! A tiny bookworm says, “Every great reader starts with one page!”</div>{/if}
      <div class:running={timerActive} class="task-timer" aria-live="polite">
        <span class="stopwatch-button" aria-hidden="true"></span><small>BOOK TIMER</small><strong>{timerDisplay}</strong>
      </div>
      <div class="book-counter" aria-live="polite">
        <div class="counter-page"><small>BOOK<br />COUNTER</small><strong>{score}</strong></div>
        <div class="counter-page"><small>BEST</small><strong>{highScore}</strong></div>
      </div>
      {#if gameState === 'correct' && milestoneCheers[score]}
        <div class="success-banner" role="status" aria-live="assertive">
          <strong>BOOKS RETURNED: {score}</strong><span>{milestoneCheers[score]}</span>
        </div>
      {/if}
      <div class="desk" class:active={nearLibrarian}>
        <div class="librarian" role="img" aria-label="Mrs. Maple the librarian">
          <span class="maple-hair"></span><span class="maple-bun"></span>
          <span class="maple-face"><i></i><i></i><b></b></span>
          <span class="maple-glasses"></span><span class="maple-body"></span>
          <span class="maple-book"><i></i><i></i></span><span class="maple-hand hand-left"></span><span class="maple-hand hand-right"></span>
        </div>
        <div class="desk-top">CHECK OUT<br />COUNTER</div>
      </div>

      <div class="player" style:left={`${player.x}%`} style:top={`${player.y}%`} aria-label="Your character">
        {#if carriedSection}<span class="held-book" aria-hidden="true">📕</span>{/if}
        {#if hasGoldenBook}<span class="player-crown" aria-hidden="true">♛</span>{/if}
        <span class="player-hair"></span><span class="player-head"></span>
        <span class="player-neck"></span><span class="player-shirt"></span><span class="player-pants"></span><span class="player-shoes"></span>
      </div>
      {#if score >= 5}
        <div class:searching={friendStopTime > 0} class="library-friend" style:left={`${libraryFriend.x}%`} style:top={`${libraryFriend.y}%`} aria-label="A moving barrier">
          <span class="friend-hair"></span><span class="friend-head"></span><span class="friend-neck"></span>
          <span class="friend-shirt"></span><span class="friend-pants"></span><span class="friend-shoes"></span>
        </div>
      {/if}
      {#if score >= 15}
        <div class:searching={friendTwoStopTime > 0} class="library-friend library-friend-two" style:left={`${libraryFriendTwo.x}%`} style:top={`${libraryFriendTwo.y}%`} aria-label="A moving barrier">
          <span class="friend-hair"></span><span class="friend-head"></span><span class="friend-neck"></span>
          <span class="friend-shirt"></span><span class="friend-pants"></span><span class="friend-shoes"></span>
        </div>
      {/if}
      {#if score >= 25}
        <div class="library-friend library-friend-three" style:left={`${topBarrier.x}%`} style:top={`${topBarrier.y}%`} aria-label="A moving barrier">
          <span class="friend-hair"></span><span class="friend-head"></span><span class="friend-neck"></span>
          <span class="friend-shirt"></span><span class="friend-pants"></span><span class="friend-shoes"></span>
        </div>
      {/if}
      {#if score >= 35}
        <div class="library-friend library-friend-four" style:left={`${bottomBarrier.x}%`} style:top={`${bottomBarrier.y}%`} aria-label="A moving barrier">
          <span class="friend-hair"></span><span class="friend-head"></span><span class="friend-neck"></span>
          <span class="friend-shirt"></span><span class="friend-pants"></span><span class="friend-shoes"></span>
        </div>
      {/if}
      {#if score >= 45}
        <div class="library-friend library-friend-five" style:left={`${leftColumnBarrier.x}%`} style:top={`${leftColumnBarrier.y}%`} aria-label="A moving barrier">
          <span class="friend-hair"></span><span class="friend-head"></span><span class="friend-neck"></span>
          <span class="friend-shirt"></span><span class="friend-pants"></span><span class="friend-shoes"></span>
        </div>
      {/if}
      {#if score >= 55}
        <div class="library-friend library-friend-six" style:left={`${rightColumnBarrier.x}%`} style:top={`${rightColumnBarrier.y}%`} aria-label="A moving barrier">
          <span class="friend-hair"></span><span class="friend-head"></span><span class="friend-neck"></span>
          <span class="friend-shirt"></span><span class="friend-pants"></span><span class="friend-shoes"></span>
        </div>
      {/if}
      <div class="entrance">WELCOME <span>↟</span></div>
    </div>

    <div class="game-controls">
      <div class="dpad" aria-label="Movement controls">
        <button class="up" onpointerdown={(event) => startButtonMove(event, 'ArrowUp')} onpointerup={() => stopButtonMove('ArrowUp')} onpointercancel={() => stopButtonMove('ArrowUp')} onpointerleave={() => stopButtonMove('ArrowUp')} aria-label="Move up">▲</button>
        <button class="left" onpointerdown={(event) => startButtonMove(event, 'ArrowLeft')} onpointerup={() => stopButtonMove('ArrowLeft')} onpointercancel={() => stopButtonMove('ArrowLeft')} onpointerleave={() => stopButtonMove('ArrowLeft')} aria-label="Move left">◀</button>
        <span aria-hidden="true">✦</span>
        <button class="right" onpointerdown={(event) => startButtonMove(event, 'ArrowRight')} onpointerup={() => stopButtonMove('ArrowRight')} onpointercancel={() => stopButtonMove('ArrowRight')} onpointerleave={() => stopButtonMove('ArrowRight')} aria-label="Move right">▶</button>
        <button class="down" onpointerdown={(event) => startButtonMove(event, 'ArrowDown')} onpointerup={() => stopButtonMove('ArrowDown')} onpointercancel={() => stopButtonMove('ArrowDown')} onpointerleave={() => stopButtonMove('ArrowDown')} aria-label="Move down">▼</button>
      </div>
      <div class="control-hint"><b>MOVE</b><span>Arrow keys or buttons</span></div>
      {#if actionLabel()}
        <button class="action-button" onclick={doAction}><span>✋</span>{actionLabel()}<small>Space / Enter</small></button>
      {:else}
        <div class="action-prompt">Walk near Ms. Maple or a bookshelf</div>
      {/if}
      {#if accessiblePlay && quest && gameState === 'searching'}
        <button class="accessible-action" onclick={inspectMissionShelf}>Go to the {sections[quest.sectionId].range} shelves</button>
      {/if}
      {#if accessiblePlay && quest && gameState === 'carrying'}
        <button class="accessible-action" onclick={checkBook}>Return book to Ms. Maple</button>
      {/if}
    </div>
  </div>

  <Footer />
</main>

{#if showAccessibility}
  <div class="modal-backdrop" role="presentation">
    <dialog class="help-card accessibility-card" open aria-labelledby="accessibility-title">
      <button class="modal-close" onclick={() => (showAccessibility = false)} aria-label="Close accessibility settings">×</button>
      <p class="eyebrow">PLAY YOUR WAY</p>
      <h2 id="accessibility-title">Accessibility settings</h2>
      <label><input type="checkbox" bind:checked={accessiblePlay} /> Accessible Play: use direct buttons to reach the needed shelf and return books.</label>
      <label><input type="checkbox" bind:checked={spokenGuidance} /> Spoken guidance: read mission updates aloud.</label>
      <label><input type="checkbox" bind:checked={noTimer} /> No timer: remove countdown pressure.</label>
      <label><input type="checkbox" bind:checked={highContrast} /> High contrast colors.</label>
      <label><input type="checkbox" bind:checked={largeText} /> Larger interface text.</label>
      <button class="primary-button" onclick={() => (showAccessibility = false)}>Continue playing</button>
    </dialog>
  </div>
{/if}

{#if showHelp && onboardingStep === 'start'}
  <div class="modal-backdrop start-backdrop" role="presentation">
    <dialog class="start-card" open aria-labelledby="start-title">
      <img class="start-logo" src="/favicon.svg" alt="" width="78" height="78" />
      <p class="eyebrow">MR. MASON AND EDTECH-A-THON PRESENTS</p>
      <h2 id="start-title">Dewey Dash</h2>
      <p>Ready to become a library book detective?</p>
      <button class="primary-button" onclick={() => (onboardingStep = 'instructions')}>Start Adventure</button>
    </dialog>
  </div>
{/if}

{#if showHelp && onboardingStep === 'instructions'}
  <div class="modal-backdrop" role="presentation">
    <dialog class="help-card" open aria-labelledby="help-title">
      <button class="modal-close" onclick={() => { showHelp = false; onboardingStep = null }} aria-label="Close instructions">×</button>
      <span class="maple-welcome" aria-hidden="true">👩🏾‍🦱</span>
      <p class="eyebrow">WELCOME TO MAPLE STREET LIBRARY</p>
      <h2 id="help-title">Hi, I'm Ms. Maple!</h2>
      <p class="welcome-copy">I'll help you find every book. Here is how to explore the library:</p>
      <div class="key-guide" aria-label="Game controls">
        <div class="key-guide-row"><span>Move</span><div class="arrow-keys" aria-hidden="true"><kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd></div><small>Use the directional keys to walk.</small></div>
        <div class="key-guide-row"><span>Select</span><div class="action-keys" aria-hidden="true"><kbd>Space</kbd><kbd>Enter ↵</kbd></div><small>Use these near me or a bookshelf.</small></div>
      </div>
      <p class="welcome-note">You can also use the on-screen arrows and action button.</p>
      <button class="primary-button" onclick={() => { showHelp = false; onboardingStep = null }}>Let's find some books!</button>
    </dialog>
  </div>
{/if}

{#if showTimeUp}
  <div class="modal-backdrop" role="presentation">
    <dialog class="help-card time-up-card" open aria-labelledby="time-up-title">
      <span class="help-art" aria-hidden="true">⏰</span>
      <p class="eyebrow">TIME'S UP</p>
      <h2 id="time-up-title">Nice try, book detective!</h2>
      <p>You did a great job working through the library. Let's start a fresh mission and try again!</p>
      <button class="primary-button" onclick={restartAfterTimeUp}>Start a new game</button>
    </dialog>
  </div>
{/if}

{#if showVictory}
  <div class="modal-backdrop victory-backdrop" role="presentation">
    <div class="confetti" aria-hidden="true">
      {#each Array(36) as _, index}<i style:--piece={index}></i>{/each}
    </div>
    <dialog class="victory-card" open aria-labelledby="victory-title">
      <span class="victory-books" aria-hidden="true">📚</span>
      <p class="eyebrow">LIBRARY LEGEND</p>
      <h2 id="victory-title">You completed Dewey Dash!</h2>
      <p>You returned all 100 books and showed that you know your library.</p>
      <strong class="victory-score">100 BOOKS RETURNED</strong>
      <p class="programmer-credit">Programmers: Duncan Johnson and Mason Van Horn</p>
      <button class="primary-button" onclick={playAgain}>Play Again</button>
    </dialog>
  </div>
{/if}

{#if showGoldenBookMessage}
  <div class="modal-backdrop" role="presentation">
    <dialog class="golden-book-card" open aria-labelledby="golden-book-title">
      <span class="golden-book-art" aria-hidden="true">📖</span>
      <p class="eyebrow">SECRET LIBRARY BOOK</p>
      <h2 id="golden-book-title">Pursue TRUTH and you will find the WAY!</h2>
      <p>You found a special book. Wear its crown proudly as you continue your library adventure.</p>
      <button class="primary-button" onclick={() => (showGoldenBookMessage = false)}>Close book and keep playing</button>
    </dialog>
  </div>
{/if}

{#if quest && gameState === 'classifying' && !showHelp}
  <div class="modal-backdrop" role="presentation">
    <dialog class="topic-card" open aria-labelledby="topic-title" aria-describedby="topic-prompt topic-feedback">
      <span class="topic-art" aria-hidden="true">📕</span>
      <p class="eyebrow">MS. MAPLE'S NEW REQUEST</p>
      <h2 id="topic-title">{quest.title}</h2>
      <p id="topic-prompt">Which topic should this book fit under?</p>
      <div class="topic-grid">
        {#each sections as section}
          <button
            class="topic-button"
            class:incorrect={incorrectTopicId === section.id}
            class:hint={topicMistakes >= 3 && section.id === quest.sectionId}
            style:--section-color={section.color}
            onclick={() => chooseTopic(section)}
          >
            <span aria-hidden="true">{section.icon}</span>
            <strong>{section.shortName}</strong>
            <small>{section.range}</small>
          </button>
        {/each}
      </div>
      <p class="topic-feedback" id="topic-feedback" aria-live="polite">
        {#if incorrectTopicId !== null}
          Not quite. Think about what the book is about, then try another topic.
        {:else}
          Choose a topic to continue your mission.
        {/if}
      </p>
    </dialog>
  </div>
{/if}

{#if quest && selectedShelfSection && gameState === 'shelving' && !showHelp}
  <div class="modal-backdrop" role="presentation">
    <dialog class="topic-card shelf-card" open aria-labelledby="shelf-title" aria-describedby="shelf-prompt shelf-feedback">
      <span class="topic-art" aria-hidden="true">🔎</span>
      <p class="eyebrow">SHELF DETECTIVE</p>
      <h2 id="shelf-title">{selectedShelfSection.shortName} shelves</h2>
      <p id="shelf-prompt">You are checking <strong>{selectedShelfSection.range}</strong>. Which shelf of ten should you check for <strong>{quest.title}</strong>?</p>
      <div class="shelf-grid">
        {#each shelfRanges(selectedShelfSection.id) as range}
          <button
            class="shelf-button"
            class:incorrect={incorrectShelfRange === range}
            class:hint={shelfMistakes >= 3 && selectedShelfSection.id === quest.sectionId && range === shelfRange(quest.callNumber)}
            onclick={() => chooseShelfGroup(range)}
          >
            <strong>{range}</strong>{#if shelfTopic(Number(range.slice(0, 3)))}<small>{shelfTopic(Number(range.slice(0, 3)))}</small>{/if}
          </button>
        {/each}
      </div>
      <p class="topic-feedback" id="shelf-feedback" aria-live="polite">
        {#if incorrectShelfRange !== null}
          {incorrectShelfRange} does not contain this book. Check the Dewey range and try another shelf.
        {:else}
          Use the first two digits to find the correct group of ten.
        {/if}
      </p>
      {#if selectedShelfSection.id !== quest.sectionId}
        <button class="leave-shelf-button" onclick={leaveShelf}>Leave Shelf</button>
      {/if}
    </dialog>
  </div>
{/if}

{#if showShelfSuccess}
  <div class="modal-backdrop" role="presentation">
    <dialog class="help-card shelf-success-card" open aria-labelledby="shelf-success-title">
      <span class="success-check" aria-hidden="true">✓</span>
      <p class="eyebrow">BOOK FOUND</p>
      <h2 id="shelf-success-title">That's it!</h2>
      <p>You found the right shelf. Take the book back to Ms. Maple at the checkout counter.</p>
      <button class="primary-button" onclick={() => (showShelfSuccess = false)}>Return to Ms. Maple</button>
    </dialog>
  </div>
{/if}
