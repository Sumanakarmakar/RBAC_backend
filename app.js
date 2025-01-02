const express=require('express')
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./app/config/dbConn");
const session = require("express-session");
const flash = require("connect-flash");
const dotenv=require('dotenv')
const cors=require('cors')
dotenv.config()

const app=express()
connectDB();

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/uploads", express.static("uploads"));
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    cookie: {
      maxAge: 60000,
    },
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(flash());
app.use(cors());

const RedirectRoute=require("./app/router/admin/RedirectRoute")
app.use(RedirectRoute)

const AdminRoute = require("./app/router/admin/AdminRoute");
app.use("/admin", AdminRoute);

//for api route
const ApiRoute = require("./app/router/api/ApiRoute");
app.use("/api", ApiRoute);

const port=9018

app.listen(port, ()=>{
    console.log(`Server is Running start: http://localhost:${port}/admin`);
})
