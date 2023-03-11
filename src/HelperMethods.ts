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
