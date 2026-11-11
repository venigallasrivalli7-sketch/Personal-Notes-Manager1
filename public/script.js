let editId = null;

async function loadNotes() {
    let res = await fetch("/notes");
    let notes = await res.json();

    let search = document.getElementById("search").value.toLowerCase();

    document.getElementById("notes").innerHTML = "";

    notes.filter(n => n.title.toLowerCase().includes(search))
    .forEach(n => {
        document.getElementById("notes").innerHTML += `
        <div class="note">
            <h3>${escapeHTML(n.title)}</h3>
            <p>${escapeHTML(n.content)}</p>
            <button onclick="editNote(${n.id})">Edit</button>
            <button onclick="deleteNote(${n.id})">Delete</button>
        </div>`;
    });
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
    })[c]);
}

async function saveNote() {
    let title = document.getElementById("title").value.trim();
    let content = document.getElementById("content").value.trim();

    if (!title || !content) {
        alert("Please enter title and content");
        return;
    }

    await fetch(editId ? `/notes/${editId}` : "/notes", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    });

    editId = null;
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    loadNotes();
}

async function editNote(id) {
    let res = await fetch("/notes");
    let notes = await res.json();
    let note = notes.find(n => n.id === id);

    document.getElementById("title").value = note.title;
    document.getElementById("content").value = note.content;
    editId = id;
}

async function deleteNote(id) {
    if (confirm("Delete this note?")) {
        await fetch(`/notes/${id}`, { method: "DELETE" });
        loadNotes();
    }
}

loadNotes();