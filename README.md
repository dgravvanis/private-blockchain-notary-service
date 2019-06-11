# Private Blockchain Notary Service
Secure Digital Assets on a Private Blockchain.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Download and install [Node.js](https://nodejs.org)

### Installation
> Clone project
```shell
$ git clone https://github.com/dgravvanis/private-blockchain-notary-service.git
```
> Install project dependencies
```shell
$ npm install
```

## API Endpoints
The project’s API service is configured to run on port 8000. The default URL is using localhost for connectivity (http://localhost:8000).
> Start the server
```shell
$ node app.js
```

### Blockchain ID validation routine
#### Web API POST endpoint to validate request with JSON response.
* **URL**
> http://localhost:8000/requestValidation

* **Payload**
```json
{
  "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL"
}
```

* **Response**
```json
{
  "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
  "requestTimeStamp": "1544451269",
  "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544451269:starRegistry",
  "validationWindow": 300
}
```

#### Web API POST endpoint validates message signature with JSON response.
* **URL**
> http://localhost:8000/message-signature/validate

* **Payload**
```json
{
  "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
  "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
}
```

* **Response**
```json
{
  "registerStar": true,
  "status": {
    "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "requestTimeStamp": "1544454641",
    "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544454641:starRegistry",
    "validationWindow": 193,
    "messageSignature": true
  }
}
```

### Star registration Endpoint
#### Web API POST endpoint with JSON response that submits the Star information to be saved in the Blockchain.

* **URL**
> http://localhost:8000/block

* **Payload**
```json
{
  "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
  "star": {
    "dec": "68° 52' 56.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
  }
}
```

* **Response**
```json
{
  "hash": "8098c1d7f44f4513ba1e7e8ba9965e013520e3652e2db5a7d88e51d7b99c3cc8",
  "height": 1,
  "body": {
    "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "68° 52' 56.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
    }
  },
  "time": "1544455399",
  "previousBlockHash": "639f8e4c4519759f489fc7da607054f50b212b7d8171e7717df244da2f7f2394"
}
```

### Star Lookup
#### Get Star block by hash with JSON response.

* **URL**
> http://localhost:8000/stars/hash:[HASH]

* **HASH:** The hash of the block

* **Response**
```json
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```

#### Get Star block by wallet address (blockchain identity) with JSON response.

* **URL**
> http://localhost:8000/stars/address:[ADDRESS]

* **ADDRESS:** Bitcoin address

* **Response**
```json
[
  {
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  },
  {
    "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
    "height": 2,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "17h 22m 13.1s",
        "dec": "-27° 14' 8.2",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532330848",
    "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
  }
]
```
#### Get star block by star block height with JSON response.

* **URL**
> http://localhost:8000/block/[HEIGHT]

* **HEIGHT:** Height of the block

* **Response**
```json
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```

## Built With
* [Node.js](https://nodejs.org)
* [Hapi](https://hapijs.com) - Server Framework
* [level](https://www.npmjs.com/package/level) - LevelDB wrapper for Node.js
* [hex2ascii](https://www.npmjs.com/package/hex2ascii) - Convert hex to ascii in JavaScript
* [crypto-js](https://www.npmjs.com/package/crypto-js) - JavaScript library of crypto standards
* [bitcoinjs-lib](https://www.npmjs.com/package/bitcoinjs-lib) - A javascript Bitcoin library for node.js
* [bitcoinjs-message](https://www.npmjs.com/package/bitcoinjs-message) - Sing/Verify a Bitcoin message

## Authors
* **Gravvanis Dimitris**

## License
This project is licensed under the [MIT](https://github.com/dgravvanis/private-blockchain-notary-service/blob/master/LICENSE) License.
