const express=require('express')
const Router=express.Router()

Router.get("/", (req,res)=>{
    res.redirect("/admin")
})


module.exports=Router