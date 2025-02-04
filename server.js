const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const routes = require("./routes/index");

const app = express();

mongoose.connect("mongodb://localhost/tadawi", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(3000, () => console.log("Server running on port 3000"));
