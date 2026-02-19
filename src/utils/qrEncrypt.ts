import CryptoJS from "crypto-js";

const SECRET = import.meta.env.VITE_QR_SECRET || "default_secret";

/* ========= Encrypt 2 Layers ========= */
export const encryptQR = (data: string) => {
  const firstLayer = CryptoJS.AES.encrypt(
    data,
    SECRET
  ).toString();

  const secondLayer = CryptoJS.AES.encrypt(
    firstLayer,
    SECRET
  ).toString();

  return secondLayer;
};

/* ========= Decrypt 2 Layers ========= */
export const decryptQR = (encrypted: string) => {
  const firstDecrypt = CryptoJS.AES.decrypt(
    encrypted,
    SECRET
  ).toString(CryptoJS.enc.Utf8);

  const secondDecrypt = CryptoJS.AES.decrypt(
    firstDecrypt,
    SECRET
  ).toString(CryptoJS.enc.Utf8);

  return secondDecrypt;
};
