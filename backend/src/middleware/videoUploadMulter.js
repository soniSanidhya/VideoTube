import cloudinaryModule from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
const cloudinary = cloudinaryModule.v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    resource_type: 'auto',  // Matches the previous setting for dynamic file types
    public_id: (req, file) => file.originalname.split('.')[0],  // Retain original file name as public ID
    // Optional: you could add folder here if needed
  },
});

const upload = multer({ storage });

export { upload };
