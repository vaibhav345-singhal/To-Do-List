const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];
let workItems = [];

app.get("/", (req, res) => {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    let day = today.toLocaleDateString("en-US", options);

    res.render('index', { listTitle: day, newItem: items });
});


app.post("/", (req, res) => {
    let item = req.body.item;


    // console.log(req.body.list);
    if (req.body.list === 'Work') {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);

        res.redirect("/");
    }
});

app.get("/work", (req, res) => {
    res.render("index", { listTitle: "Work List", newItem: workItems });
});


app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(port, () => {
    console.log("server up and running");
});