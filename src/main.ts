import { renderChapter } from "./chapter";
import { modalAdd } from "./modalAdd";
import "./style.css";
import type { IChapter } from "./types";
import { escapeHtml, formatTimestamp, truncateText } from "./utils";

let chapters: IChapter[] = [];

const main = document.querySelector<HTMLElement>("#main")!;

loadChapters();

function renderMain() {
  main.innerHTML = `
    <div class="main-h-ctn">
      <h2>Chapters</h2>
      <button id="add-button">Add chapter</button>
    </div>
    <ol id="chapters-list">
      ${renderChaptersList()}
    </ol>
  `;

  const chaptersList = document.querySelector<HTMLElement>("#chapters-list")!;

  chaptersList.addEventListener("click", (e) => {
    e.preventDefault();

    const chapterCard = (e.target as HTMLElement).closest(
      ".chapter-card"
    ) as HTMLElement;

    if (!chapterCard) return;

    const indexStr = chapterCard.dataset.index;
    if (!indexStr) return;

    const index = parseInt(indexStr);
    if (isNaN(index)) return;

    const selectedChapter = chapters[index];
    if (!selectedChapter) return;

    renderChapter(selectedChapter);
  });
}

const modal = modalAdd((chapter: IChapter) => {
  console.log("Submitted:", chapter);
  chapters.push(chapter);
  saveChapters();
  renderMain();
});

main.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  if (target.id === "add-button") {
    modal.open();
  }

  if (target.id === "back-btn") {
    renderMain();
    return;
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
  if (chapters.length === 0) {
    return '<p class="no-chapters">No chapters yet. Add the first chapter.</p>';
  }

  return chapters
    .map(
      (chapter, index) => `
      <li class="chapter-card" data-index="${index}">
        <h3>${escapeHtml(truncateText(chapter.title, 40))}</h3>
        <p class="chapter-author">By ${escapeHtml(
          truncateText(chapter.author, 20)
        )} <span class="timestamp">${formatTimestamp(chapter.timestamp)}</span>
        </p>
        <p class="chapter-content">${escapeHtml(
          truncateText(chapter.content, 30)
        )}</p>
      </li>
    `
    )
    .join("");
}

renderMain();
