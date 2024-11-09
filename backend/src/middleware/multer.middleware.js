import multer from "multer";


const storage = multer.diskStorage(
    {
        destination : function (req , file , cb) {
            try {
                console.log("multter middleware called");
                
               
                const dir = './public/temp';
                
                cb(null , dir);
            } catch (error) {
                console.log(error);
                
            }
        },
        filename : function (req , file ,cb) {
            try {
                cb(null , file.originalname);
            } catch (error) {
                console.log(error);
                
            }
        }
    }
)

export const upload = multer({
    storage
})