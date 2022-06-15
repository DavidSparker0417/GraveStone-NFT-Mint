export const log = console.log;

/**********************************************/
/*          Representing numbers               *
/**********************************************/
export const dsUtilNumberWithCommas = (x) => {
  // return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

  let t = x.toString();
  let decimalPosition = t.indexOf(".");
  if (decimalPosition > 0) {
    let i;
    for (i = decimalPosition - 3; i > 0; i -= 3) {
      t = t.slice(0, i) + "," + t.slice(i);
    }
  }
  return t;
};

export function truncateDecimals(number, digits) {
  var multiplier = Math.pow(10, digits),
    adjustedNum = number * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? "ceil" : "floor"](adjustedNum);

  return truncatedNum / multiplier;
}

/**
 * Remove unnecessary zerios at the end of the number.
 * It is useful when call after toFixed()
 * @param {*} x : float number including unnecessary zeros
 * @returns : float number convienent to see
 */
export function dsUtilToHumanizeFixed(x, decimals) {
  let d = typeof decimals === "undefined" ? 10 : decimals;
  if (x > 0.1) d = 5;
  return x.toFixed(d).replace(/\.?0*$/, "");
}

export function dsUtilSecondToTimeFormatString(seconds) {
  return (
    ("0" + Math.floor(seconds / 86400)).slice(-3) +
    ":" +
    ("0" + Math.floor((seconds % 86400) / 3600)).slice(-2) +
    ":" +
    ("0" + Math.floor((seconds % 3600) / 60)).slice(-2) +
    ":" +
    ("0" + Math.floor(seconds % 60)).slice(-2)
  );
}

export function dsUtilGenerateRandomNumber(rangeStart, rangeEnd) {
  return rangeStart + Math.random() * (rangeEnd - rangeStart);
}

export function dsUtilSec2DateTime(seconds) {
  const day = seconds / 86400;
  const hour = (seconds % 86400) / 3600;
  const min = (seconds % 3600) / 60;
  const sec = seconds % 60;
  const dateStr = day + " day" + hour + " hour" + min + " min" + sec + " sec";
  return dateStr;
}

/**********************************************/
/*          Cooking Strings                    *
/**********************************************/
export const dsutilUriToIpfsURL = (uri) => {
  const uriPrefix = ["ipfs:://", "ipfs://"];
  let ipfsUrl = uri;
  for (let i = 0; i < uriPrefix.length; i++) {
    if (uri.startsWith(uriPrefix[i])) {
      ipfsUrl = "https://ipfs.io/ipfs/" + uri.slice(uriPrefix[i].length);
      break;
    }
  }
  return ipfsUrl;
};
