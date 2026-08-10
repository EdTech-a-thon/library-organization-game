// A tiny client-side router. The game lives at "/", with a couple of
// informational pages alongside it. No routing library needed.

const NAV_EVENT = 'deweydash:navigate'

function currentPath(): string {
  return window.location.pathname || '/'
}

export const router = $state({ path: currentPath() })

function syncPath() {
  router.path = currentPath()
}

window.addEventListener('popstate', syncPath)
window.addEventListener(NAV_EVENT, syncPath)

export function navigate(to: string): void {
  if (currentPath() === to) return
  window.history.pushState(null, '', to)
  window.dispatchEvent(new Event(NAV_EVENT))
  window.scrollTo(0, 0)
}

/** Use on links so normal in-app clicks stay on the page, but
 *  ctrl/cmd-click still opens a new tab like people expect. */
export function handleLinkClick(event: MouseEvent, href: string): void {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  navigate(href)
}
