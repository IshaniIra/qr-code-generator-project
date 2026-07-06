const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const downloadQrCode = async (qrId, token) => {
  const response = await fetch(`${API_BASE_URL}/qr/${qrId}/download`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("QR download failed");
  }

  const blob = await response.blob();
  const fileUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = "qr-code.png";
  link.click();

  window.URL.revokeObjectURL(fileUrl);
};