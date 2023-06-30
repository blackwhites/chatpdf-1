import localforage from "localforage";


export function getPdfFromStorage(sign) {
  let key = `file.pdf.${sign}`;
  return localforage.getItem(key);
}

export function savePdfToForage(sign, data) {
  return localforage.setItem(`file.pdf.${sign}`, data);
}

export function removePdfFromForage(sign) {
  return localforage.removeItem(`file.pdf.${sign}`);
}

export function getMd5FromForage(sign) {
  return localforage.getItem(`file.md5.${sign}`);
}

export function getChatHistoryFromForage(sign) {
  return localforage.getItem(`chat.history.${sign}`);
}

export function saveChatHistoryToForage(sign, data) {
  return localforage.setItem(`chat.history.${sign}`, data);
}

export function removeChatHistoryFromForage(sign) {
  return localforage.removeItem(`chat.history.${sign}`);
}

export function getSiderFromForage() {
  return localforage.getItem(`sider`);
}

export function saveSiderToForage(data) {
  return localforage.setItem(`sider`, data);
}

export function removeSiderItemFromForage(sign, data) {
  let newData = data.filter(item => item.sign !== sign);
  return saveSiderToForage(newData);
}

export function saveToken(token) {
  return localforage.setItem("token", token);
}

export function getToken() {
  return localforage.getItem("token");
}

export function removeToken() {
  return localforage.removeItem("token");
}