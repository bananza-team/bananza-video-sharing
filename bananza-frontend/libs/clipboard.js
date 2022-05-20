export async function copyTextToClipboard(text) { // https://blog.logrocket.com/implementing-copy-clipboard-react-clipboard-api/
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}
