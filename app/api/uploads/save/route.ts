// API to save upload to MongoDB
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Upload from '@/app/models/Upload';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { fileName, fileType, fileSize, imageData, extractedText, analysis } = await request.json();

    await dbConnect();

    const upload = await Upload.create({
      userId: session.user.id,
      fileName,
      fileType,
      fileSize,
      imageData,
      extractedText,
      analysis,
    });

    return NextResponse.json({ success: true, uploadId: upload._id });
  } catch (error) {
    console.error('Failed to save upload:', error);
    return NextResponse.json(
      { error: 'Failed to save upload' },
      { status: 500 }
    );
  }
}
