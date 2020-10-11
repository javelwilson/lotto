const assert = require('assert')
const ganache = require('ganache-cli')
const { utils } = require('mocha')
const Web3 = require('web3')

const provider = ganache.provider()
const web3 = new Web3(provider)

const { interface, bytecode } = require('../compile')

let accounts
let lotto

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  lotto = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [1] })
    .send({ from: accounts[0], gas: '1000000' })
})

describe('Lotto', () => {
  it('deploys a contract', () => {
    assert.ok(lotto.options.address)
  })

  it('accepts the entry fee in ether', async () => {
    const entryFee = await lotto.methods.entryFee().call({
      from: accounts[0],
    })
    assert.strictEqual(entryFee, web3.utils.toWei('1', 'ether'))
  })

  it('requires an entryFee greater or equal to 1 ether', async () => {
    try {
      const lotto2 = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [0] })
        .send({ from: accounts[0], gas: '1000000' })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('allows one account to enter', async () => {
    await lotto.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('1', 'ether'),
    })

    const players = await lotto.methods.getPlayers().call({
      from: accounts[0],
    })

    assert.strictEqual(players.length, 1)
  })

  it('requires that the manager cannot enter', async () => {
    try {
      await lotto.methods.enter().send({
        from: accounts[0],
        value: utils.eth.toWei('1', 'ether'),
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('requires that the entryFee be matched upon entering', async () => {
    try {
      await lotto.methods.enter().send({
        from: accounts[1],
        value: utils.eth.toWei('2', 'ether'),
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('requires that only the the manager can pick a winner', async () => {
    try {
      await lotto.methods.pickWinner().call({
        from: accounts[1],
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('allows the manager to pick a winner', async () => {
    await lotto.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('1', 'ether'),
    })

    players = await lotto.methods.getPlayers().call({
        from: accounts[0]
    })

    assert.strictEqual(players.length, 1)

    await lotto.methods.pickWinner().send({
      from: accounts[0],
    })

    previousWinners = await lotto.methods.getPreviousWinners().call({
      from: accounts[0],
    })

    players = await lotto.methods.getPlayers().call({
        from: accounts[0]
    })

    assert.strictEqual(players.length, 0)
    assert.strictEqual(previousWinners.length, 1)
  })
})
