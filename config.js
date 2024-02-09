const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('views'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use((err, req, res, next) => {
    console.error("Error middleware:", err);
    res.status(500).send("Internal Server Error");
    console.log("Request Body:", req.body);
    next();
});
app.use(session({
    secret: "Ikhsan012",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1440 * 60 * 1000 }
}));

mongoose.connect("mongodb+srv://test123:test123@selfmanagecluster.jaynyvk.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', () => console.log("error in connecting database"));
db.once('open', () => console.log("Connected to MongoDB"));

const storage = multer.diskStorage({
    destination: '/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5},
}).single('myfile');

const usersSchema = {
    username: String,
    email: String,
    password: String,
    online: {
        type: Boolean,
        default: false,
    },
};
const dailySchema = {
    username: String,
    title: String,
    description: String,
    date: Date,
    uniqueId: String,
    nameday: String
};
const fileSchema = new mongoose.Schema({
    username: String,
    filename: String,
    path: String,
    size: Number,
    uniqueId: String
});
const balanceSchema = new mongoose.Schema({
    username: String,
    value: Number
});
const historySchema = {
    username: String,
    formattedDate: Date,
    formattedTime: String,
    type: String,
    depositeAmount: Number,
    withdrawAmount: Number
}

const Users = mongoose.model("Users", usersSchema);
const Daily = mongoose.model("Daily", dailySchema);
const File = mongoose.model('File', fileSchema);
const Balance = mongoose.model('Balance', balanceSchema);
const History = mongoose.model('History', historySchema);

module.exports = { app, Users, Daily, File, upload, Balance, History };
