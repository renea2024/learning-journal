// =======================
// Elements
// =======================
const addEntryBtn = document.getElementById("addEntryBtn");
const modal = document.getElementById("modal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const contentInput = document.getElementById("content");
const topicInput = document.getElementById("topic");

const entriesContainer = document.getElementById("entries");
const searchInput = document.getElementById("search");

// =======================
// State
// =======================
let entries = JSON.parse(localStorage.getItem("entries")) || [];

// =======================
// Modal Controls
// =======================
addEntryBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

cancelBtn.addEventListener("click", () => {
  closeModal();
});

function closeModal() {
  modal.classList.remove("active");
  clearForm();
}

// =======================
// Save Entry (FIXED)
// =======================
saveBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const date = dateInput.value;
  const content = contentInput.value.trim();
  const topic = topicInput.value;

  // validation
  if (!title || !date || !content) {
    alert("Please fill in all required fields.");
    return;
  }

  const newEntry = {
    id: Date.now(),
    title,
    date,
    content,
    topic
  };

  entries.push(newEntry);

  // ✅ Sort by newest date
  entries.sort((a, b) => new Date(b.date) - new Date(a.date));

  saveToStorage();
  renderEntries();
  closeModal();
});

// =======================
// Render Entries
// =======================
function renderEntries(filteredEntries = entries) {
  entriesContainer.innerHTML = "";

  if (filteredEntries.length === 0) {
    entriesContainer.innerHTML = `<div class="empty">No entries found.</div>`;
    return;
  }

  filteredEntries.forEach(entry => {
    const card = document.createElement("div");
    card.classList.add("entry-card");

    card.innerHTML = `
      <div class="entry-header">
        <div>
          <div class="entry-title">${entry.title}</div>
          <div class="entry-date">${entry.date}</div>
          ${entry.topic ? `<div class="entry-topic">#${entry.topic}</div>` : ""}
        </div>
        <span class="favorite">☆</span>
      </div>

      <div class="entry-content">${entry.content}</div>

      <div class="entry-actions">
        <button class="delete-btn" data-id="${entry.id}">Delete</button>
      </div>
    `;

    entriesContainer.appendChild(card);
  });
}

// =======================
// Delete Entry
// =======================
entriesContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    entries = entries.filter(entry => entry.id !== id);
    saveToStorage();
    renderEntries();
  }
});

// =======================
// Search
// =======================
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();

  const filtered = entries.filter(entry =>
    entry.title.toLowerCase().includes(term) ||
    entry.content.toLowerCase().includes(term) ||
    (entry.topic && entry.topic.toLowerCase().includes(term))
  );

  renderEntries(filtered);
});

// =======================
// Local Storage
// =======================
function saveToStorage() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

// =======================
// Helpers
// =======================
function clearForm() {
  titleInput.value = "";
  dateInput.value = "";
  contentInput.value = "";
  topicInput.value = "";
}

// =======================
// Init
// =======================
renderEntries();