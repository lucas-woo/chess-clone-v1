import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadedImageData {
  url: string,
  publicID: string
}

export const uploadImage = async(image: string): Promise<null | UploadedImageData> => {
  try {
    const uploaded = await cloudinary.uploader.upload(image, {
      folder: "chess-images",
      transformation: [
        { width: 150, height: 150, crop: "fill", gravity: "auto" }, 
        { quality: "auto:good" },
      ],
    })
    if(!uploaded.secure_url || !uploaded.public_id) throw new Error()
    
    return {
      url: uploaded.secure_url,
      publicID: uploaded.public_id
    }
  } catch (e) {
    return null
  }
}

export const deleteImage = async (publicID: string): Promise<boolean> => {
  try {
    const deleted = await cloudinary.uploader.destroy(publicID)
    if(!deleted) throw new Error
    return true
  } catch (e) {
    return false
  }
}