import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postsRoutes.js";
import pixelAIRoutes from "./routes/pixelAIroutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));


app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/pixelai", pixelAIRoutes);

app.get("/", async (req, res) => {
    res.send("Hello from PixelAI");
  });

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(8080, () => {
      console.log(`server is listening on port: 8080`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
