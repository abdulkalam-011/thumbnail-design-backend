import { v2 as cloudinary } from 'cloudinary';


const connectCloudinary =async () => { 
  try {
  const clodinaryConn =  cloudinary.config({ 
        cloud_name: `${process.env.CLODINARY_CLOUD_NAME}`, 
        api_key: `${process.env.CLODINARY_API_KEY}`, 
        api_secret: `${process.env.CLODINARY_API_SECRET}` 
    }); 
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connected:', result);
  } catch (error) {
    console.error('Cloudinary connection error:', error);
  }
}

export default connectCloudinary;