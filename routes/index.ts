import express from "express";
const router = express.Router();
import passport from "passport";
import UserSchema from '../models/mongooseModels/user.model.js'

router.get("/", function(req, res){
    res.send("landing");
});

router.get("/register", function(req, res){
   res.send({level:'info', message:'This is the register route'});
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUserSchema = new UserSchema({email: req.body.email, username: req.body.username});
    console.log(newUserSchema)
    UserSchema.register(newUserSchema, req.body.password, function(err, UserSchema){
        if(err){
            console.log(err);
            console.log({level: 'info', message: 'User did not register correctly.'})
            return res.status(500).send({level: 'error', message: 'User did not create correctly. Try again.'});
        }
        passport.authenticate("local")(req, res, function(){
            res.status(200).send({level: 'info', message:`Success! Welcome to DocPross: ${UserSchema.email}`});
        });
    });
});

router.get("/login", function(req, res){
   res.send("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/landing",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/landing");
});

export default router;