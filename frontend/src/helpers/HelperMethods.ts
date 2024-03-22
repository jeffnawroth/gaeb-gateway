import { ExtensionMap } from "./Interfaces";

/**

    This function triggers a file download by creating a temporary link element with a download attribute.
    It takes in a blob containing the file data and a filename for the downloaded file.
    @param {Blob} blob - the file data in the form of a Blob object
    @param {string} filename - the desired filename for the downloaded file
    */
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

/**

    This function generates a filename for a GAEB file based on the given phaseId and fileName.
    It uses an extension map to determine the appropriate file extension based on the phaseId,
    and falls back to a default extension if no matching extension is found.
    If a fileName is provided, it replaces the file extension with the appropriate one.
    @param {number} phaseId - the phaseId of the GAEB file
    @param {string|undefined} fileName - the original filename of the GAEB file, including the extension (optional)
    @returns {string} - the generated filename for the GAEB file, including the appropriate extension
    */
export function getFileName(phaseId: number, fileName?: string | undefined) {
  const extensionMap = {
    83: ".X83",
    84: ".X84",
    93: ".X93",
    94: ".X94",
  } as ExtensionMap;

  const defaultExtension = ".X00";
  const extension = extensionMap[phaseId] || defaultExtension;

  const fileNameWithoutExtension = fileName?.split(".")[0] ?? "gaebFile";
  return `${fileNameWithoutExtension}${extension}`;
}
