import ImageKit from "@imagekit/nodejs";
import "server-only";

export type StorageScope = "public" | "private";

export interface UploadedAsset {
  /** شناسه داخلی ImageKit؛ برای حذف فایل باید در دیتابیس ذخیره شود. */
  fileId: string;
  /** مسیر فایل در ImageKit؛ برای تولید URL خصوصی استفاده می‌شود. */
  filePath: string;
  /** URL فایل. برای فایل خصوصی، URL خام را مستقیماً به کاربر ندهید. */
  url: string;
  name: string;
  size: number;
}

export interface AssetMetadata {
  description?: string;
  tags?: string[];
  customMetadata?: Record<string, string | number | boolean>;
}

import { getCloudflareContext } from "@opennextjs/cloudflare";

type ImageKitEnvName = "IMAGEKIT_PRIVATE_KEY" | "IMAGEKIT_URL_ENDPOINT";

function requiredEnv(name: ImageKitEnvName): string {
  let value = process.env[name]?.trim();

  if (!value) {
    try {
      const context = getCloudflareContext() as unknown as {
        env?: Record<string, string | undefined>;
      };
      value = context?.env?.[name]?.trim();
    } catch {
      // Ignore if outside Cloudflare context
    }
  }

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function normalizeFolder(value: string | undefined, fallback: string): string {
  const normalized = (value?.trim() || fallback)
    .replace(/\\/g, "/")
    .replace(/\/{2,}/g, "/");

  return `/${normalized.replace(/^\/+|\/+$/g, "")}`;
}

function folderFor(scope: StorageScope): string {
  return scope === "public"
    ? normalizeFolder(process.env.IMAGEKIT_PUBLIC_FOLDER, "/blog-images")
    : normalizeFolder(process.env.IMAGEKIT_PRIVATE_FOLDER, "/client-documents");
}

function safePathPart(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/[^\p{L}\p{N}._-]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function safeFileName(value: string): string {
  return safePathPart(value) || `file-${crypto.randomUUID()}`;
}

function childFolder(base: string, child?: string): string {
  if (!child) {
    return base;
  }

  const safeChild = child
    .replace(/\\/g, "/")
    .split("/")
    .map(safePathPart)
    .filter(Boolean)
    .join("/");

  return safeChild ? `${base}/${safeChild}` : base;
}

function uploadedFileSize(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

let client: ImageKit | undefined;

function imageKit(): ImageKit {
  client ??= new ImageKit({
    privateKey: requiredEnv("IMAGEKIT_PRIVATE_KEY"),
    maxRetries: 2,
    timeout: 30_000,
  });

  return client;
}

function isCustomMetadataSchemaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");

  return /custom.?metadata|metadata field|field.*(exist|invalid|required)/i.test(
    message,
  );
}

/**
 * فایل را مستقیماً از Server Action یا Route Handler در ImageKit آپلود می‌کند.
 * اسناد scope=private به‌صورت خصوصی ذخیره می‌شوند و URL خام آن‌ها نباید
 * مستقیماً در اختیار کاربر قرار بگیرد.
 */
export async function uploadAsset(
  scope: StorageScope,
  file: File,
  options: AssetMetadata & {
    folder?: string;
    fileName?: string;
  } = {},
): Promise<UploadedAsset> {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("EMPTY_UPLOAD_FILE");
  }

  const uploadFileName = safeFileName(options.fileName || file.name);

  const params: ImageKit.FileUploadParams = {
    file,
    fileName: uploadFileName,
    folder: childFolder(folderFor(scope), options.folder),
    isPrivateFile: scope === "private",
    useUniqueFileName: true,
    description: options.description,
    tags: options.tags,
    customMetadata: options.customMetadata,
  };

  let uploaded: ImageKit.FileUploadResponse;

  try {
    uploaded = await imageKit().files.upload(params);
  } catch (error) {
    // اگر فیلدهای Custom Metadata هنوز در داشبورد ImageKit ساخته نشده باشند،
    // خود آپلود را از دست نمی‌دهیم و یک بار بدون metadata تلاش می‌کنیم.
    if (!options.customMetadata || !isCustomMetadataSchemaError(error)) {
      throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { customMetadata: _customMetadata, ...withoutCustomMetadata } =
      params;
    uploaded = await imageKit().files.upload(withoutCustomMetadata);
  }

  if (!uploaded.fileId || !uploaded.filePath || !uploaded.url) {
    throw new Error("IMAGEKIT_INVALID_UPLOAD_RESPONSE");
  }

  return {
    fileId: uploaded.fileId,
    filePath: uploaded.filePath,
    url: uploaded.url,
    name: uploaded.name?.trim() || uploadFileName,
    size: uploadedFileSize(uploaded.size, file.size),
  };
}

/** ImageKit برای حذف فایل به fileId نیاز دارد، نه مسیر فایل. */
export async function deleteAsset(
  fileId: string | null | undefined,
): Promise<void> {
  const normalized = fileId?.trim();

  if (!normalized) {
    return;
  }

  await imageKit().files.delete(normalized);
}

export async function updateAssetMetadata(
  fileId: string,
  metadata: AssetMetadata,
): Promise<void> {
  const normalizedFileId = fileId.trim();

  if (!normalizedFileId) {
    throw new Error("IMAGEKIT_FILE_ID_REQUIRED");
  }

  const update: ImageKit.UpdateFileRequest = {
    description: metadata.description,
    tags: metadata.tags,
    customMetadata: metadata.customMetadata,
  };

  try {
    await imageKit().files.update(normalizedFileId, update);
  } catch (error) {
    if (!metadata.customMetadata || !isCustomMetadataSchemaError(error)) {
      throw error;
    }

    await imageKit().files.update(normalizedFileId, {
      description: metadata.description,
      tags: metadata.tags,
    });
  }
}

/**
 * لینک موقت برای فایل خصوصی تولید می‌کند.
 * قبل از فراخوانی این تابع، مالکیت پرونده باید در سرور بررسی شده باشد.
 */
export function signedDownloadUrl(
  filePath: string,
  options: {
    expiresIn?: number;
    download?: boolean;
  } = {},
): string {
  const normalizedPath = filePath.trim();

  if (!normalizedPath) {
    throw new Error("IMAGEKIT_FILE_PATH_REQUIRED");
  }

  const expiresIn = Math.min(
    Math.max(options.expiresIn ?? 15 * 60, 60),
    60 * 60,
  );

  return imageKit().helper.buildSrc({
    urlEndpoint: requiredEnv("IMAGEKIT_URL_ENDPOINT").replace(/\/$/, ""),
    src: normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`,
    signed: true,
    expiresIn,
    queryParameters:
      options.download === false
        ? undefined
        : {
            "ik-attachment": "true",
          },
  });
}

/** برای فایل‌های عمومی، URL پایدار از روی مسیر می‌سازد. */
export function publicAssetUrl(filePath: string): string {
  const normalizedPath = filePath.trim();

  if (!normalizedPath) {
    throw new Error("IMAGEKIT_FILE_PATH_REQUIRED");
  }

  return imageKit().helper.buildSrc({
    urlEndpoint: requiredEnv("IMAGEKIT_URL_ENDPOINT").replace(/\/$/, ""),
    src: normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`,
  });
}
