const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
	client: "pg",
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: false,
	},
});

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("it is working");
});

app.post("/signin", (req, res) => {
	signin.handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
	register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
	profile.handleProfileGet(req, res, db);
});

app.put("/image", (res, req) => {
	image.handleImage(res, req, db);
});

app.post("/imageUrl", (res, req) => {
	image.handleApiCall(res, req);
});

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
	console.log(`app is running on port ${PORT}`);
});
