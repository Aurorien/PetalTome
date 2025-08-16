import type { IChapter } from "./types";
import "./modalAdd.css";

export function modalAdd(onSubmit: (chapter: IChapter) => void) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Add New Post</h2>
      
      <form>
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" type="text" name="title" required />
        </div>
        
        <div class="form-group">
          <label for="author">Author</label>
          <input id="author" type="text" name="author" required />
        </div>
        
        <div class="form-group">
          <label for="content">Content</label>
          <textarea id="content" name="content" required></textarea>
        </div>
        
        <div class="form-buttons">
          <button type="button" class="cancel">Cancel</button>
          <button type="submit">Add Chapter</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const form = modal.querySelector("form")!;
  const cancelBtn = modal.querySelector(".cancel")!;

  function open() {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
    form.reset();
  }

  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const chapter: IChapter = {
      id: crypto.randomUUID(),
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      timestamp: Date.now(),
      content: formData.get("content") as string,
    };

    onSubmit(chapter);
    close();
  };

  cancelBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => e.target === modal && close());
  document.addEventListener("keydown", (e) => e.key === "Escape" && close());

  return { open, close };
}
