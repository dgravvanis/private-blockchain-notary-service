// app.js
// Hapi server
'use strict'

const Hapi = require('@hapi/hapi')
const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const Hex2ascii = require('hex2ascii')
const Mempool = require('./Mempool.js')
const Block = require('./Block.js')
const BlockChain = require('./BlockChain.js')

const init = async () => {
  const myBlockChain = new BlockChain.BlockChain()
  const myMempool = new Mempool.Mempool()
  const server = Hapi.server({
    port: 8000,
    host: 'localhost'
  })

  // GET: Get star block by height Endpoint
  server.route({
    method: 'GET',
    path: '/block/{height}',
    handler: function (request, h) {

      // Get BlockChain height
      return myBlockChain.getBlockHeight()
      .then((height) => {
        // Check for out of bounds
        if (request.params.height >= height) {
          // Throw error if out of bounds
          throw Boom.notFound(`Last Star Block is at height ${height - 1}.`)
        } else {
          // Get star block by height
          return myBlockChain.getBlock(request.params.height)
        }
      })
      .then((starBlock) => {
        // Check if starBlock is Genesis Block
        if (starBlock.height != 0) {
          // Decode the star story & add storyDecoded to starBlock
          starBlock.body.star['storyDecoded'] = Hex2ascii(starBlock.body.star.story)
        }
        // Return starBlock
        return starBlock
      })
    },
    options: {
      validate: {
        params: {
          // Input validation
          height: Joi.number().required().integer().min(0)
        }
      }
    }
  })

  // GET: Get star block by wallet address (blockchain identity) Endpoint
  server.route({
    method: 'GET',
    path: '/stars/address:{address}',
    handler: (request, h) => {

      // Get blocks
      return myBlockChain.getBlockByWalletAddress(request.params.address)
      .then((result) => {

        let starBlocks = []
        let x
        for (x in result) {
          // Decode the star story & add storyDecoded to starBlock
          result[x].body.star['storyDecoded'] = Hex2ascii(result[x].body.star.story)
          starBlocks.push(result[x])
        }
        return starBlocks
      })
    },
    options: {
      validate: {
        params: {
          // Input validation
          address: Joi.string().min(26).max(35).required()
        }
      }
    }
  })

  // GET: Get star block by block hash Endpoint
  server.route({
    method: 'GET',
    path: '/stars/hash:{hash}',
    handler: (request, h) => {

      // Get block
      return myBlockChain.getBlockByHash(request.params.hash)
      .then((starBlock) => {
        // Check if block found
        if (starBlock) {
          // Check if starBlock is Genesis Block
          if (starBlock.height != 0) {
            // Decode the star story & add storyDecoded to starBlock
            starBlock.body.star['storyDecoded'] = Hex2ascii(starBlock.body.star.story)
          }
          return starBlock
        } else {
          // Throw not found error
          throw Boom.notFound(`Star Block Not Found`)
        }
      })
    },
    options: {
      validate: {
        params: {
          // Input validation
          hash: Joi.string().required()
        }
      }
    }
  })

  // POST: Validation Request Endpoint
  // TODO: Bitcoin address proper input validation
  server.route({
    method: 'POST',
    path: '/requestValidation',
    handler: (request, h) => {

      return myMempool.addARequestValidation(request.payload.address)
    },
    options: {
      validate: {
        payload: {
          // Validation
          address: Joi.string().min(26).max(35).required()
        }
      }
    }
  })

  // POST: Validate message-signature Endpoint
  // TODO: Bitcoin address proper input validation
  server.route({
    method: 'POST',
    path: '/message-signature/validate',
    handler: (request, h) => {

      let address = request.payload.address
      let signature = request.payload.signature
      return myMempool.validateRequestByWallet(address, signature)
      .then((result) => {

        if (result == 'timed out') {throw Boom.unauthorized('validation window expired')}
        if (result == 'invalid') {throw Boom.unauthorized('invalid signature')}
        return result
      })
    },
    options: {
      validate: {
        payload: {
          // Validation
          address: Joi.string().min(26).max(35).required(),
          signature: Joi.string().max(100).required()
        }
      }
    }
  })

  // POST: Submit the Star information Endpoint
  // TODO: Bitcoin address proper input validation
  server.route({
    method: 'POST',
    path: '/block',
    handler: (request, h) => {
      // Verify if the request validation exists
      return myMempool.verifyAddressRequest(request.payload.address)
      .then((bool) => {
        // If valid
        if (bool) {
          // This is the body of the block
          let body = {
            address: request.payload.address,
            star: {
              ra: request.payload.star.ra,
              dec: request.payload.star.dec,
              story: Buffer.from(request.payload.star.story, 'ascii').toString('hex')
            }
          }
          // Create new Block
          let block = new Block.Block(body)
          // Add block to the chain
          return myBlockChain.addBlock(block)
        } else {
          // Throw error
          throw Boom.unauthorized('address not authorized to post new star')
        }
      })
      .then((result) => {

        myMempool.removeFromPoolValid(request.payload.address)
        return result
      })
    },
    options: {
      validate: {
        payload: {
          // Validation
          address: Joi.string().min(26).max(35).required(),
          star: Joi.object().keys({
            dec: Joi.string().max(12).required(),
            ra: Joi.string().max(12).required(),
            story: Joi.string().max(250).required()
          }).required()
        }
      }
    }
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
};

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
});
// Start server
init();
