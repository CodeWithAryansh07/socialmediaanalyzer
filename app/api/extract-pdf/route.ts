import { NextRequest, NextResponse } from 'next/server';

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

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Check file size - OCR.space free tier has 1MB limit
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          error: `PDF is too large for text extraction (${(file.size / 1024 / 1024).toFixed(2)}MB). Please use a PDF with fewer pages or smaller size (max 1MB).` 
        },
        { status: 400 }
      );
    }

    // Convert PDF to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Pdf = buffer.toString('base64');

    console.log(`Processing PDF: ${file.name}, Size: ${(file.size / 1024).toFixed(2)}KB`);

    // Use OCR.space API which supports PDF files
    const ocrFormData = new FormData();
    ocrFormData.append('base64Image', `data:application/pdf;base64,${base64Pdf}`);
    ocrFormData.append('language', 'eng');
    ocrFormData.append('isOverlayRequired', 'false');
    ocrFormData.append('detectOrientation', 'true');
    ocrFormData.append('scale', 'true');
    ocrFormData.append('OCREngine', '2');
    ocrFormData.append('filetype', 'PDF');

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
      
      if (ocrResponse.status === 413) {
        return NextResponse.json(
          { error: 'PDF is too large. Please use a smaller PDF (max 1MB or 3-4 pages).' },
          { status: 400 }
        );
      }
      
      throw new Error(`OCR API request failed: ${ocrResponse.status}`);
    }

    const ocrResult = await ocrResponse.json();
    console.log('PDF OCR Result:', JSON.stringify(ocrResult, null, 2));

    if (ocrResult.IsErroredOnProcessing) {
      const errorMsg = ocrResult.ErrorMessage?.[0] || 'OCR processing failed';
      
      // Check for file size errors
      if (errorMsg.toLowerCase().includes('file size') || errorMsg.toLowerCase().includes('too large')) {
        return NextResponse.json(
          { error: 'PDF is too large. Please use a smaller PDF (max 1MB or 3-4 pages).' },
          { status: 400 }
        );
      }
      
      throw new Error(errorMsg);
    }

    // OCR.space can return multiple pages for PDFs
    let text = '';
    if (ocrResult.ParsedResults && ocrResult.ParsedResults.length > 0) {
      text = ocrResult.ParsedResults
        .map((result: any) => result.ParsedText)
        .join('\n\n')
        .trim();
    }

    if (!text) {
      return NextResponse.json(
        { error: 'No text could be extracted from the PDF. Please ensure the PDF contains readable text or try a smaller file.' },
        { status: 400 }
      );
    }

    console.log(`Successfully extracted ${text.length} characters from PDF`);
    return NextResponse.json({ text });
  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from PDF' },
      { status: 500 }
    );
  }
}
