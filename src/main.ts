import { modalAdd } from "./modalAdd";
import "./style.css";
import type { IChapter } from "./types";

let chapters: IChapter[] = [];

const main = document.querySelector<HTMLElement>("#main")!;

function renderMain() {
  main.innerHTML = `
    <div class="post-h-ctn">
      <h2>Chapters</h2>
      <button id="add-button">Add chapter</button>
    </div>
    <ol id="chapters-list">
      ${renderChaptersList()}
    </ol>
  `;
}

const modal = modalAdd((chapter: IChapter) => {
  console.log("Submitted:", chapter);
  chapters.push(chapter);
  saveChapters();
  renderMain();
});

main.addEventListener("click", (e) => {
  if ((e.target as HTMLElement).id === "add-button") {
    modal.open();
  }
});

function saveChapters() {
  localStorage.setItem("chapters", JSON.stringify(chapters));
}

function loadChapters() {
  const saved = localStorage.getItem("chapters");
  if (saved) {
    chapters = JSON.parse(saved);
  }
}

function renderChaptersList(): string {
  loadChapters();
  if (chapters.length === 0) {
    return '<p class="no-chapters">No chapters yet. Add the first chapter.</p>';
  }

  return chapters
    .map(
      (chapter, index) => `
      <li class="chapter-card" data-index="${index}">
        <h3 class="chapter-title">${escapeHtml(chapter.title)}</h3>
        <p class="chapter-author">By ${escapeHtml(chapter.author)}</p>
        <p class="chapter-content">${escapeHtml(
          truncateText(chapter.content, 20)
        )}</p>
      </li>
    `
    )
    .join("");
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

renderMain();
