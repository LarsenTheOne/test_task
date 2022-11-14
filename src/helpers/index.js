import axios from "axios";

let timer;
export async function debounce(func, timeout = 300) {
  return new Promise(() => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => func(), timeout);
  });
}

export async function getData(sUrl) {
  const oData = await axios.get(sUrl);
  return oData.data;
}

export function setData(oData = {}, sDataPath = "", newValue) {
  if (sDataPath.split("/").length < 2) {
    oData[sDataPath] = newValue;
  } else {
    let aPath = sDataPath.split("/");
    let sProp = aPath.shift();
    oData[sProp] = setData(oData[sProp], aPath.join("/"), newValue);
  }
  return oData;
}
