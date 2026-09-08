import { randomBytes } from "crypto";

export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const randomSuffix = randomBytes(4).toString("hex");
  return `req_${timestamp}_${randomSuffix}`;
}

export function getOrGenerateRequestId(request?: Request): string {
  if (!request) return generateRequestId();
  const existing = request.headers.get("x-request-id");
  if (existing && existing.trim().length > 0) {
    return existing;
  }
  return generateRequestId();
}
