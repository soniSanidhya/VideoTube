import multer from "multer";


const storage = multer.diskStorage(
    {
        destination : function (req , file , cb) {
            console.log("multter middleware called");
            
            const fs = require('fs');
            const dir = './public/temp';
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null , dir);
        },
        filename : function (req , file ,cb) {
            cb(null , file.originalname);
        }
    }
)

export const upload = multer({
    storage
})