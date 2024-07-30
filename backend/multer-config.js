import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, `${__dirname}/uploads`);
  },
  filename: function (req, file, callback) {
    callback(null, `${file.fieldname}.txt`);
  },
});

const upload = multer({
  storage,
});

export { upload, __dirname };
