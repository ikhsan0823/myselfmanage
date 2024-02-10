const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://test123:test123@selfmanagecluster.jaynyvk.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', () => console.log("error in connecting database"));
db.once('open', () => console.log("Connected to MongoDB"));

module.exports = mongoose;