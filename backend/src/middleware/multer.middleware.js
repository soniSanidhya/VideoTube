// import fs from "fs";
// import multer from "multer";


// const tempDir = './public/temp';
// if (!fs.existsSync(tempDir)) {
//     fs.mkdirSync(tempDir, { recursive: true });
// }
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         try {
//             console.log("Multer middleware called");
//             cb(null, './public/temp'); // ensure this directory exists
//         } catch (error) {
//             console.error("Error in destination:", error);
//             cb(error); // pass the error to multer if something goes wrong
//         }
//     },
//     filename: function (req, file, cb) {
//         try {
//             cb(null, file.originalname); // Ensure file.originalname exists
//         } catch (error) {
//             console.error("Error in filename:", error);
//             cb(error);
//         }
//     }
// });


// // const storage = multer.diskStorage(
// //     {
// //         destination : function (req , file , cb) {
// //             try {
// //                 console.log("multter middleware called");
                
// //                 cb(null , './public/temp');
// //             } catch (error) {
// //                 console.log(error);
                
// //             }
// //         },
// //         filename : function (req , file ,cb) {
// //             try {
// //                 cb(null , file.originalname);
// //             } catch (error) {
// //                 console.log(error);
                
// //             }
// //         }
// //     }
// // )



// export const upload = multer({
//     storage
// })

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Ensure upload directory exists
// const uploadDir = "./public/temp";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     // Add file extension handling
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ 
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 5MB limit
    }
});
