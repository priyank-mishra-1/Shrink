import express from "express";
import "dotenv/config";
import morgan from "morgan";
import { __dirname, upload } from "./multer-config.js";
import { encoding, decoding } from "../encode-decode.js";

const PORT = process.env.PORT | 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/upload-file", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false,
    });
  } else {
    console.log("file received");
    const host = req.hostname;
    const filePath = req.protocol + "://" + host + "/" + req.file.path;
    return res.send({
      success: true,
      filePath,
    });
  }
});

app.get("/encode", async (req, res) => {
  try {
    await encoding(
      `${__dirname}/uploads/file.txt`,
      `${__dirname}/compressed/compressed.bin`
    );
    res.send({
      success: true,
      message: "file encoded",
    });
  } catch (error) {
    console.log("error in encoding file");
    res.send({
      success: false,
      message: "error in encoding file",
    });
  }
});

app.get("/encode/download", (req, res) => {
  const file = `${__dirname}/compressed/compressed.bin`;
  res.download(file);
});

app.get("/decode", async (req, res) => {
  try {
    await decoding(
      `${__dirname}/compressed/compressed.bin`,
      `${__dirname}/extracted/file.txt`
    );
    res.send({
      success: true,
      message: "file extracted",
    });
  } catch (error) {
    console.log("error in decoding file");
    res.send({
      success: false,
      message: "error in decoding file",
    });
  }
});

app.get("/decode/download", (req, res) => {
  const file = `${__dirname}/extracted/file.txt`;
  res.download(file);
});

app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
});
