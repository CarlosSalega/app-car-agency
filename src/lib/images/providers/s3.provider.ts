import { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { ImageProvider } from "../image-provider.interface";

const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  ...(process.env.S3_ENDPOINT && { endpoint: process.env.S3_ENDPOINT }),
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const PUBLIC_BASE_URL = process.env.S3_PUBLIC_BASE_URL!;

export class S3Provider implements ImageProvider {
  async upload(file: File): Promise<{ key: string; url: string }> {
    try {
      // Generar key único
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split(".").pop() || "jpg";
      const key = `car-agency/${timestamp}-${randomString}.${fileExtension}`;

      // Convertir File a buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Subir a S3
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || "image/jpeg",
        // Para buckets públicos
        ACL: "public-read",
      });

      await s3Client.send(command);

      return {
        key,
        url: `${PUBLIC_BASE_URL}/${key}`,
      };
    } catch (error) {
      console.error("S3 upload error:", error);
      throw new Error("Error al subir imagen a S3");
    }
  }

  async delete(key: string): Promise<{ success: boolean; error?: string }> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);

      return { success: true };
    } catch (error) {
      console.error("S3 delete error:", error);
      return { success: false, error: "Delete failed" };
    }
  }

  async deleteMany(keys: string[]) {
    try {
      const command = new DeleteObjectsCommand({
        Bucket: BUCKET_NAME,
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
        },
      });

      const result = await s3Client.send(command);

      return {
        successful: result.Deleted?.length || 0,
        failed: result.Errors?.length || 0,
      };
    } catch (error) {
      console.error("S3 deleteMany error:", error);
      return {
        successful: 0,
        failed: keys.length,
      };
    }
  }
}
