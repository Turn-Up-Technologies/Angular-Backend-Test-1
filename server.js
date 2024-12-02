const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect('mongodb+srv://ammar:ammar001@cluster0.guus2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/admin', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Schema and Model
const noteSchema = new mongoose.Schema({
    text: String,
    type: String,
    user: String,
    email: String, // New field for email
    timestamp: { type: Date, default: Date.now },
  });
  

const Note = mongoose.model('Note', noteSchema);

// Routes
app.get('/api/notes', async (req, res) => {
  const notes = await Note.find().sort({ timestamp: -1 });
  res.json(notes);
});

app.post('/api/notes', async (req, res) => {
    const newNote = new Note(req.body); // email is included here
    await newNote.save();
    res.json(newNote);
  });
  
app.delete('/api/notes/:id', async (req, res) => {
    const noteId = req.params.id;
    await Note.findByIdAndDelete(noteId);
    res.json({ success: true });
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
