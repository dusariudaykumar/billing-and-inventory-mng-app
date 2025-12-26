/* eslint-disable no-console */
import { uploadFileToCloudinary } from '@/lib/cloudinary';
import { withAuth } from '@/middleware/with-auth-api-middleware';
import { NextApiRequest, NextApiResponse } from 'next';

interface ShareLinkRequest extends NextApiRequest {
  body: {
    invoiceId: string;
    fileBase64: string; // Base64 encoded file (image or pdf)
    invoiceNumber: string;
    fileType?: string; // e.g., 'jpg', 'pdf'
  };
}

async function handler(req: ShareLinkRequest, res: NextApiResponse) {
  console.log('[Share API] Request received:', {
    method: req.method,
    hasBody: !!req.body,
    bodyKeys: req.body ? Object.keys(req.body) : [],
  });

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  }

  try {
    console.log('[Share API] Extracting request body...');
    // Accept either pdfBase64 (legacy) or fileBase64
    const { fileBase64, invoiceNumber, invoiceId, fileType = 'jpg' } = req.body;
    const base64Data = fileBase64;

    console.log('[Share API] Request data:', {
      invoiceId,
      invoiceNumber,
      hasFile: !!base64Data,
      fileLength: base64Data?.length || 0,
      fileType,
    });

    if (!base64Data) {
      return res.status(400).json({
        success: false,
        message: 'File data is required',
      });
    }

    console.log('[Share API] Converting base64 to buffer...');
    const fileBuffer = Buffer.from(base64Data, 'base64');

    // Generate filename
    const extension = fileType.replace('.', '');
    const fileName = `Invoice_${
      invoiceNumber || 'Unknown'
    }_${Date.now()}.${extension}`;
    console.log('[Share API] Generated filename:', fileName);

    // Upload to Cloudinary
    console.log('[Share API] Starting Cloudinary upload...');
    const shareableLink = await uploadFileToCloudinary(fileBuffer, fileName);

    console.log('[Share API] Upload successful:', {
      shareableLink,
      fileName,
    });

    return res.status(200).json({
      success: true,
      data: {
        shareableLink,
        fileName,
      },
    });
  } catch (error: any) {
    console.error('[Share API] Error occurred:', {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload file',
    });
  }
}

// Increase body size limit to 10MB (for large PDF files)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default withAuth(handler);
