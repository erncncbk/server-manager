const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user");
const contactRouter = require("./routers/contact");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(contactRouter);

module.exports = app;
