const express =require("express");
const router = express.Router();

const {login,signup,userdetails} = require("../controllers/Auth");
const {auth,isStudent,isAdmin} = require("../middleware/auth")
router.post("/login",login);
router.post("/signup",signup);
router.get("/userdetails",userdetails);

//test
router.get("/test",(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route for test",
    });
})

//Protected routes
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route for Students",
    })
});

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route for Admin",
    })
});

module.exports = router;