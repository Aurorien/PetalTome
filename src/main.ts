import { modalAdd } from "./modalAdd";
import "./style.css";
import type { IChapter } from "./types";

let chapters: IChapter[] = [];

const main = document.querySelector<HTMLElement>("#main")!;
main.innerHTML = `
    <div class="post-h-ctn">
      <h2>Chapters</h2>
      <button id="add-button">Add chapter</button>
    </div>
`;

const modal = modalAdd((chapter: IChapter) => {
  console.log("Submitted:", chapter);
  chapters.push(chapter);
  saveChapters();
});

main.addEventListener("click", (e) => {
  if ((e.target as HTMLElement).id === "add-button") {
    modal.open();
  }
});

function saveChapters() {
  localStorage.setItem("chapters", JSON.stringify(chapters));
}
