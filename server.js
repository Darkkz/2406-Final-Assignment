const express = require('express');
const session = require('express-session');
const app = express();
const mc = require("mongodb").MongoClient;
const MongoDBStore = require('connect-mongodb-session')(session);

//setup a mongodb store
let store = new MongoDBStore({
    uri: "mongodb://localhost:27017/a4",
    collection: "sessions"
});

//setup routes
app.use(session({ secret: 'some secret here', store: store, cookie: {expires: 1800000}}));
app.use(express.static("public"));
app.use("/users", express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

let userRouter = require("./users-router");
app.use("/users", userRouter);

let ordersRouter = require("./orders-router");
app.use("/orders", ordersRouter);

app.get("/", (req, res, next) => {
    res.status(200).render("home.pug", {users: {session: req.session}});
});

app.get("/login", (req, res, next) => {
    res.status(200).render("login.pug", {users: {session: req.session}});
});

app.get("/register", (req, res, next) => {
    res.status(200).render("register.pug");
});

app.post("/register", (req, res, next) => {
    req.app.locals.db.collection("users").findOne({username: req.body.username}, function(err, result){
        if(err){
            res.status(500).send("Error accessing user to database");
        } else if (result != null){
            res.status(400).send("Username already exists");
            next();
        } else {
            req.body.privacy = false;
            req.app.locals.db.collection("users").insertOne(req.body, function(err, result) {
                if(err){
                    res.status(500).send("Error adding user to database");
                }
                req.session.loggedIn = true;
                req.session.username = req.body.username;
                req.session.userId = req.body._id;
                res.status(200).send("/users/" + req.body._id);
                next();
            });
        }
    });
});

app.post("/login", (req, res, next) => {
    console.log(req.body.password);
    req.app.locals.db.collection("users").findOne({username: req.body.username, password: req.body.password}, function(err, result){
        if(err){
            res.status(500).send("Error adding user to database");
        } else if (result == null){
            res.status(404).send("Cannot find user");
            next();
        } else {
            req.session.loggedIn = true;
            req.session.username = req.body.username;
            req.session.userId = result._id.toString();
            res.status(200).send("/users/" + result._id.toString());
        }
    });
});

app.get("/logout", (req, res, next) => {
    if(req.session.loggedIn){
        req.session.loggedIn = false;
        req.session.username = undefined;
        req.session.userId = undefined;
        res.status(200).redirect("/");
    } else {
        res.status(400).send("You are already logged out!");
    }
});

mc.connect("mongodb://localhost:27017/", function(err, client) {
	if(err) throw err;
	console.log("Connected to database.");

    app.locals.db = client.db("a4");

    app.listen(3000);
    console.log("Server listening at http://localhost:3000");
});