
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

module.exports = (req, res) => {

    console.log(req)

    const { user } = req.params;
    const { file } = req;
    
    cloudinary.uploader.upload(file.path, (err, result) => {
        if (err) {
        return res.status(500).json({
            message: "Error uploading image to cloudinary server",
            error: err
        });
        }
    
        User.findByIdAndUpdate( user.id , {
        $set: {
            profilePicture: result.secure_url
        }
        }, { new: true }, (err, user) => {
        if (err) {
            return res.status(500).json({
            message: "Error updating user profile picture",
            error: err
            });
        }
    
        return res.status(200).json({
            message: "User profile picture updated successfully",
            data: user
        });
        });
    });

}