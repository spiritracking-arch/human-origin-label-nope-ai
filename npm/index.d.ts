export declare const DEFAULT_BASE: string;
export declare const ID_PATTERN: RegExp;
export declare const SHA256_PATTERN: RegExp;

export interface RequestOptions {
  /** API base, default https://lochness-paris.com/verumano */
  base?: string;
  /** Custom fetch implementation */
  fetch?: typeof fetch;
  /** Retry once after HTTP 429, default true */
  retry?: boolean;
  signal?: AbortSignal;
}

export type Status = 'reviewed' | 'revoked' | 'declared' | 'demo' | (string & {});

export interface WorkMatch {
  creator_id: string;
  creator?: string;
  title?: string;
  date?: string;
  status: Status;
  demo?: boolean;
  url?: string;
  [key: string]: unknown;
}

export interface WorksResult {
  api_version?: string;
  sha256: string;
  matches: WorkMatch[];
}

export declare class VerumanoError extends Error {
  status: number;
  body: unknown;
}

export declare function getCreator(id: string, options?: RequestOptions): Promise<Record<string, any> | null>;
export declare function findWorks(sha256: string, options?: RequestOptions): Promise<WorksResult>;
export declare function hashFile(
  input: Blob | File | ArrayBuffer | ArrayBufferView | string,
  onProgress?: (fraction: number) => void
): Promise<string>;
export declare function checkFile(
  input: Blob | File | ArrayBuffer | ArrayBufferView | string,
  options?: RequestOptions & { onProgress?: (fraction: number) => void }
): Promise<WorksResult>;
export declare function verifyUrl(id: string, base?: string): string;
export declare function createSha256(): { update(data: Uint8Array): any; hex(): string };
