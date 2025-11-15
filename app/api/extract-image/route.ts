import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File must be an image (PNG, JPG, JPEG)' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    let imageBuffer = Buffer.from(bytes);

    // Compress image if larger than 900KB to ensure it's under 1MB limit
    const maxSizeKB = 900;
    if (imageBuffer.length > maxSizeKB * 1024) {
      console.log(`Image too large (${Math.round(imageBuffer.length / 1024)}KB), compressing...`);
      
      // Resize and compress the image while maintaining quality for OCR
      imageBuffer = await sharp(imageBuffer)
        .resize(3000, 3000, { // Larger max dimensions to preserve text clarity
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ 
          quality: 92, // Higher quality for better OCR accuracy
          chromaSubsampling: '4:4:4' // Better quality
        })
        .toBuffer();
      
      console.log(`Compressed to ${Math.round(imageBuffer.length / 1024)}KB`);
      
      // If still too large, try more aggressive compression
      if (imageBuffer.length > maxSizeKB * 1024) {
        console.log('Still too large, applying more compression...');
        imageBuffer = await sharp(imageBuffer)
          .jpeg({ quality: 80 })
          .toBuffer();
        console.log(`Final size: ${Math.round(imageBuffer.length / 1024)}KB`);
      }
    }

    const base64Image = imageBuffer.toString('base64');

    // Use OCR.space free API with API key
    const ocrFormData = new FormData();
    ocrFormData.append('base64Image', `data:image/jpeg;base64,${base64Image}`);
    ocrFormData.append('language', 'eng');
    ocrFormData.append('isOverlayRequired', 'false');
    ocrFormData.append('detectOrientation', 'true');
    ocrFormData.append('scale', 'true');
    ocrFormData.append('OCREngine', '2');

    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': 'K87899142388957', // Free public API key
      },
      body: ocrFormData,
    });

    if (!ocrResponse.ok) {
      const errorText = await ocrResponse.text();
      console.error('OCR API error:', errorText);
      throw new Error(`OCR API request failed: ${ocrResponse.status}`);
    }

    const ocrResult = await ocrResponse.json();
    console.log('OCR Result:', JSON.stringify(ocrResult, null, 2));

    if (ocrResult.IsErroredOnProcessing) {
      throw new Error(ocrResult.ErrorMessage?.[0] || 'OCR processing failed');
    }

    const text = ocrResult.ParsedResults?.[0]?.ParsedText?.trim() || '';

    if (!text) {
      // Provide a more helpful error message
      console.warn('OCR returned no text. This could mean:');
      console.warn('- The image does not contain readable text');
      console.warn('- The text is too small or blurry');
      console.warn('- The image is a graphic/logo without text');
      
      return NextResponse.json(
        { error: 'No text could be extracted from the image. Please ensure the image contains clear, readable text.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('OCR extraction error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract text from image' },
      { status: 500 }
    );
  }
}
