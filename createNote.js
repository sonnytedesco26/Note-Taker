const fs = require('fs');
const express = require("express");
const path = require('path');
const PORT = process.env.PORT || 3000;
const expr = express();

const notes = require('./db/db.json');

expr.use(express.urlencoded({extended: true}));
expr.use(express.json());

expr.get('/api/notes', (req, res) =>{
    res.json(notes.slice(1));
});

expr.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

expr.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

expr.post('/api/notes', (req, res) =>{
    var newNote = createNote(req.body, notes);
    res.json(newNote);
})

function createNote(main, noteArray){
    var newNote = main;
    if(!Array.isArray(noteArray)){
        noteArray = [];
    }
    if(noteArray.length == 0){
        noteArray.push(0);
    }
    main.id = noteArray[0];
    noteArray[0]++;

    noteArray.push(newNote);

    fs.writeFileSync(path.join(__dirname, './db/db.json'),
    JSON.stringify(noteArray, null, 1)
    );

    return newNote;
}

function deleteNote(id, noteArray){
    for(i=0;i<noteArray.length;i++){
        var note = noteArray[i];

        if(note.id == id){
            noteArray.splice(i, 1);
            fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(noteArray, null, 1)
            );
            break;
        }
    }
}

expr.delete('/api/notes/:id', (req, res) =>{
    deleteNote(req.params.id, notes);
    res.json(true);
});