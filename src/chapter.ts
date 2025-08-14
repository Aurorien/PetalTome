import type { IChapter } from "./types";
import { escapeHtml } from "./utils";
import "./chapter.css";

const main = document.querySelector<HTMLElement>("#main")!;

export function renderChapter(chapter: IChapter) {
  console.log("chapter", chapter);

  main.innerHTML = `
    <article class="chapter-h-ctn">
      <h2 class="chapter-title">${escapeHtml(chapter.title)}</h2>
      <p class="chapter-author">By ${escapeHtml(chapter.author)}</p>
      <p class="chapter-content">${escapeHtml(chapter.content)}</p>
    </article>
    <button id="back-btn" class="material-symbols-outlined">
      arrow_back
    </button>
  `;
}
