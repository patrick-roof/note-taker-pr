const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./helpers/uuid')

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.get('/api/notes', (req, res) => {

    let parsedNotes;

    fs.readFile('/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            parsedNotes = [].concat(JSON.parse(data))
            res.json(parsedNotes)
        }
    })

    res.json(parsedNotes);
});

app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;

    const newNote = {
        title,
        text,
        id: uuid(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data);

            parsedNotes.push(newNote);

            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes),
                (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.log('Successfully updated notes!')
            )
        }
    }) 
})


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);