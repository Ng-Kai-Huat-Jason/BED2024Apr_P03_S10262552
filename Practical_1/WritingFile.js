const fs = require('node:fs');

const content = 'Some content!';

fs.writeFile('/Users/joe/text.txt', content, err => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('File has been written!');
});
