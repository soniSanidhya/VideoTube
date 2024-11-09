// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import dotenv from "dotenv";

// dotenv.config();
// // Configuration
// cloudinary.config({
//     // cloud_name: "human404",
//     // api_key: "445422384561518",
//     // api_secret: "9re6WCoXltvBS2UQURmogzMGDgA"

//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET_KEY,
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         // // console.log("name ",process.env.CLOUD_NAME);
//         // // console.log("key ",process.env.API_KEY);
//         // // console.log("Secret",process.env.API_SECRET_KEY);

//         // console.log(" upload", localFilePath);
//         // console.log("uploading");
        
//         if (!localFilePath) return null;

//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto",
//         });

//         // console.log("file is Uploaded on cloudinary", response);
//         fs.unlinkSync(localFilePath);
//         return response;
//     } catch (error) {
//         // console.log(error);

//         // fs.unlinkSync(localFilePath);
//         await safeUnlink(localFilePath);
//         return null;
//     }
// };

// const extractPublicId = (url) => {
//     const parts = url.split("/");
//     const publicIdWithExtension = parts[parts.length - 1];
//     const publicId = publicIdWithExtension.split(".")[0];
//     return publicId;
// };

// const deleteFromCloudinary = async (url) => {
//     try {
//         if (!url) return ;
//         const publicId = extractPublicId(url);
//         if (!publicId) return ;
//         const response = await cloudinary.uploader.destroy(publicId);
//     } catch (error) {
//         // console.log(error);
//     }
// };
// const safeUnlink = async (filePath) => {
//     try {
//         fs.unlinkSync(filePath);
//     } catch (error) {
//         // console.log(`Failed to delete file: ${filePath}`, error);
//     }
// };

// export { uploadOnCloudinary, deleteFromCloudinary };

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import stream from "stream";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY,
});

const uploadOnCloudinary = async (file) => {
    try {
        if (!file) return null;

        // Create a promise to handle the upload
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        return reject(error);
                    }
                    resolve(result);
                }
            );

            // const stream = require('stream');
            // const stream = require('stream');
            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);
            bufferStream.pipe(uploadStream);
        });
    } catch (error) {
        console.error("Error in uploadOnCloudinary:", error);
        return null;
    }
};

const extractPublicId = (url) => {
    if (!url) return null;
    try {
        const parts = url.split("/");
        const publicIdWithExtension = parts[parts.length - 1];
        const publicId = publicIdWithExtension.split(".")[0];
        return publicId;
    } catch (error) {
        console.error("Error extracting public ID:", error);
        return null;
    }
};

const deleteFromCloudinary = async (url) => {
    try {
        if (!url) return;
        const publicId = extractPublicId(url);
        if (!publicId) return;
        
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };