const express= require('express');
const app= express();

const HOST= "localhost";
const PORT= 3000;

app.get('/',(req, res) =>{
res.send("Welcome back");
})
app.listen(PORT, () =>{
    console.log(`listening on port ${PORT}`);
})