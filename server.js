//////////////////////////////////
// Dependencies
/////////////////////////////////
// get .env variables
require("dotenv").config()
// pull PORT from .env, give it a default of 3000 (object destructuring)
const {PORT = 3001, DATABASE_URL} = process.env
// import express
const express = require("express")
// create the application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
// import middleware
const cors = require("cors")
const morgan = require("morgan")

/////////////////////////////////
// Database Connection
////////////////////////////////
// establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are disconnected from Mongo"))
.on("error", (error) => console.log(error))

//////////////////////////////
// Models
//////////////////////////////
// the cheese schema
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
}, {timestamps: true})

const Cheese = mongoose.model("Cheese", CheeseSchema)

/////////////////////////////////
//Middleware
//////////////////////////////////
app.use(cors()) // prevent cors errors, opens up access for frontend
app.use(morgan("dev")) //logging
app.use(express.json()) // parse json bodies

////////////////////////////////
// Routes
////////////////////////////////
// TEST
app.get("/", (req, res) => {
    res.send("Hello World")
})

// INDEX
app.get("/cheese", async (req, res) => {
    try {
      // send all cheeses
      res.json(await Cheese.find({}));
    } catch (error) {
      res.status(400).json({ error });
    }
});

// CREATE
app.post("/cheese", async (req, res) => {
    try {
      // screate a new person
      res.json(await Cheese.create(req.body));
    } catch (error) {
      res.status(400).json({ error });
    }
});

// UPDATE
app.put("/cheese/:id", async (req, res) => {
    try {
        // update a person
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}));
      } catch (error) {
        res.status(400).json({ error });
      }
})

// DESTROY
app.delete("/cheese/:id", async (req, res) => {
    try {
        // delete a person
        res.json(await Cheese.findByIdAndRemove(req.params.id));
      } catch (error) {
        res.status(400).json({ error });
      }
})

/////////////////////////////////
// Server Listener
/////////////////////////////////
app.listen(PORT, () => {console.log(`listening on PORT ${PORT}`)})