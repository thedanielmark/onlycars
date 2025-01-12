var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var db = require("./db");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var checkUserOnXMTPRouter = require("./routes/check-user-on-xmtp");
var subscribeRouter = require("./routes/subscribe");
var attestationsRouter = require("./routes/attestations");
var broadcastRouter = require("./routes/broadcast");
var telemetryRouter = require("./routes/telemetry");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/check-user-on-xmtp", checkUserOnXMTPRouter);
app.use("/subscribe", subscribeRouter);
app.use("/attestations", attestationsRouter);
app.use("/broadcast", broadcastRouter);
app.use("/telemetry", telemetryRouter);

app.listen(5000, () => {
  console.log(`Example app listening on port 5000`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
