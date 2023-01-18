const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./Develop/helpers/uuid')

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./Develop/public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
)

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, './Develop/public/index.html'))
)

app.get('/api/notes', (req, res) => {

    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            parsedNotes = JSON.parse(data)
            res.json(parsedNotes)
        }
    })

});

app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;

    const newNote = {
        title,
        text,
        review_id: uuid(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data);

            parsedNotes.push(newNote);

            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes, null),
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