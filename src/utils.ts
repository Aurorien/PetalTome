export function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export function formatTimestamp(timestamp: number | string): string {
  const date =
    typeof timestamp === "number" ? new Date(timestamp) : new Date(timestamp);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}
