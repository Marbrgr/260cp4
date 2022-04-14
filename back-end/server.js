const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  username: String,
  date: String,
  subject: String,
  content: String,
})

const Entry = mongoose.model('Entry', entrySchema);


// connect to the database

//url: mongodb+srv://marbrgr:<password>@cs260cluster.05c26.mongodb.net/test
//old url:mongodb://localhost:27017/museum 
mongoose.connect('mongodb+srv://marbrgr:toor@cs260cluster.05c26.mongodb.net/journal', {
  useNewUrlParser: true
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


app.listen(3000, () => console.log('Server listening on port 3300!'));
