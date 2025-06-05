import { connectDB } from "@/app/lib/db";
import mongoose from "mongoose";
 
 const schema = new mongoose.Schema(
 	{
 		from: {
 			type: mongoose.Schema.Types.ObjectId,
 			ref: "User",
 			required: true,
 		},
 		to: {
 			type: mongoose.Schema.Types.ObjectId,
 			ref: "User",
 			required: true,
 		},
 		type: {
 			type: String,
 			required: true,
 			enum: ["follow", "like"],
 		},
 		read: {
 			type: Boolean,
 			default: false,
 		},
 	},
 	{ timestamps: true }
 );
 

 // Connect once when the model is imported
 connectDB();
 
 
 // Create the Blog model
 export const Notification = mongoose.models.Notification || mongoose.model('Notification', schema);
