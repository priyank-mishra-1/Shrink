import express from "express";
import "dotenv/config";
import morgan from "morgan";
import path from "path";
import { upload, __dirname } from "./multer-config.js";
import { encoding, decoding } from "../encode-decode.js";
import cors from "cors";
import fs from "fs/promises";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST",
  })
);

const mainDir = path.dirname(__dirname);

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(mainDir, "/frontend/dist")));

app.get("*", (req, res) =>
  res.sendFile(path.join(mainDir, "/frontend/dist/index.html"))
);

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/upload-file", upload.single("file"), async (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false,
    });
  } else {
    console.log("File received");
    const uploadedFilePath = path.join(
      __dirname,
      "uploads",
      req.uploadedFileName
    );
    const host = req.hostname;
    const filePath = req.protocol + "://" + host + "/" + uploadedFilePath;

    return res.send({
      success: true,
      filePath,
      uploadedFileName: req.uploadedFileName,
    });
  }
});

app.get("/encode", async (req, res) => {
  try {
    const uploadedFilePath = path.join(
      __dirname,
      "uploads",
      req.query.uploadedFileName
    );
    const compressedFileName = `${
      path.parse(req.query.uploadedFileName).name
    }.bin`;
    const compressedFilePath = path.join(
      __dirname,
      "downloads",
      compressedFileName
    );

    const { huffmanTree, codes } = await encoding(
      uploadedFilePath,
      compressedFilePath
    );
    res.send({
      success: true,
      message: "File encoded",
      huffmanTree,
      codes,
    });
  } catch (error) {
    console.log("Error in encoding file", error);
    res.send({
      success: false,
      message: "Error in encoding file",
    });
  }
});

app.get("/encode/download", (req, res) => {
  try {
    const compressedFileName = `${
      path.parse(req.query.uploadedFileName).name
    }.bin`;
    const uploadedFilename = `${
      path.parse(req.query.uploadedFileName).name
    }.txt`;
    const file = path.join(__dirname, "downloads", compressedFileName);
    const uploadedFile = path.join(__dirname, "uploads", uploadedFilename);
    res.download(file, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ err: "error in downloading file" });
      } else {
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.log(`Error in deleting file: ${unlinkErr}`);
          }
        });
        fs.unlink(uploadedFile, (unlinkErr) => {
          if (unlinkErr) {
            console.log(`Error in deleting file: ${unlinkErr}`);
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: "error in downloading file",
    });
  }
});

app.get("/decode", async (req, res) => {
  try {
    const compressedFileName = `${
      path.parse(req.query.uploadedFileName).name
    }.bin`;
    const compressedFilePath = path.join(
      __dirname,
      "uploads",
      compressedFileName
    );
    const extractedFileName = `${
      path.parse(req.query.uploadedFileName).name
    }.txt`;
    const extractedFilePath = path.join(
      __dirname,
      "downloads",
      extractedFileName
    );

    console.log(compressedFileName);

    const { huffmanTree } = await decoding(
      compressedFilePath,
      extractedFilePath
    );
    res.send({
      success: true,
      message: "File extracted",
      huffmanTree,
    });
  } catch (error) {
    console.log("Error in decoding file", error);
    res.send({
      success: false,
      message: "Error in decoding file",
    });
  }
});

app.get("/decode/download", (req, res) => {
  try {
    const extractedFileName = `${
      path.parse(req.query.uploadedFileName).name
    }.txt`;
    const uploadedFilename = `${
      path.parse(req.query.uploadedFileName).name
    }.bin`;
    const file = path.join(__dirname, "downloads", extractedFileName);
    const uploadedFile = path.join(__dirname, "uploads", uploadedFilename);
    res.download(file, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ err: "error in downloading file" });
      } else {
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.log(`Error in deleting file: ${unlinkErr}`);
          }
        });
        fs.unlink(uploadedFile, (unlinkErr) => {
          if (unlinkErr) {
            console.log(`Error in deleting file: ${unlinkErr}`);
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: "error in downloading file",
    });
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
});
