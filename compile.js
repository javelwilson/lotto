const path = require('path')
const fs = require('fs')
const solc = require('solc')

const lottoPath = path.resolve(__dirname, 'contracts', 'Lotto.sol')
const lottoSrc = fs.readFileSync(lottoPath, 'utf8')

module.exports = solc.compile(lottoSrc, 1).contracts[':Lotto']