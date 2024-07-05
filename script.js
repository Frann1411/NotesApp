const notesContainer = document.getElementById('notes-container');
const addBtn = document.getElementById('add-btn');
const noteText = document.getElementById('note-text');

//Funcion para el manejo del Local Storage
function getNotesFromStorage() {
  const notes = localStorage.getItem('notes');
  return notes ? JSON.parse(notes) : [];
}

function setNotesToStorage(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

//Mostrar las Notas
function displayNotes() {
  const notes = getNotesFromStorage();
  notesContainer.innerHTML = '';
  notes.forEach((note) => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note', 'col-md-4', 'mb-4');
    noteElement.innerHTML = `
      <p class="note-text">${note.text}</p>
      <div class="note-buttons">
        <button class="btn btn-warning edit-btn" data-note-id="${note.id}">Editar</button>
        <button class="btn btn-danger delete-btn" data-note-id="${note.id}">Borrar</button>
      </div>`;
    notesContainer.appendChild(noteElement);

    const deleteBtn = noteElement.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      const noteId = deleteBtn.dataset.noteId;
      const newNotes = notes.filter((n) => n.id !== Number(noteId));
      setNotesToStorage(newNotes);
      displayNotes();
    });

    const editBtn = noteElement.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      const noteId = editBtn.dataset.noteId;
      const noteToEdit = notes.find((n) => n.id === Number(noteId));
      noteText.value = noteToEdit.text;
      addBtn.textContent = 'Actualizar Nota';
      addBtn.removeEventListener('click', addNoteHandler);
      addBtn.addEventListener('click', () => updateNoteHandler(noteId));
    });
  });
}

//Agregar Notas
function addNoteHandler() {
  const newNoteText = noteText.value.trim();
  if (newNoteText) {
    const notes = getNotesFromStorage();
    const newNote = {
      id: Date.now(),
      text: newNoteText,
    };
    notes.push(newNote);
    setNotesToStorage(notes);
    displayNotes();
    noteText.value = '';
  }
}

//Actualizar Notas
function updateNoteHandler(noteId) {
  const updatedNoteText = noteText.value.trim();
  if (updatedNoteText) {
    const notes = getNotesFromStorage();
    const noteIndex = notes.findIndex((n) => n.id === Number(noteId));
    notes[noteIndex].text = updatedNoteText;
    setNotesToStorage(notes);
    displayNotes();
    noteText.value = '';
    addBtn.textContent = 'Add Note';
    addBtn.removeEventListener('click', updateNoteHandler);
    addBtn.addEventListener('click', addNoteHandler);
  }
}

addBtn.addEventListener('click', addNoteHandler);

displayNotes();
