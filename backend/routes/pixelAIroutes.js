import express, { response } from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_APIKEY,
});

var openAi = new OpenAIApi(configuration);

router.get("/", (req, res) => {
  res.send("Hello from PixelAI");
});

// router.route("/").get((req, res) => {
//   res.send("Hello from PixelAI");
// });

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt)
    const aiResponse = await openAi.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });
    // console.log(aiResponse);
    const image = aiResponse.data.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.log(error);
    res.status(500).send(error?.response.data.error.message);
  }
});

export default router;
