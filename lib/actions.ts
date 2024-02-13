import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/webp", "image/png"];

const maxFileSize = 1048576 * 10; // 1 MB

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getObjectURL(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command);
  return { success: { url } };
}

export async function putObjectURL({
  key,
  fileType,
  fileSize,
}: {
  key: string;
  fileType: string;
  fileSize: number;
}) {
  if (!allowedFileTypes.includes(fileType)) {
    return { failure: "File type not allowed" };
  }

  if (fileSize > maxFileSize) {
    return { failure: "File size too large" };
  }
  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
    ContentLength: fileSize,
    Metadata: {},
  });

  const url = await getSignedUrl(s3Client, command);
  return { success: { url } };
}

export async function listObjectURL() {
  const command = new ListObjectsV2Command({
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
  });

  const url = await getSignedUrl(s3Client, command);
  return { success: { url } };
}

export async function deleteObjectURL(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: key,
  });

  await getSignedUrl(s3Client, command);
}
