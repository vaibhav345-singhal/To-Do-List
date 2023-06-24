const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", (req, res) => {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    let day = today.toLocaleDateString("en-US", options);

    res.render('index', { typeOfDay: day, newItem: items });
});


app.post("/", (req, res) => {
    let item = req.body.item;
    items.push(item);

    res.redirect("/");
})

app.listen(port, () => {
    console.log("server up and running");
});