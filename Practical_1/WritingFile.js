const fs = require('node:fs');

const content = 'Some content!';

fs.writeFile('C:/Users/zekke/Desktop/BED/BED2024Apr_P03_S10262552/Practical_1/Hi.txt', content, err => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('File has been written!');
});
