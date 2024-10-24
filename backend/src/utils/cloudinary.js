import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
// Configuration
cloudinary.config({
    // cloud_name: "human404",
    // api_key: "445422384561518",
    // api_secret: "9re6WCoXltvBS2UQURmogzMGDgA"

    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // // console.log("name ",process.env.CLOUD_NAME);
        // // console.log("key ",process.env.API_KEY);
        // // console.log("Secret",process.env.API_SECRET_KEY);

        // console.log(" upload", localFilePath);
        // console.log("uploading");
        
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // console.log("file is Uploaded on cloudinary", response);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        // console.log(error);

        // fs.unlinkSync(localFilePath);
        await safeUnlink(localFilePath);
        return null;
    }
};

const extractPublicId = (url) => {
    const parts = url.split("/");
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split(".")[0];
    return publicId;
};

const deleteFromCloudinary = async (url) => {
    try {
        if (!url) return ;
        const publicId = extractPublicId(url);
        if (!publicId) return ;
        const response = await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        // console.log(error);
    }
};
const safeUnlink = async (filePath) => {
    try {
        fs.unlinkSync(filePath);
    } catch (error) {
        // console.log(`Failed to delete file: ${filePath}`, error);
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
