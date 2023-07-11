import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
// import { Configuration, OpenAIApi } from "openai";
 
import Post from "../mongodb/models/posts.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

//get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

//create a post
router.post("/", async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    console.log(name, prompt, photo);
    const photoUrl = await cloudinary.uploader.upload(photo);
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });
    console.log(newPost);

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    // console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: error,
      });
  }
});

export default router;
