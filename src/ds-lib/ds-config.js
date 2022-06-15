const fs = require('fs')

const UINT256_MAX = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

function dsConfigWrite(config, file, key, value) {
  let rawdata
  let _config = config
  if (!config) 
  {
    rawdata = fs.readFileSync(file)
    _config = JSON.parse(rawdata)
    config[key] = value
  }
  rawdata = JSON.stringify(_config, null, 2)
  fs.writeFileSync(file, rawdata)
}

function dsConfigRead(file) {
  const rawdata = fs.readFileSync(file, "utf-8");
  const config = JSON.parse(rawdata)
  return config
}

module.exports = {
  dsConfigWrite,
  dsConfigRead,
  UINT256_MAX,
  ZERO_ADDRESS
}