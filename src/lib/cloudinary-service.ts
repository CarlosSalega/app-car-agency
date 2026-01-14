import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  static async deleteImage(
    url: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const publicId = this.extractPublicId(url);
      if (!publicId) {
        return { success: false, error: "Invalid Cloudinary URL" };
      }

      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === "ok" || result.result === "not found") {
        return { success: true };
      }

      return { success: false, error: result.result };
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      return { success: false, error: "Delete failed" };
    }
  }

  static async deleteMultipleImages(urls: string[]): Promise<{
    successful: number;
    failed: number;
  }> {
    const results = await Promise.allSettled(
      urls.map((url) => this.deleteImage(url)),
    );

    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.success,
    ).length;

    return {
      successful,
      failed: urls.length - successful,
    };
  }

  private static extractPublicId(url: string): string | null {
    try {
      const urlObj = new URL(url);

      if (!urlObj.hostname.includes("cloudinary.com")) {
        return null;
      }

      const match = urlObj.pathname.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  static getOptimizedUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      crop?: string;
    },
  ): string {
    return cloudinary.url(publicId, {
      fetch_format: "auto",
      quality: "auto",
      ...options,
    });
  }

  static getCachedUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      crop?: string;
      format?: string;
      quality?: string;
    },
  ): string {
    const transformations: string[] = [];

    if (options?.crop) {
      transformations.push(`c_${options.crop}`);
    }
    if (options?.width) {
      transformations.push(`w_${options.width}`);
    }
    if (options?.height) {
      transformations.push(`h_${options.height}`);
    }
    if (options?.format) {
      transformations.push(`f_${options.format}`);
    } else {
      transformations.push("f_auto");
    }
    if (options?.quality) {
      transformations.push(`q_${options.quality}`);
    } else {
      transformations.push("q_auto");
    }

    const transformString = transformations.join(",");
    const path = transformString
      ? `${transformString}/${publicId}`
      : publicId;

    return `/api/images/${path}`;
  }
}
