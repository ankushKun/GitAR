import { viewContractState } from "arweavekit/contract"
import deployment from "../deployment.json" assert { type: "json" }

const CNT_TX_ID = deployment.contractAddr

const envr = process.env.ENV == "DEV" ? "local" : "mainnet"

const viewResult = await viewContractState({
    environment: envr,
    contractTxId: CNT_TX_ID,
    options: {
        function: "getBounties"
    }
})

console.log(viewResult.viewContract.result)

const viewResult2 = await viewContractState({
    environment: envr,
    contractTxId: CNT_TX_ID,
    options: {
        function: "getBounty",
        bountyId: 1
    }
})

console.log(viewResult2.viewContract.result)