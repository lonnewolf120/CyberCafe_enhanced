const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        const options = { folder, resource_type: 'image' };
        if (height) options.height = height;
        if (quality) options.quality = quality;

        // options.resourse_type = 'auto';
        console.log("file.tempFilePath = ", file.tempFilePath, "options = ", options, "folder = ", folder);
        options.resource_type = 'auto';
        const res = cloudinary.uploader.upload(file.tempFilePath, options);
        return res;
    }
    catch (error) {
        console.log("Error while uploading image");
        console.log(error);
    }
}



// Function to delete a resource by public ID
exports.deleteResourceFromCloudinary = async (url) => {
    if (!url) return;

    try {
        const result = await cloudinary.uploader.destroy(url);
        console.log(`Deleted resource with public ID: ${url}`);
        console.log('Delete Resourse result = ', result)
        return result;
    } catch (error) {
        console.error(`Error deleting resource with public ID ${url}:`, error);
        throw error;
    }
};