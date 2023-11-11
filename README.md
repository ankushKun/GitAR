# GitAR 🎸 

- [GitAR 🎸](#gitar-)
- [About](#about)
- [Setup and Installation](#setup-and-installation)
  - [Requirements](#requirements)
  - [Installation](#installation)
- [ARdrive setup](#ardrive-setup)
  - [Manual deployment](#manual-deployment)
- [SmartWeave Contract](#smartweave-contract)

# About

GitAR is a bounty platform for the arweave ecosystem.\
It allows users to create bounties for any project on arweave.\
Users can then submit a url pointing to whatever work they have done and the project owner can accept or reject the submission.\
If the submission, the user will be rewarded with the bounty reward in AR or Atomic Assets.

# Setup and Installation

## Requirements

- NodeJS LTS
- An Arweave Wallet (better if funded)
- ARNS test tokens in you want to deploy to your own ARNS subdomain

## Installation

1. Fork the repository

2. Clone the repository

```bash
git clone https://github.com/<YOUR_USERNAME>/GitAR.git
```

3. Install dependencies

```bash
cd GitAR
npm install
```

4. Create a .env file

```bash
cp .env.dev .env
```

5. Edit the .env file and add the variables

# ARdrive setup

Install the ardrive-cli globally

```bash
npm i -g ardrive-cli
```

Generate seedphrase and wallet through which we will create the drive and folder and upload our files

```bash
ardrive generate-seedphrase
export SEED="<SEED>" # Output from previous command
```

```bash
ardrive generate-wallet -s "${SEED}" > wallet.json
```

Using the `--turbo` flag will allow us to upload files upto 500kb for free

```bash
ardrive create-drive -w wallet.json -n apps --turbo
```

Copy Drive entity id and root folder entity id from the output of above command and add them to the .env file

```bash
ardrive create-folder -w wallet.json -n "gitar" -F "<ROOT_FOLDER_EID>" --turbo
```

Copy the gitar folder entity id from the output of above command and add it to the .env file

also run `export GITAR_FOLDER_EID=<Gitar folder entity id>` to set the environment variable

**After this the uploading process will be taken care by the `deploy.js` script, make sure to update the `ANT TOKEN ADDRESS` and `SUBDOMAIN` if required.**

Github actions will automatically run the deploy script and upload the files to arweave on every push.

## Manual deployment

```bash
npm run build
cd ./dist
ardrive upload-file -s "${SEED}" -l ./ -F ${GITAR_FOLDER_EID} --turbo
ardrive create-manifest -s "${SEED}" -f ${GITAR_FOLDER_EID} --turbo --dry-run > out.json
```

- Open out.json and keep the manifest section and remove the rest of the contents
- set `index.path` to "index.html"
- Find and replace all occurrences of `./` with and empty string to avoid relative paths

<details>
<summary>Before</summary>

```json
{
   "manifest": "arweave/paths",
   "version": "0.1.0",
   "index": {
      "path": "./404.html"
   },
   "paths": {
      "./404.html": {
         "id": "j-0gtXjXZoql1skhD3HNUbCn6ze-VnXYIt6x0Gajtow"
      },
      "./assets/index-c5b8b06a.css": {
          "id": "mY6nU2zuzMdDMADKybWkXb8WgJt-qdzi_lRH3O1Vxcg"
      },
      "./assets/wallet-f1ba16a9.svg": {
          "id": "6YXrOjpwqdHdTxUm1dd3MmBVFyXGs-b_gkb52K7GSPE"
      },
      "./index.html": {
          "id": "vNCT5Gv9YgC8TL6viN_t6zsDrR5Zdhoyp1AfQIuekUY"
      }
   }
}
```
</details>

<details>
<summary>After</summary>

```json
{
   "manifest": "arweave/paths",
   "version": "0.1.0",
   "index": {
      "path": "index.html"
   },
   "paths": {
      "404.html": {
         "id": "j-0gtXjXZoql1skhD3HNUbCn6ze-VnXYIt6x0Gajtow"
      },
      "assets/index-c5b8b06a.css": {
          "id": "mY6nU2zuzMdDMADKybWkXb8WgJt-qdzi_lRH3O1Vxcg"
      },
      "assets/wallet-f1ba16a9.svg": {
          "id": "6YXrOjpwqdHdTxUm1dd3MmBVFyXGs-b_gkb52K7GSPE"
      },
      "index.html": {
          "id": "vNCT5Gv9YgC8TL6viN_t6zsDrR5Zdhoyp1AfQIuekUY"
      }
   }
}
```
</details>

```bash
ardrive upload-file -s "${SEED}" -l ./manifest.json --content-type application/x.arweave-manifest+json -F ${GITAR_FOLDER_EID} --turbo > ../out.json
```

Check out.json for a field called `dataTxId`, your website is now live at `https://arweave.net/<dataTxId>` 🥳

This dataTxId can be used to register a custom subdomain on [Permapages ARNS](https://permapages.app/#/arns)

Once you get ARNS Test tokens and register a subdomain, you can check the transaction history to get your `ANT Contract Address`


# SmartWeave Contract

The smartweave contract is located in the `contract` folder.

To deploy the contract, run the following command

```bash
node contract/deploy.js
```

This will store the contract address in the deployment.json file.

**TODO: Update the code so that there is no need to manually set environment to local or mainnet**