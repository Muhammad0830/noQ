import multer from "multer";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  }
});
