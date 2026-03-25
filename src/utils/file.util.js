import crypto from "crypto";

export const base64ToBuffer = (base64) => {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64");

  const mime = matches[1];
  const buffer = Buffer.from(matches[2], "base64");

  return { buffer, mime };
};

export const generateFileHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};