import { connectDB } from "@/app/lib/db";
import mongoose from "mongoose";
 
 const schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            maxLength: 500,
        },
        img: {
            type: String,
            default: "",
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
         bookmarks: [
             {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "User",
             },
         ],
        comments: [
            {
                text: {
                    type: String,
                    required: true,
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
 );

 connectDB();
 
 export const Post = mongoose.models.Post || mongoose.model("Post", schema);