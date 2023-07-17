const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// for db connection
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/todoListDB', { useNewUrlParser: true });

// creating db schema 
const itemSchema = mongoose.Schema({
    name: String
});

// creating model from schema
const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
    name: 'Welcome to ToDo List'
});

const item2 = new Item({
    name: 'Press + button to add new items'
});

const item3 = new Item({
    name: 'Press - button to delete an entry'
});

const defaultItem = [item1, item2, item3];

app.get("/", (req, res) => {

    Item.find({}).then(items => {
        const foundItem = items;
        // console.log(foundItem.length);
        if (foundItem.length == 0) {
            Item.insertMany(defaultItem);
            res.redirect("/");
        } else {
            res.render('index', { listTitle: "Today", newItem: foundItem });
        }
    }).catch(err => console.log('Caught', err.message));
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