const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage(); // Store file in memory for Cloudinary upload

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [".pdf", ".png", ".jpg", ".jpeg"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedFileTypes.includes(ext)) {
      return cb(new Error("Only .pdf, .png, .jpg, and .jpeg formats are allowed"));
    }
    cb(null, true);
  },
});

module.exports = upload;
