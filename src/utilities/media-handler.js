const cloudinary = require('cloudinary').v2;

exports.uploadFileToCloudinary = async (req, folder_name, resource_type) => {

    let transformations;
    
    if(folder_name === 'user')
        transformations = {
            quality: 60,
            crop: 'scale',
            height: 250,
            width: 250
        }

    return new Promise((resolve, reject) => {
        const upload_stream_cloudinary = cloudinary.uploader.upload_stream({
            folder: folder_name,
            resource_type: resource_type,
            transformation: transformations
        }, (err, result) => {
            if(err)
            {
                console.log(err);
                reject(err);
            }
            resolve(result);
        });
        upload_stream_cloudinary.end(req.file.buffer);
    });
}

exports.deleteFileFromCloudinary = async (public_id) => {

    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, (err, result) => {
            if(err)
                reject(err);
            resolve(result);
        });
    });
}