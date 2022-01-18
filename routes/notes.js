const express = require("express");
const Note = require("../models/Notes");
const router = express.Router();
const fetchuser = require("../middlewares/fetchuser");
const { body, validationResult } = require("express-validator");

// Route 1 - To Get All Notes - Get Request
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2 - to Add a new Note - Post Request -> Login Required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a Valid Title").isLength({ min: 3 }),
    body("description", "Enter at least 5 character").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNotes = await note.save();
      res.json(savedNotes);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 2 - to Update Existing a new Note - PUT Request -> Login Required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    const newNote = {};

    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the Note to be Updated
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(400).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ note });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
  // create a new Note Object
});

// Route 4 - Delete Note By ID : Delete Method ->Login Required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the Note to be Deleted & Deleted
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(400).send("Not Found");
    }
    // allow delete if correct user
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);

    res.json({ success: "Note Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
