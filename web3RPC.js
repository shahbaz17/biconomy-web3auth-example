const rpc = (() => {
  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */

  const getChainId = async provider => {
    const web3 = new Web3(provider)

    // Get the connected Chain's ID
    const chainId = await web3.eth.getChainId()

    return chainId.toString()
  }

  const getAccounts = async provider => {
    const web3 = new Web3(provider)

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0]

    return address
  }

  const getBalance = async provider => {
    const web3 = new Web3(provider)

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0]

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
    )

    return balance
  }

  const sendTransaction = async provider => {
    try {
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts()

      const txRes = await web3.eth.sendTransaction({
        from: accounts[0],
        to: accounts[0],
        value: web3.utils.toWei('0.0000001'),
      })
      return txRes.transactionHash
    } catch (error) {
      return error.toString()
    }
  }

  const signMessage = async provider => {
    const web3 = new Web3(provider)

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0]

    const originalMessage = 'YOUR_MESSAGE'

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
    )

    return signedMessage
  }

  const getPrivateKey = async provider => {
    const privateKey = await provider.request({
      method: 'eth_private_key',
    })

    return privateKey
  }

  const readContract = async provider => {
    if (!provider) {
      uiConsole('provider not initialized yet')
      return
    }
    const web3 = new Web3(provider)
    const contractABI =
      '[ { "inputs": [ { "internalType": "string", "name": "initMessage", "type": "string" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "string", "name": "newMessage", "type": "string" } ], "name": "update", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "message", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]'
    const contractAddress = '0x3888B4606F9f12eE2e92f04Bb0398172BB91765d'
    const contract = new web3.eth.Contract(
      JSON.parse(contractABI),
      contractAddress,
    )
    // Read message from smart contract
    const message = await contract.methods.message().call()
    return message
  }

  const writeContract = async provider => {
    if (!provider) {
      uiConsole('provider not initialized yet')
      return
    }
    const web3 = provider

    const fromAddress = (await web3.eth.getAccounts())[0]

    const contractABI =
      '[ { "inputs": [ { "internalType": "string", "name": "initMessage", "type": "string" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "string", "name": "newMessage", "type": "string" } ], "name": "update", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "message", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]'
    const contractAddress = '0x3888B4606F9f12eE2e92f04Bb0398172BB91765d'
    const contract = new web3.eth.Contract(
      JSON.parse(contractABI),
      contractAddress,
    )
    // Send transaction to smart contract to update message and wait to finish
    const receipt = await contract.methods
      .update('Journey to Web3Auth begins.')
      .send({
        from: fromAddress,
      })
    return receipt
  }

  return {
    getChainId,
    getAccounts,
    getBalance,
    sendTransaction,
    signMessage,
    getPrivateKey,
    readContract,
    writeContract,
  }
})()
