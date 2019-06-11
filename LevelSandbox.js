// LevelSandbox.js
// Persist data with LevelDB

const level = require('level')
const chainDB = './chaindata'

// A LevelSandbox class
class LevelSandbox {

  constructor() {
    this.db = level(chainDB)
  }

  // Promise => Block Object
  // Get data from levelDB with key
  // Returns Block Object or null
  getLevelDBData(key) {

    let self = this
    // Return promise
    return new Promise(function(resolve, reject) {
      // Get block
      self.db.get(key, function(err, value) {
        // If block not found resolve with null
        if (err instanceof level.errors.NotFoundError) {
          resolve(null)
        } else if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(value))
        }
      })
    })
  }

  // Promise => Block Object
  // Get data from levelDB with hash
  // Returns Block Object or null
  getLevelDBDataByHash(hash) {

    let self = this
    let block = null
    // Return promise
    return new Promise(function(resolve, reject) {
      // Create read stream
      self.db.createReadStream()
      .on('data', function(data) {
        // Parse data
        let parsedData = JSON.parse(data.value)
        // Search for hash
        if(parsedData.hash === hash) {
          block = parsedData
        }
      })
      .on('error', function(err) {
        reject(err)
      })
      .on('close', function() {
        resolve(block)
      })
    })
  }

  // Promise => [Block Object]
  // Get data from levelDB with wallet address
  // Returns array with Block Objects if any
  getLevelDBDataByAddress(address) {

    let self = this
    let blocks = []
    // Return promise
    return new Promise(function(resolve, reject) {
      // Create read stream
      self.db.createReadStream()
      .on('data', function(data) {
        // Parse data
        let parsedData = JSON.parse(data.value)
        // Don't search in Genesis Block
        if (parsedData.height !== 0) {
          // Search for address
          if (parsedData.body.address.toString() === address) {
            // Add blocks found to blocks array
            blocks.push(parsedData)
          }
        }
      })
      .on('error', function(err) {
        reject(err)
      })
      .on('close', function() {
        resolve(blocks)
      })

    })
  }

  // Promise => value
  // Add data to levelDB with key and value
  addLevelDBData(key, value) {

    let self = this
    // Return promise
    return new Promise(function(resolve, reject) {
      // Add block
      self.db.put(key, value, function(err) {
        if (err) {
          reject(err)
        } else {
          resolve(value)
        }
      })
    })
  }

  // Promise => Number
  // Returns the height of the chain
  getBlocksCount() {

    let self = this
    // Return promise
    return new Promise(function(resolve, reject) {
      let dataArray = []
      // Read data entries
      self.db.createReadStream()
      .on('data', function (data) {
        dataArray.push(data)
      })
      .on('error', function (err) {
        reject(err)
      })
      .on('close', function () {
        resolve(dataArray.length)
      })
    })
  }

  // Promise => String
  // Deletes all data from storage
  // Used for testing, to clean up the database
  _deleteAllData() {

    let self = this
    // Return promise
    return new Promise(function(resolve, reject) {
      // Read data entries
      let i = 0
      self.db.createReadStream()
      .on('data', function (data) {
        // Delete block
        self.db.del(i, function(err) {if (err) reject(err)})
        i++
      })
      .on('error', function (err) {
        reject(err)
      })
      .on('close', function () {
        resolve('all blocks were deleted')
      })
    })
  }
}
// Export LevelSandbox class
module.exports.LevelSandbox = LevelSandbox
