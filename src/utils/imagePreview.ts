export function imagePreviewSrc(src: string): string {
  const match = src.match(/^\/uploads\/([^/]+)\.(?:jpe?g|png)$/i);
  return match ? `/uploads/previews/${match[1]}.webp` : src;
}
