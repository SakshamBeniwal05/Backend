import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv";
import apiError from "../utils/error.utlis.js";

dotenv.config({ path: "./.env" });
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinary_Upload = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const cloudinary_Update = async (current_Url, newFile) => {
    
    try {

        function extractor(url) {
            const cleanUrl = url.replace(/^https?:\/\//, "");
            const array = cleanUrl.split("/")
            const filename = array.pop();
            const product_id = filename.split(".")[0];
            return product_id;
        }

        if(!current_Url) throw new apiError(400, "invalid product id")
        const current_product_id = extractor(current_Url)

        if(!newFile) throw new apiError(400,"file missing")
        const response = await cloudinary.uploader.upload(newFile,
            {
                public_id: current_product_id,
                overwrite: true,
                resource_type: "auto"
            })

        fs.unlinkSync(newFile)
        return response;

    } catch (error) {
        fs.unlinkSync(newFile)
        throw new apiError(500,"update file failed")
    }
}
