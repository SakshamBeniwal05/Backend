import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    channel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subscriber:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Subscription = mongoose.model("Subscription",subscriptionSchema)