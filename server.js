//need our fs and express packages for program to work
const fs = require('fs');
const express = require('express');
const path = require('path');
//declaring port number
const PORT = process.env.PORT || 3001;
const expr = express();
const cors = require('cors');

const notes = require('./db/db.json');
//needed first variable name to be BODY and not MAIN to fit in with the index.js
function createNote(body, noteArray){
    const newNote = body;
    //if array doesn't exist, make empty one
    if(!Array.isArray(noteArray)){
        noteArray = [];
    }
    //if array empty, push your first note in
    if(noteArray.length == 0){
        noteArray.push(0);
    }
    body.id = noteArray[0];
    noteArray[0]++;

    noteArray.push(newNote);
    //2nd parameter of stringify null, cause we don't want a replacer
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(noteArray, null, 2)
    );
    //throw that note back out
    return newNote;
}

//report that server is running in the terminal
expr.listen(PORT, () => {
    console.log(`port: ${PORT}`);
});
//need to make express public to get port working
expr.use(express.static('public'));
expr.use(express.urlencoded({extended: true}));
expr.use(express.json());
//cors was giving issues without
expr.use(cors());
//slice(1) cause you only want that part of the returned json
expr.get('/api/notes', (req, res) =>{
    //renders note history on left (whenever the page reloads, or notes are added/deleted)
    res.json(notes.slice(1));
});
//get everything for the response
expr.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

expr.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

expr.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/index.html'));
})
//for the post, createNote is called
expr.post('/api/notes', (req, res) =>{
    var newNote = createNote(req.body, notes);
    res.json(newNote);
})

//for every note in the array, check if the id matches what you wanna get rid of
function deleteNote(id, noteArray){
    for(i=0;i<noteArray.length;i++){
        let note = noteArray[i];

        if(note.id == id){
            //splice is so that we only delete based off the ID returned from the json
            noteArray.splice(i, 1);
            fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(noteArray, null, 2)
            );
            break;
        }
    }
}
//delete whatever you choose to based on each note's id in the array
expr.delete('/api/notes/:id', (req, res) =>{
    deleteNote(req.params.id, notes);
    res.json(true);
});