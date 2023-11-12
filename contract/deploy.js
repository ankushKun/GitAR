import { createContract } from 'arweavekit/contract'
import fs from "fs"
// import { config } from 'dotenv'
// config()

const w = JSON.parse(fs.readFileSync("./wallet.json", "utf8"))
const src = fs.readFileSync("./contract/src.js", "utf8")
const istate = fs.readFileSync("./contract/state.json", "utf8")
const envr = process.env.ENV == "DEV" ? "local" : "mainnet"

const contract = await createContract({
    wallet: w,
    contractSource: src,
    environment: envr,
    initialState: istate,
});

console.log(contract.contractTxId)
fs.writeFileSync("./deployment.json", JSON.stringify({ contractAddr: contract.contractTxId, network: envr }), "utf8")
