export function dispatchEventCompat(eventName) {
  let event;
  if (typeof Event === "function") {
    // Modern way
    event = new Event(eventName, { bubbles: true, cancelable: true });
  } else {
    // Older Safari / iOS fallback
    event = document.createEvent("Event");
    event.initEvent(eventName, true, true);
  }
  window.dispatchEvent(event);
}
