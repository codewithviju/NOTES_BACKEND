const connectToMongo = require("./connection/connect.js");
const express = require("express");
const cors = require("cors");
// MongoDB Connection
connectToMongo();
const app = express();
app.use(cors());

const PORT = process.env.PORT || 8000;
app.use(express.json());
// Available Routes

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(PORT, () => {
  console.log(`NoteBook App Running on http://localhost:${PORT}`);
});
