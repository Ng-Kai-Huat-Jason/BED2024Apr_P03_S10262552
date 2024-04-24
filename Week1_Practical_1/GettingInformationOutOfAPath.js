const path = require('node:path');

const notes = '/users/joe/notes.txt';

path.dirname(notes); // /users/joes
path.basename(notes); // notes.txt
path.extname(notes); // .txt