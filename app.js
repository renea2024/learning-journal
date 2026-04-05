// Select elements
const addEntryBtn = document.getElementById('addEntryBtn');
const modal = document.getElementById('modal');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const entriesContainer = document.getElementById('entries');
const searchInput = document.getElementById('search');

const titleInput = document.getElementById('title');
const dateInput = document.getElementById('date');
const contentInput = document.getElementById('content');

// Load entries from localStorage
let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];

// Open modal
addEntryBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Close modal
cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  clearModalInputs();
});

// Save entry
saveBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const date = dateInput.value;
  const content = contentInput.value.trim();

  if (!title || !date || !content) {
    alert('Please fill out all fields!');
    return;
  }

  const newEntry = {
    id: Date.now(),
    title,
    date,
    content
  };

  entries.unshift(newEntry); // Add to top
  localStorage.setItem('journalEntries', JSON.stringify(entries));
  renderEntries(entries);
  modal.style.display = 'none';
  clearModalInputs();
});

// Clear modal inputs
function clearModalInputs() {
  titleInput.value = '';
  dateInput.value = '';
  contentInput.value = '';
}

// Render entries
function renderEntries(list) {
  entriesContainer.innerHTML = '';
  if (list.length === 0) {
    entriesContainer.innerHTML = '<div class="empty">No entries yet.</div>';
    return;
  }

  list.forEach(entry => {
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('entry');
    entryDiv.innerHTML = `
      <h3>${entry.title}</h3>
      <small>${entry.date}</small>
      <p>${entry.content}</p>
      <button class="delete-btn" data-id="${entry.id}">Delete</button>
    `;
    entriesContainer.appendChild(entryDiv);
  });

  // Add delete functionality
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.id);
      entries = entries.filter(entry => entry.id !== id);
      localStorage.setItem('journalEntries', JSON.stringify(entries));
      renderEntries(entries);
    });
  });
}

// Search functionality
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = entries.filter(entry =>
    entry.title.toLowerCase().includes(query) ||
    entry.content.toLowerCase().includes(query)
  );
  renderEntries(filtered);
});

// Initial render
renderEntries(entries);