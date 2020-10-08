const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const provider = ganache.provider()
const web3 = new Web3(provider)

const {interface, bytecode} = require('../compile')

let accounts
let lotto

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    lotto = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [1]})
        .send({from: accounts[0], gas: '1000000'})
})

describe('Lotto', () => {
    it('deploys a contract', () => {
        assert.ok(lotto.options.address)
    })

    it('requires an entryFee greater or equal to 1 ether', async () => {
        try{
            const lotto2 = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data: bytecode, arguments: [0]})
            .send({from: accounts[0], gas: '1000000'})
            assert(false)
        } catch (err) {
            assert(err)
        }
    })
})