const { ObjectId } = require('bson');
const express = require('express');
let router = express.Router( );

router.get("/", getUsers);
router.get("/:usrId", getUserProfile);
router.put("/:usrId", changePrivacy);

function getUsers(req, res, next){
    //connect to the db and fina users that are public and display them here
    const username = req.query.username;
    if(username){
        req.app.locals.db.collection("users").find({username: {$regex: username}, privacy: false}).toArray(function(err, result){
            if(err){
                res.status(500).send("Error reading from db");
                next();
            } else {
                let data = {session: req.session, users: result};
                res.status(200).render("users.pug", {users: data});
            }
        });
    } else {
        req.app.locals.db.collection("users").find({privacy: false}).toArray(function(err, result){
            if(err){
                res.status(500).send("Error reading from db");
                next();
            }
            let data = {session: req.session, users: result};
            res.status(200).render("users.pug", {users: data});
        });
    }
}

function getUserProfile(req, res, next){
    try {
        let objId = new ObjectId(req.params.usrId);
        req.app.locals.db.collection("users").findOne({_id: objId}, function(err, result){
            if (err){
                res.status(500).send("Error reading from db");
                next();
            } else if (result == null){
                res.status(404).send("User not found");
                next();
            } else {
                //find the orders from order collection
                let data = {session: req.session, user: result};
                req.app.locals.db.collection("orders").find({user_id: req.params.usrId}).toArray(function(err, result){
                    if (err){
                        res.status(500).send("Error reading from db");
                        next();
                    } else {
                        data['orders'] = result;
                        res.status(200).render("profile.pug", {users: data});
                    }
                });
            }
        });
    } catch(err) {
        res.status(404).send("User not found");
        next();
    }
}

function changePrivacy(req, res, next){
    if(req.session.loggedIn == false){
        res.status(403).send("You are not logged in");
        next();
    } else {
        req.app.locals.db.collection("users").findOne({username: req.session.username}, function(err, result){
            if (err){
                res.status(500).send("Error reading from db");
                next();
            } else if (result == null){
                res.status(403).send("You cannot change someone else's profile");
                next();
            } else {
                let priv;
                if (req.body.privacy == 'true'){
                    priv = true;
                } else {
                    priv = false;
                }
                
                req.app.locals.db.collection("users").updateOne({username: result.username}, {$set: {privacy: priv}}, function(err, result){
                    if(err){
                        res.status(500).send("Error updating privacy");
                        next();
                    }
                });
                res.status(200).send("Changed privacy");
                next();
            }
        });
    }
}

module.exports = router;