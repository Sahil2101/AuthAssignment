const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth=(req,res,next)=>{
    try {
        //extract jwt token
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token missing',
            })
        }
        //verify token
        console.log(token);
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            console.log(decode);
            console.log("req.user :",req.user)
            req.user = decode;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:"error while verifying jwt token",
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong, while verifying the token',
        });
    }
}

exports.isStudent = (req,res,next)=>{
    try {
        if(req.user.role!=="Student"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for students'
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}

exports.isAdmin = (req,res,next)=>{
    try {
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin'
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}

// exports.isVisitor = (req,res,next)=>{
//     try {
//         if(req.user.role!=="Visitor"){
//             return res.status(401).json({
//                 success:false,
//                 message:'This is a protected route for students'
//             })
//         }
//         next();
//     } catch (error) {
//         return res.status(500).json({
//             success:false,
//             message:'User Role is not matching',
//         })
//     }
// }