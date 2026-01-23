import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;
const PUBLIC_BASE_URL = process.env.DIGEST_PUBLIC_BASE_URL;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  console.warn("R2 environment variables missing. Storage operations will fail.");
}

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
});

export const r2 = {
  /**
   * Upload JSON to R2
   */
  async uploadJson(key: string, data: any) {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: JSON.stringify(data),
      ContentType: "application/json",
    });
    await S3.send(command);
    return `${PUBLIC_BASE_URL}/${key}`;
  },

  /**
   * Get JSON from R2 (Internal/Private usage)
   * For public data, prefer fetching via PUBLIC_BASE_URL in the frontend
   */
  async getJson<T>(key: string): Promise<T | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      });
      const response = await S3.send(command);
      const str = await response.Body?.transformToString();
      return str ? JSON.parse(str) : null;
    } catch (error) {
      console.warn(`Failed to fetch ${key} from R2:`, error);
      return null;
    }
  },

  /**
   * Helper to fetch the public JSON (faster, CDN cached)
   */
  async fetchPublicJson<T>(key: string): Promise<T | null> {
    try {
      const res = await fetch(`${PUBLIC_BASE_URL}/${key}?t=${Date.now()}`, { 
        next: { revalidate: 60 } 
      } as any);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};