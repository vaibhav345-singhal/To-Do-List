const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const port = 3000;

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// for db connection
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/todoListDB', { useNewUrlParser: true });

// creating items db schema 
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
    name: 'Tick checkbox to delete an entry'
});

const defaultItem = [item1, item2, item3];

// creating lists db schema

const listSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

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


app.get("/:customListName", (req, res) => {
    let customListName = _.capitalize(req.params.customListName);

    const list = new List({
        name: customListName,
        items: defaultItem
    });

    List.findOne({ name: customListName }).then((lists) => {
        if (!lists) {
            list.save().then((list) => {
                res.render('index', { listTitle: customListName, newItem: list.items });
            }).catch(err => err.message);
        } else {
            res.render('index', { listTitle: customListName, newItem: lists.items });
        }
    }).catch((err) => {
        console.log(err.message);
    })
});



app.post("/", (req, res) => {
    let enteredItem = req.body.item;
    let currentListName = req.body.list;

    if (currentListName == "Today") {
        const newItem = new Item({
            name: enteredItem
        });

        newItem.save();

        res.redirect("/");
    } else {
        const newItem = new Item({
            name: enteredItem
        });

        List.findOne({ name: currentListName }).then((list) => {
            list.items.push(newItem);
            list.save();
        })
        res.redirect("/" + currentListName);
    }
});

app.post("/delete", (req, res) => {
    let itemId = req.body.checkbox;
    let currentListName = req.body.listName;

    if (currentListName == "Today") {
        Item.findByIdAndDelete(itemId).then((item) => {
            console.log(item.name + " is deleted");
        }).catch((err) => {
            console.log(err);
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate({ name: currentListName }, { $pull: { items: { _id: itemId } } }).then((foundList) => {
            console.log('updated data ' + foundList);
            res.redirect("/" + currentListName);
        }).catch((err) => {
            console.log(err.message);
        });
    }
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(port, () => {
    console.log("server up and running");
});