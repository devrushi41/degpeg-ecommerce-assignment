import multer from "multer";
import path from "path";
import { generateHash } from "random-hash";

// Config for multer
const storage = multer.diskStorage({
  destination: "./avatar",
  filename: async function (req, file, cb) {
    // hash the fileName
    let modFilename = generateHash({
      length: 20,
      charset:
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-",
    });
    modFilename += path.extname(file.originalname);
    cb(null, modFilename);
  },
});

function checkFile(file, cb) {
  // Allowed extensions
  const fileTypes = /jpeg|jpg|png|gif/;

  // Check extensions
  const isValidExtName = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMimeType = fileTypes.test(file.mimetype);

  if (isValidExtName && isValidMimeType) {
    return cb(null, true);
  } else {
    let error = new Error();
    error.code = "INVALID_FILE_TYPE";
    cb(error);
  }
}

var upload = multer({
  storage: storage,
  limits: { fileSize: 262144 }, // Max file size: 256kb
  fileFilter: function (req, file, cb) {
    checkFile(file, cb);
  },
}).single("avatar"); // name in form

module.exports = upload;
