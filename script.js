// Select DOM elements
const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const noteCategory = document.getElementById("note-category");
const searchInput = document.getElementById("search-input");
const notesList = document.getElementById("notes-list");
const noteCount = document.getElementById("note-count");
const errorMessage = document.getElementById("error-message");

// Initialize notes array from localStorage or empty array
let notes = JSON.parse(localStorage.getItem("quicknotes")) || [];

// Format readable date and time
function getFormattedDate() {
  const now = new Date();
  return now.toLocaleString();
}

// Update note count message based on total notes
function updateCount(filteredNotesLength) {
  const total = notes.length;
  if (total === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (total === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${total} notes.`;
  }
}

// Render notes to the DOM securely
function renderNotes(notesToRender = notes) {
  notesList.innerHTML = "";

  if (notesToRender.length === 0 && notes.length > 0) {
    const li = document.createElement("li");
    li.textContent = "No notes match your search.";
    li.style.color = "#777";
    li.style.fontStyle = "italic";
    notesList.appendChild(li);
    updateCount();
    return;
  }

  notesToRender.forEach((note) => {
    const li = document.createElement("li");
    li.className = `note-card category-${note.category}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "note-content";

    const textP = document.createElement("p");
    textP.textContent = note.text;

    const metaP = document.createElement("p");
    metaP.className = "note-meta";
    metaP.textContent = `Category: ${note.category.toUpperCase()} | Created: ${note.createdAt}`;

    contentDiv.appendChild(textP);
    contentDiv.appendChild(metaP);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteNote(note.id);
    });

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);
    notesList.appendChild(li);
  });

  updateCount();
}

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem("quicknotes", JSON.stringify(notes));
}

// Add a note with validation
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Validation checks
  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }
  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  // Clear error message on valid submit
  errorMessage.textContent = "";

  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: getFormattedDate(),
  };

  notes.push(newNote);
  saveNotes();
  renderNotes();

  // Reset form
  noteInput.value = "";
  noteCategory.value = "personal";
});

// Delete a note
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  renderNotes();
}

// Search / filter notes
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(query)
  );
  renderNotes(filteredNotes);
});

// Initial render when script loads
renderNotes();