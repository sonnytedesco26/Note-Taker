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