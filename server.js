const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const file = "notes.json";

function readNotes() {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveNotes(notes) {
    fs.writeFileSync(file, JSON.stringify(notes, null, 2));
}

// View notes
app.get("/notes", (req, res) => {
    res.json(readNotes());
});

// Add note
app.post("/notes", (req, res) => {
    let notes = readNotes();
    let note = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content
    };
    notes.push(note);
    saveNotes(notes);
    res.json(note);
});

// Edit note
app.put("/notes/:id", (req, res) => {
    let notes = readNotes();
    let note = notes.find(n => n.id == req.params.id);

    if (!note) return res.status(404).send("Note not found");

    note.title = req.body.title;
    note.content = req.body.content;

    saveNotes(notes);
    res.json(note);
});

// Delete note
app.delete("/notes/:id", (req, res) => {
    let notes = readNotes();
    notes = notes.filter(n => n.id != req.params.id);
    saveNotes(notes);
    res.json({ message: "Note deleted" });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});