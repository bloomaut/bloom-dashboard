export const downloadExcel = (response: any) => {
  // Crea un Blob a partir del ArrayBuffer de la respuesta
  const blob = new Blob([response], { type: "application/octet-stream" });

  // Crea una URL temporal para el Blob
  const url = window.URL.createObjectURL(blob);

  // Crea un enlace <a> en el DOM y configura su href para que apunte a la URL del Blob
  const link = document.createElement("a");
  link.href = url;

  link.download = "archivo_excel.xlsx";
  link.click();

  // Limpia la URL temporal creada para el Blob
  window.URL.revokeObjectURL(url);
};
