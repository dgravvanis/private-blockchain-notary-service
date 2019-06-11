// Mempool.js

const bitcoinMessage = require('bitcoinjs-message')

// Request timeout window = 5min
const TimeoutRequestsWindowTime = 5 * 60 * 1000

// Request object
function RequestObject(address) {

  this.walletAddress = address
  this.requestTimeStamp = new Date().getTime().toString().slice(0,-3)
  this.message = address + ':' + this.requestTimeStamp + ':starRegistry'
  this.validationWindow = TimeoutRequestsWindowTime/1000
}

// Valid request object
function ValidRequestObj(reqObj) {

  this.registerStar = true
  this.status = {
   address: reqObj.walletAddress,
   requestTimeStamp: reqObj.requestTimeStamp,
   message: reqObj.message,
   validationWindow: reqObj.validationWindow,
   messageSignature: true
 }
}

// a Mempool class
class Mempool {

  constructor() {
    this.pool = []
    this.timeoutRequests = []
    this.poolValid = []
  }

  addARequestValidation(address) {

    let self = this
    return new Promise(function(resolve, reject) {

      if (self.pool[address]) {
        // Return existing request object
        let reqObj = self.pool[address]
        // Update validation window
        let timeElapse = (new Date().getTime().toString().slice(0,-3)) - reqObj.requestTimeStamp
        let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse
        reqObj.validationWindow = timeLeft
        // Resolve
        resolve(reqObj)

      } else {
        // Create new request object
        let newReqObj = new RequestObject(address)
        // Add new request object to the pool
        self.pool[address] = newReqObj
        // Add timeout function
        self.timeoutRequests[address] = setTimeout(function() {self.removeValidationRequest(address)},
         TimeoutRequestsWindowTime)
        // Resolve
        resolve(newReqObj)
      }
    })
  }

  // Remove request object & timeout function
  removeValidationRequest(address) {

    let self = this
    delete self.pool[address]
    delete self.timeoutRequests[address]
  }

  removeFromPoolValid(address) {

    let self = this
    delete self.poolValid[address]
  }

  validateRequestByWallet(address, signature) {

    let self = this
    return new Promise(function(resolve, reject) {
      // Check if request has timed out
      if (self.pool[address]) {

        let reqObj = self.pool[address]
        let message = reqObj.message
        try {
          // Check for valid signature
          let isValid = bitcoinMessage.verify(message, address, signature)
          if (isValid) {
            // Create valid request object
            let validReqObj = new ValidRequestObj(reqObj)
            // Add valid request object to poolValid
            self.poolValid[address] = validReqObj
            // Clear pool & timeoutRequests
            self.removeValidationRequest(address)
            // Resolve
            resolve(validReqObj)
          } else {
            resolve('invalid')
          }
        }
        catch(err) {
          reject(err)
        }
      } else {
        resolve('timed out')
      }
    })
  }

  // Verify if the request validation exists and if it is valid
  verifyAddressRequest(address) {

    let self = this
    return new Promise(function(resolve, reject) {
      if(self.poolValid[address]) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  }
}
// Export Mempool class
module.exports.Mempool = Mempool
