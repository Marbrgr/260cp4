const express = require('express');
const bodyParser = require("body-parser");

const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: String,
  path: String,
  description: String,
});

const entrySchema = new mongoose.Schema({
  username: String,
  date: String,
  subject: String,
  content: String,
})

const Item = mongoose.model('Item', itemSchema);
const Entry = mongoose.model('Entry', entrySchema);

app.post('/api/photos', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});


// connect to the database

//url: mongodb+srv://marbrgr:<password>@cs260cluster.05c26.mongodb.net/test
//old url:mongodb://localhost:27017/museum 
mongoose.connect('mongodb+srv://marbrgr:toor@cs260cluster.05c26.mongodb.net/journal', {
  useNewUrlParser: true
});

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/items', async (req, res) => {
  const item = new Item({
    title: req.body.title,
    path: req.body.path,
    description: req.body.description,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/saveEntry', async(req, res) => {
  const entry = new Entry({
    username: req.body.username,
    date: req.body.date,
    subject: req.body.subject,
    content: req.body.content,
  })
  try {
    await entry.save();
    res.send(entry);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete("/api/entries/:id", async (req, res) => {
  console.log("delete called on server");
  try {
    await Entry.deleteOne({
      _id: req.params.id
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.put('/api/items/:id', async (req, res) => {
  try {
    var selectedItem = await Item.findOne({
      _id: req.params.id
    });
    selectedItem.title = req.body.title;
    selectedItem.description = req.body.description;
    try {
      await selectedItem.save();
      res.send(selectedItem);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

app.put("/api/entries/:id", async (req, res) => {
  try {
    var selectedEntry = Entry.findOne({
      _id: req.params.id
    });
    selectedEntry.username = req.params.username;
    selectedEntry.subject = req.params.subject;
    selectedEntry.date = req.params.date;
    selectedEntry.content = req.params.content;
    try {
      await selectedEntry.save();
      res.send(selectedEntry);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/entries', async (req, res) => {
  try {
    let entries = await Entry.find();
    res.send(entries);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.listen(3000, () => console.log('Server listening on port 3000!'));
