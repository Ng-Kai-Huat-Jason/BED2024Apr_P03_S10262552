//App Path Handler
const express = require('express')
const app = express()
const port = 3000

// Check for Link
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use(express.static('Practical_2')) // http://localhost:{port}/Ahko


