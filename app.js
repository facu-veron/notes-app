const API_URL = 'api.php';

const form = document.getElementById('note-form');
const idInput = document.getElementById('note-id');
const titleInput = document.getElementById('note-title');
const contentInput = document.getElementById('note-content');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const notesList = document.getElementById('notes-list');

function loadNotes() {
    fetch(API_URL)
        .then(res => res.json())
        .then(renderNotes)
        .catch(err => console.error('Error al cargar notas:', err));
}

function renderNotes(notes) {
    notesList.innerHTML = '';

    if (notes.length === 0) {
        notesList.innerHTML = '<p>No hay notas todavía.</p>';
        return;
    }

    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = 'note';
        div.innerHTML = `
            <h3>${escapeHtml(note.title)}</h3>
            <p>${escapeHtml(note.content)}</p>
            <small>Actualizado: ${note.updated_at}</small>
            <div class="note-actions">
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Eliminar</button>
            </div>
        `;

        div.querySelector('.edit-btn').addEventListener('click', () => editNote(note));
        div.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note.id));

        notesList.appendChild(div);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = idInput.value;
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) return;

    if (id) {
        updateNote(id, title, content);
    } else {
        createNote(title, content);
    }
});

function createNote(title, content) {
    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    })
        .then(res => res.json())
        .then(() => {
            resetForm();
            loadNotes();
        })
        .catch(err => console.error('Error al crear nota:', err));
}

function updateNote(id, title, content) {
    fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title, content })
    })
        .then(res => res.json())
        .then(() => {
            resetForm();
            loadNotes();
        })
        .catch(err => console.error('Error al actualizar nota:', err));
}

function deleteNote(id) {
    if (!confirm('¿Eliminar esta nota?')) return;

    fetch(`${API_URL}?id=${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => loadNotes())
        .catch(err => console.error('Error al eliminar nota:', err));
}

function editNote(note) {
    idInput.value = note.id;
    titleInput.value = note.title;
    contentInput.value = note.content;
    submitBtn.textContent = 'Guardar cambios';
    cancelBtn.classList.remove('hidden');
}

function resetForm() {
    form.reset();
    idInput.value = '';
    submitBtn.textContent = 'Agregar nota';
    cancelBtn.classList.add('hidden');
}

cancelBtn.addEventListener('click', resetForm);

loadNotes();
