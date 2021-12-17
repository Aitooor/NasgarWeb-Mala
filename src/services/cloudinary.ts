import * as cloudinary from "cloudinary";
import * as CONFIG from "../../config";
import * as logger from "../lib/logger";
import { UploadedFile } from "express-fileupload";

const PREFIX = "&1;45 CLOUDINARY &0&38;5;8";

export interface CLDImage {
  public_id: string;
  version: number;
  url: string;
}

export type CLDResult = CLDImage;

export function configure() {
  cloudinary.v2.config(CONFIG.CLOUDINARY);
  logger.log(PREFIX, "Cloudinary configured");
}

export function upload(
  file: string | UploadedFile,
  options: cloudinary.UpdateApiOptions
): Promise<cloudinary.UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const path = typeof file === "string" ? file : file.tempFilePath;
    cloudinary.v2.uploader.upload(path, { ...options, unique_filename: true }, (err, result) => {
      if (err) {
        logger.error(PREFIX, err);
        reject(err);
      } else {
        logger.log(PREFIX, result);
        resolve(result);
      }
    });
  });
}

export function getData(publicId: string): Promise<CLDResult> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.search
      .expression(`public_id=${publicId}`)
      .execute()
      .then((res: cloudinary.ResourceApiResponse) => {
        logger.log(PREFIX, `Getted data: ${publicId}`);
        if(res.resources.length === 0) {
          return null;
        }
        resolve({
          public_id: res.resources[0].public_id,
          version: res.resources[0].version,
          url: res.resources[0].secure_url,
        });
      })
      .catch((err) => {
        logger.error(PREFIX, err);
        reject(err);
      });
  });
}

export function deleteData(
  publicId: string
): Promise<cloudinary.DeleteApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, (err, result) => {
      if (err) {
        logger.error(PREFIX, err);
        reject(err);
      } else {
        logger.log(PREFIX, result);
        resolve(result);
      }
    });
  });
}

//#region Images
export function getAllImages(): Promise<CLDImage[]> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.search
      .expression("folder:images/*")
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute()
      .then((result: cloudinary.ResourceApiResponse) => {
        logger.log(PREFIX, "Getted all images");
        resolve(
          result.resources.map((r) => ({
            public_id: r.public_id,
            version: r.version,
            url: r.url,
          }))
        );
      })
      .catch((err) => {
        logger.error(PREFIX, err);
        reject(err);
      });
  });
}
//#endregion
