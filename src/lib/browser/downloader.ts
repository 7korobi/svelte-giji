export function readyDownload(
  el: HTMLImageElement | HTMLIFrameElement,
  url: string,
  timeout = 20000
): Promise<Event> {
  return new Promise((ok, ng) => {
    const timer = setTimeout(fail, timeout)
    el.addEventListener('--abort', fail)
    el.addEventListener('error', fail)
    el.addEventListener('load', success)
    el.src = url

    function bye() {
      clearTimeout(timer)
      el.removeEventListener('--abort', fail)
      el.removeEventListener('error', fail)
      el.removeEventListener('load', success)
    }

    function fail(e: Event = new Event(`timeout ${timeout / 1000}sec`)) {
      el.src = ''
      bye()
      ng(e)
    }

    function success(e: Event) {
      bye()
      ok(e)
    }
  })
}
