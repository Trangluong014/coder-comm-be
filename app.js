require("dotenv").config();
const cors = require("cors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const { sendResponse } = require("./helpers/utils");
const createFriend = require("./createFriend");
const mongoURI = process.env.MONGO_DEV_URI;
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

/* DB Connection */
mongoose
  .connect(mongoURI)
  .then(
    () => console.log(`DB connected`)
    //  createFriend()
  )
  .catch((err) => console.log(err));

app.use("/v1", indexRouter);

// catch 404 and forard to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.statusCode = 404;
  next(err);
});

/* Initialize Error Handling */
app.use((err, req, res, next) => {
  console.log("ERROR", err);
  if (err.isOperational) {
    return sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      err.errorType,
      { message: err.message }
    );
  } else {
    return sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      "Internal Server Error",
      { message: err.message }
    );
  }
});

module.exports = app;
