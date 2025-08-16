import type { IChapter } from "./types";
import { escapeHtml, formatTimestamp } from "./utils";
import "./chapter.css";

const main = document.querySelector<HTMLElement>("#main")!;

export function renderChapter(
  chapter: IChapter,
  index: number,
  onDelete: (index: number) => void,
  onSave: (updatedChapter: IChapter, index: number) => void
) {
  let isEditing = false;
  let currentChapter = { ...chapter }; // Shallow copy, sufficient since there are no nested objects here

  function render() {
    if (!isEditing) {
      main.innerHTML = `
        <article class="chapter-h-ctn">
          <h2 class="chapter-title">${escapeHtml(currentChapter.title)}</h2>
          <p class="chapter-author">By ${escapeHtml(currentChapter.author)}
            <span class="timestamp">${formatTimestamp(
              currentChapter.timestamp
            )}</span>
          </p>
          <p class="chapter-content">${escapeHtml(currentChapter.content)}</p>
          <div class="edit-icons-ctn">
            <span class="material-symbols-outlined edit" id="edit-btn">edit</span>
            <span class="material-symbols-outlined delete" id="delete-btn">delete</span>
          </div>
        </article>
        <button id="back-btn" class="material-symbols-outlined arrow">arrow_back</button>
      `;
    } else {
      main.innerHTML = `
      <form class="chapter-h-ctn edit-form">
        <div class="form-group edit">
          <label for="edit-title">Title</label>
          <input id="edit-title" type="text" name="title" value="${escapeHtml(
            currentChapter.title
          )}" />
        </div>
        
        <div class="form-group edit">
          <label for="edit-author">Author</label>
          <input id="edit-author" type="text" name="author" value="${escapeHtml(
            currentChapter.author
          )}" />
        </div>
        
        <div class="form-group edit">
          <label for="edit-content">Content</label>
          <textarea id="edit-content" name="content">${escapeHtml(
            currentChapter.content
          )}</textarea>
        </div>
        
        <div class="form-buttons edit">
          <button id="cancel-btn" type="button" class="cancel edit">Cancel</button>
          <button id="save-btn" type="submit">Save</button>
        </div>
      </form>
        <button id="back-btn" class="material-symbols-outlined arrow">arrow_back</button>
      `;
    }

    attachEventListeners();
  }

  function attachEventListeners() {
    const editBtn = document.getElementById("edit-btn");
    const deleteBtn = document.getElementById("delete-btn");
    const saveBtn = document.getElementById("save-btn");
    const cancelBtn = document.getElementById("cancel-btn");

    if (editBtn) {
      editBtn.addEventListener("click", () => {
        isEditing = true;
        render();
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this chapter?")) {
          onDelete(index);
        }
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const titleInput = document.getElementById(
          "edit-title"
        ) as HTMLInputElement;
        const authorInput = document.getElementById(
          "edit-author"
        ) as HTMLInputElement;
        const contentTextarea = document.getElementById(
          "edit-content"
        ) as HTMLTextAreaElement;

        const updatedChapter: IChapter = {
          ...currentChapter,
          title: titleInput.value.trim(),
          author: authorInput.value.trim(),
          content: contentTextarea.value.trim(),
          timestamp: Date.now(), // Update timestamp
        };

        if (
          !updatedChapter.title ||
          !updatedChapter.author ||
          !updatedChapter.content
        ) {
          alert("All fields are required");
          return;
        }

        currentChapter = updatedChapter;
        isEditing = false;
        onSave(updatedChapter, index);
        render();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        isEditing = false;
        render();
      });
    }
  }

  render();
}
