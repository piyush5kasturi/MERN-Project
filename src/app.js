require('dotenv').config();
const express = require('express');
const bcryptjs = require('bcryptjs');
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 3000;
require("./db/conn");
const auth = require("./middleware/auth");
const Register = require("./models/register");
const path = require('path');
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

const hbs = require('hbs');
hbs.registerPartials(partials_path);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);

// console.log(process.env.COLLECTION_NAME);

app.get("/", (req, res) => {
    res.render('index');
})
app.get("/about", (req, res) => {
    res.render('about');
})
app.get("/weather", (req, res) => {
    res.render('weather');
})
app.get("/register", (req, res) => {
    res.render('register');
})


app.get("/secret", auth, (req, res) => {
    // console.log(req.cookies.jwt1);
    res.render('secret');
})

app.get("/logout", auth, async (req, res) => {
    try {

        // For single Logout
        // req.user.token = req.user.tokens.filter((ele) => {
        //     return ele.token != req.token;
        // })
        //

        // Logout from all device

        req.user.tokens = [];


        res.clearCookie("jwt1");
        console.log("Logout");

        await req.user.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
})

// post  sign up
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })


            const token = await registerEmployee.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000000000000),
                httpOnly: true
            });


            const registered = await registerEmployee.save();
            console.log(registered);
            res.status(201).render("index");
        } else {
            res.send("password are not matching");
        }

    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/login", (req, res) => {
    res.render('login');
})

// login check

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userEmail = await Register.findOne({ email: email });

        const isMatch = await bcryptjs.compare(password, userEmail.password);
        // console.log(isMatch);
        const token = await userEmail.generateAuthToken();
        res.cookie("jwt1", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true,
            // secure:true
        });


        // console.log(token);
        if (isMatch) {
            res.status(200).render("weather");
        } else {
            res.send("Invalid Email or Password");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("*", (req, res) => {
    res.render('404error', {
        errormsg: 'Opps! Page Not Found'
    });
})


app.listen(port, () => {
    console.log(`Running on ${port}`)
})