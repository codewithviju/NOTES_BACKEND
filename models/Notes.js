const moongoose = require("mongoose");
const Schema = moongoose.Schema;
const notesSchema = new Schema({
  user: {
    type: moongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = moongoose.model("notes", notesSchema);
