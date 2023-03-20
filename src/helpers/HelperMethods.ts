export function fileDownload(blob: Blob, filename: string) {
  const data = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = data;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    window.URL.revokeObjectURL(data);
    link.remove();
  }, 100);
}

export function getFileName(phaseId: number, fileName?: string | undefined) {
  const extensionMap = {
    83: ".X83",
    84: ".X84",
    93: ".X93",
    94: ".X94",
  } as any;

  const defaultExtension = ".X00";
  const extension = extensionMap[phaseId] || defaultExtension;

  const fileNameWithoutExtension = fileName?.split(".")[0] ?? "gaebFile";
  return `${fileNameWithoutExtension}${extension}`;
}
