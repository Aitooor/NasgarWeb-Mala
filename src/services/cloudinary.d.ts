import * as cloudinary from "cloudinary";
import { UploadedFile } from "express-fileupload";
export interface CLDImage {
    public_id: string;
    version: number;
    url: string;
}
export declare type CLDResult = CLDImage;
export declare function configure(): void;
export declare function upload(file: string | UploadedFile, options: cloudinary.UpdateApiOptions): Promise<cloudinary.UploadApiResponse>;
export declare function getData(publicId: string): Promise<CLDResult>;
export declare function deleteData(publicId: string): Promise<cloudinary.DeleteApiResponse>;
export declare function getAllImages(): Promise<CLDImage[]>;
