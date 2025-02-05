// decide how to store data based on environment
// for now just localStorage, but we could detect electron and use electron-store

export function getData() {
  const raw = localStorage.getItem("wordSleuthProgress");
  return raw ? JSON.parse(raw) : { worlds: {} };
}

export function setData(data) {
  localStorage.setItem("wordSleuthProgress", JSON.stringify(data));
}
