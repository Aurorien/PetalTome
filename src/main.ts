import { modalAdd } from "./modalAdd";
import "./style.css";

const main = document.querySelector<HTMLElement>("#main")!;
main.innerHTML = `
    <div class="post-h-ctn">
      <h2>Chapters</h2>
      <button id="add-button">Add chapter</button>
    </div>
`;

const modal = modalAdd((data) => console.log("Submitted:", data));
main.addEventListener("click", (e) => {
  if ((e.target as HTMLElement).id === "add-button") {
    modal.open();
  }
});
