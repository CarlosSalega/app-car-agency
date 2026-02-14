export const CLOUDINARY_UPLOAD_OPTIONS = {
  folder: "car-agency",
  resource_type: "image" as const,

  quality: "auto" as const,

  fetch_format: "auto" as const,

  eager: [
    {
      width: 800,
      height: 600,
      crop: "fill" as const,
      gravity: "auto" as const,
      quality: "auto" as const,
      fetch_format: "auto" as const,
      flags: ["progressive"],
    },
    {
      width: 400,
      height: 300,
      crop: "fill" as const,
      gravity: "auto" as const,
      quality: "auto" as const,
      fetch_format: "auto" as const,
      flags: ["progressive"],
    },
  ],

  responsive_width: true,

  tags: ["car-agency", "vehicle"],
};

export const CLOUDINARY_RESPONSIVE_TRANSFORMS = "w_auto,dpr_auto,f_auto,q_auto,c_scale";

export const CLOUDINARY_SIZES = {
  thumbnail: {
    width: 200,
    height: 150,
  },
  mobile: {
    width: 400,
    height: 300,
  },
  tablet: {
    width: 600,
    height: 450,
  },
  desktop: {
    width: 800,
    height: 600,
  },
  fullscreen: {
    width: 1200,
    height: 900,
  },
};
