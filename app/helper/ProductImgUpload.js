const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/product/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const uploadProductImage = multer({
  storage: storage,
  fileFilter: function (req, files, callback) {
    if (
      files.mimetype == "image/png" ||
      files.mimetype == "image/jpg" ||
      files.mimetype == "image/jpeg"
    ) {
      callback(null, true);
    } else {
      console.log("select valid image format");
      callback(null, false);
    }
  },
  limits: {
    fieldSize: 1024 * 1024 * 2,
  },
});

module.exports = uploadProductImage;
