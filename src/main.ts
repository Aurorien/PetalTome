import { renderChapter } from "./chapter";
import { modalAdd } from "./modalAdd";
import "./style.css";
import type { IChapter, SortBy } from "./types";
import { escapeHtml, formatTimestamp, truncateText } from "./utils";

let chapters: IChapter[] = [];
let sortBy: SortBy = "timestamp";

const main = document.querySelector<HTMLElement>("#main")!;

loadChapters();

function renderMain() {
  main.innerHTML = `
    <h2>Chapters</h2>
    <ol id="chapters-list">
      ${renderChaptersList()}
    </ol>
    <div class="main-actions">
      <button id="add-button" class="confirm-button">Add chapter</button>
      <div class="sort-controls">
        <label for="sort-select">Sort:</label>
        <select id="sort-select">
          <option value="timestamp" ${
            sortBy === "timestamp" ? "selected" : ""
          }>Newest First</option>
          <option value="author" ${
            sortBy === "author" ? "selected" : ""
          }>Author (A-Z)</option>
        </select>
      </div>
    </div>
  `;

  const chaptersList = document.querySelector<HTMLElement>("#chapters-list")!;
  const sortSelect = document.querySelector<HTMLSelectElement>("#sort-select")!;

  main.style.paddingBottom = "14rem";

  sortSelect.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    sortBy = target.value as SortBy;
    renderMain();
  });

  chaptersList.addEventListener("click", (e) => {
    e.preventDefault();

    const chapterCard = (e.target as HTMLElement).closest(
      ".chapter-card"
    ) as HTMLElement;

    if (!chapterCard) return;

    const indexStr = chapterCard.dataset.index;
    if (!indexStr) return;

    const originalIndex = parseInt(indexStr);
    if (isNaN(originalIndex)) return;

    const selectedChapter = chapters[originalIndex];
    if (!selectedChapter) return;

    renderChapter(selectedChapter, originalIndex, deleteChapter, saveChapter);
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

const deleteChapter = (chapterIndex: number) => {
  chapters.splice(chapterIndex, 1);
  saveChapters();
  renderMain();
};

const saveChapter = (updatedChapter: IChapter, chapterIndex: number) => {
  chapters[chapterIndex] = updatedChapter;
  saveChapters();
};

function saveChapters() {
  localStorage.setItem("chapters", JSON.stringify(chapters));
}

function loadChapters() {
  const saved = localStorage.getItem("chapters");
  if (saved) {
    chapters = JSON.parse(saved);
  }
}

function getSortedChapters(): IChapter[] {
  const chaptersCopy = [...chapters];

  switch (sortBy) {
    case "timestamp":
      return chaptersCopy.sort((a, b) => b.timestamp - a.timestamp); // Newest first
    case "author":
      return chaptersCopy.sort((a, b) =>
        a.author.toLowerCase().localeCompare(b.author.toLowerCase())
      ); // A-Z
    default:
      return chaptersCopy;
  }
}

function renderChaptersList(): string {
  if (chapters.length === 0) {
    return '<p class="no-chapters">No chapters yet. Add the first chapter.</p>';
  }

  const sortedChapters = getSortedChapters();

  return sortedChapters
    .map((chapter) => {
      const originalIndex = chapters.findIndex((c) => c.id === chapter.id);

      return `
        <li class="chapter-card" data-index="${originalIndex}">
          <h3>${escapeHtml(truncateText(chapter.title, 40))}</h3>
          <p class="chapter-author">By ${escapeHtml(
            truncateText(chapter.author, 20)
          )} <span class="timestamp">${formatTimestamp(
        chapter.timestamp
      )}</span>
          </p>
          <p class="chapter-content">${escapeHtml(
            truncateText(chapter.content, 30)
          )}</p>
        </li>
      `;
    })
    .join("");
}

renderMain();
