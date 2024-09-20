import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, callback) {
    const uniqueName = uuidv4();
    const ext = path.extname(file.originalname);
    req.uploadedFileName = `${uniqueName}${ext}`;
    callback(null, req.uploadedFileName);
  },
});

const upload = multer({
  storage,
});

export { upload, __dirname };
