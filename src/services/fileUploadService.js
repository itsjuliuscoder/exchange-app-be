require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");
// const streamifier = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const streamifier = require("streamifier");

const uploadFile = async (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: folder,
          },
          (error, result) => {
            if (error) {
              return reject(error.message);
            }
            resolve(result);
          }
        );
        
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

module.exports = { uploadFile };

module.exports = uploadFile;
