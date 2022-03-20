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
    res.sendFile(path.join(_dirname, './public/index.html'));
});

expr.get('/', (req, res) => {
    res.sendFile(path.join(_dirname, './public/index.html'));
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

    fs.writeFileSync(path.join(_dirname, './db/db.json'),
    JSON.stringify(noteArray, null, 2)
    );

    return newNote;
}

function deleteNote(id, noteArray){
    
}