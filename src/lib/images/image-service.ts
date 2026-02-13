import { CloudinaryProvider } from "./providers/cloudinary.provider";
import { ImageProvider } from "./image-provider.interface";

function getProvider(): ImageProvider {
  const provider = process.env.IMAGE_PROVIDER ?? "cloudinary";

  if (provider === "cloudinary") {
    return new CloudinaryProvider();
  }

  throw new Error(`Proveedor de imagen no soportado: ${provider}`);
}

export const ImageService = {
  async upload(file: File) {
    const provider = getProvider();
    return provider.upload(file);
  },

  async delete(key: string) {
    const provider = getProvider();
    return provider.delete(key);
  },

  async deleteMany(keys: string[]) {
    const provider = getProvider();
    return provider.deleteMany(keys);
  },
};
