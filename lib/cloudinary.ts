import logger from '@/lib/logger';
import { v2 as cloudinary } from 'cloudinary';

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER,
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  logger('[Cloudinary] Missing Cloudinary environment variables');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<string> => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      'Cloudinary env vars are missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.'
    );
  }

  const folder = CLOUDINARY_FOLDER || 'invoices';
  // Attempt to remove extension from public_id so Cloudinary doesn't double it if we set format
  const publicId = fileName.replace(/\.[^/.]+$/, '');

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // Auto-detect image vs raw/pdf
        type: 'upload',
        access_mode: 'public',
        folder,
        public_id: publicId,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          logger(error, '[Cloudinary] Upload error:');
          reject(new Error(error.message || 'Cloudinary upload failed'));
          return;
        }
        if (!result?.secure_url) {
          reject(new Error('Cloudinary did not return a secure_url'));
          return;
        }
        logger(
          {
            url: result.secure_url,
            bytes: result.bytes,
            format: result.format,
          },
          '[Cloudinary] Upload success:'
        );
        // Append flag usually used for download? specific to usage.
        // For images, we might just want the direct link.
        // Keeping it compatible with previous return style, but image might not need attachment flag to be viewable.
        // Actually, for viewing in WhatsApp, a direct image link is best.
        // Append flag to force download when visited
        resolve(`${result.secure_url}?fl_attachment=true`);
      }
    );

    uploadStream.end(fileBuffer);
  });
  // ... existing code ...
};

export const deleteOldFiles = async (
  days = 7
): Promise<{
  success: boolean;
  deletedCount: number;
  deletedIds: string[];
  message?: string;
}> => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary env vars missing');
  }

  const folder = CLOUDINARY_FOLDER || 'invoices';
  // Calculate cutoff date
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  logger(
    `[Cloudinary Cleanup] Starting cleanup for files older than ${days} days (before ${cutoffDate.toISOString()})`
  );

  try {
    // Using Search API (Admin API)
    const result = await cloudinary.search
      .expression(
        `folder:${folder} AND created_at < ${
          cutoffDate.toISOString().split('T')[0]
        }`
      )
      .max_results(100)
      .execute();

    const resources = result.resources || [];

    if (resources.length === 0) {
      logger('[Cloudinary Cleanup] No old files found.');
      return { success: true, deletedCount: 0, deletedIds: [] };
    }

    const publicIds = resources.map((res: any) => res.public_id);
    logger(
      `[Cloudinary Cleanup] Found ${publicIds.length} files to delete:`,
      publicIds
    );

    // 2. Delete the files
    const deleteResult = await cloudinary.api.delete_resources(publicIds);
    logger('[Cloudinary Cleanup] Deletion result:', deleteResult);

    return {
      success: true,
      deletedCount: publicIds.length,
      deletedIds: publicIds,
    };
  } catch (error: any) {
    logger(error, '[Cloudinary Cleanup] Error:');
    return {
      success: false,
      deletedCount: 0,
      deletedIds: [],
      message: error.message,
    };
  }
};
