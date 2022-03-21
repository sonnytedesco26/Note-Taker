const fs = require('fs');
const express = require("express");
const path = require('path');
const PORT = process.env.PORT || 3000;
const expr = express();

const notes = require('./db/db.json');


expr.listen(PORT, () => {
    console.log(`port: ${PORT}`)
})

expr.use(express.urlencoded({extended: true}));
expr.use(express.json());

expr.get('/api/notes', (req, res) =>{
    res.json(notes.slice(1));
});

expr.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

expr.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

expr.post('/api/notes', (req, res) =>{
    var newNote = createNote(req.main, notes);
    res.json(newNote);
})

expr.post('*', (req, res) =>{
    res.sendFile(path.join(__dirname, './index.html'));
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
    JSON.stringify(noteArray, null, 2)
    );

    return newNote;
}

function deleteNote(id, noteArray){
    for(i=0;i<noteArray.length;i++){
        var note = noteArray[i];

        if(note.id == id){
            noteArray.splice(i, 1);
            fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(noteArray, null, 2)
            );
            break;
        }
    }
}

expr.delete('/api/notes/:id', (req, res) =>{
    deleteNote(req.params.id, notes);
    res.json(true);
});