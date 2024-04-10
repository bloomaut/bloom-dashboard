export const downloadExcel = (response: any) => {
  // Convierte la respuesta en un Buffer
  const buffer = Buffer.from(response);

  // Convierte el Buffer en un Blob
  const blob = new Blob([buffer], { type: "application/octet-stream" });

  // Crea una URL temporal para el Blob
  const url = window.URL.createObjectURL(blob);

  // Crea un enlace <a> en el DOM y simula hacer clic en él para iniciar la descarga
  const link = document.createElement("a");
  link.href = url;
  link.download = "archivo_excel.xlsx";
  link.click();

  // Limpia la URL temporal creada para el Blob
  window.URL.revokeObjectURL(url);
};
