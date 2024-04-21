//App Path Handler
const express = require('express')
const app = express()
const port = 3000

// Check for Link
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

//Post Request
app.get('/',(req,res) => {
    res.send('Hello World')
})


//Post Request
app.post('/create',(req,res) => {
    res.send('Got a POST request')
})

//Put Request
app.put('/edit',(req,res) => {
    res.send('Got a PUT request at /user')
})

//Delete Request
app.delete('/delete',(req,res) => {
    res.send('Got a Delete request at /user')
})

