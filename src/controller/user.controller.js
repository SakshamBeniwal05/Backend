import asyncHandler from "../utils//async.utils.js"


const test = asyncHandler((req,res)=>{
    res.status(200).json({
        message:"hello_world"
    })
})

export {test}