import express from 'express';
import { upload } from './multer.mjs';
import { bucket } from './firebase.mjs';

let router = express.Router()

// api to upload image on cloudinary
router.post('/upload', upload.any(), async (req, res, next) => {

    bucket.upload(
        req.files[0].path,
        {
            // give destination name
            destination: `profile-pictures/${req.files[0].filename}`,
        },
        function (err, file, apiResponse) {
            if (!err) {

                // get signed url
                file.getSignedUrl({

                    action: 'read',
                    expires: '04-12-2123' // file expiry time

                }).then(async (urlData, err) => {

                    if (!err) {

                        // this is public downloadable url 
                        console.log("url: ", urlData[0])

                        // remove locally saved file from server
                        fs.unlinkSync(req.files[0].path)

                        // send a response
                        res.send({
                            message: 'file uploaded successfully',
                            url: urlData[0]
                        })

                    }
                })
            } else {

                console.error(err)
                res.status(500).send({
                    message: 'server error, please try later',
                });

            }
        }
    );

});

export default router