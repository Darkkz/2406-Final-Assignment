const { ObjectId } = require('bson');
const express = require('express');
let router = express.Router();

router.get("/", getOrderForm);
router.post("/", userOrder);
router.get("/:ordId", getOrderSum);

function getOrderForm(req, res, next){
    if (req.session.loggedIn){
        res.status(200).render("orderForm.pug", {users: {session: req.session}});
    } else {
        res.status(401).send("You are not logged in");
        next();
    }
}

function getOrderSum(req, res, next){
    try {
        let orderId = new ObjectId(req.params.ordId);
        req.app.locals.db.collection("orders").findOne({_id: orderId}, function(err, result){
            if (err){
                res.status(500).send("Error occured when finding order");
                next();
            } else if(result == null){
                throw err;
            } else {
                let data = {session: req.session, 'order': result, 'user': {}};
                let userId = new ObjectId(result.user_id);
                req.app.locals.db.collection("users").findOne({_id: userId}, function(err, result){
                    if (result.privacy == true && req.session.username != result.username){
                        res.status(403).send("User is private");
                        next(); 
                    } else {
                        data['user'] = result;
                        res.status(200).render("orderSum.pug", {users: data});
                    }
                });
            }
        });
    } catch(err) {
        res.status(404).send("Order not found");
        next();
    }
}

function userOrder(req, res, next){
    //add order to db storing the user _id
    let id = req.session.userId.toString();
    let order = {};
    order['user_id'] = id;
    order['order'] = req.body;
    req.app.locals.db.collection("orders").insertOne(order, function(err, result){
        if (err){
            res.status(500).send("Error occured when adding order to db");
            next();
        } else {
            res.status(200).send("Order added to db");
            next();
        }
    });
}

module.exports = router;