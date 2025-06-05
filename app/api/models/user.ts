import { connectDB } from '@/app/lib/db';
import mongoose from 'mongoose';

// Define the Blog Schema
const schema = new mongoose.Schema({
  fullName:{
    type: String,
    required: true,
  },
  username:{
    type: String,
    required: true,
    unique: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [
 			{
 				type: mongoose.Schema.Types.ObjectId,
 				ref: "User",
 				default: [],
 			},
 		],
 		following: [
 			{
 				type: mongoose.Schema.Types.ObjectId,
 				ref: "User",
 				default: [],
 			},
 		],
 		profileImg: {
 			type: String,
 			default: "",
 		},
 		coverImg: {
 			type: String,
 			default: "",
 		},
 		bio: {
 			type: String,
 			default: "",
 		},
 
 		link: {
 			type: String,
 			default: "",
 		},
		likedPosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
				default: [],
			},
		],
},
{ timestamps: true }
);

// Connect once when the model is imported
connectDB();


// Create the Blog model
export const User = mongoose.models.User || mongoose.model('User', schema);
