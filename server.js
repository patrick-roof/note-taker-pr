const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('./Develop/public'));

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//app.get function, may need to change
app.get('/api/notes', (req, res) =>
    readFileAsync('./Develop/db/db.json', 'utf8').then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
)

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);