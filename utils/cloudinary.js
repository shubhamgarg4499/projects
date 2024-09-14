const cloudinary = require('cloudinary').v2
const fs = require('fs')
require('dotenv').config()
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret // Click 'View Credentials' below to copy your API secret
});
async function uploadFileonCloudinary(filePath) {
    try {
        const fileUrl = await cloudinary.uploader.upload(filePath, { resource_type: "auto" })
        if (fileUrl) {
            fs.unlinkSync(filePath)
        }
        return fileUrl
    } catch (error) {
        fs.unlinkSync(filePath)
        throw new Error(error)
    }
}
async function publicIdtoLink(public_id) {
    const link = await cloudinary.url(public_id)
    return link
}
async function deleteImagefromCloudinary(imagelink) {
    try {
        let link = imagelink.split('/')
        link = link[link.length - 1].split('.')[0]
        await cloudinary.uploader.destroy(link)
    } catch (error) {
        throw new Error(error)
    }
}
module.exports = { uploadFileonCloudinary, deleteImagefromCloudinary, publicIdtoLink }