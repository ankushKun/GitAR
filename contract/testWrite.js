import { writeContract } from 'arweavekit/contract'
import fs from "fs"
import deployment from "../deployment.json" assert { type: "json" }

const CNT_TX_ID = deployment.contractAddr
const envr = process.env.ENV == "DEV" ? "local" : "mainnet"

const w = JSON.parse(fs.readFileSync("./wallet.json", "utf8"))

const tx = await writeContract({
    environment: envr,
    contractTxId: CNT_TX_ID,
    wallet: w,
    options: {
        function: "newBounty",
        bounty: {
            projectName: "GitAR",
            title: "Deploy on permaweb and setup Github Actions",
            description: "The project is currently hosted on Github Pages. We need to deploy it on permaweb and setup Github Actions for automatic deployment on every push to the main branch",
            reward: "10 AR",
            atomicReward: false,
            url: "https://github.com/ankushKun/GitAR/issues/1",
            creator: "XDOqw28LKTa2wSechfMUmBU7PfLl1Q3C3RyZ_bNogWE",
            dateCreated: "2021-08-01T00:00:00.000Z",
            claimed: true
        }
    }
})

console.log("NEW BOUNTY ", tx.state)

const tx2 = await writeContract({
    environment: envr,
    contractTxId: CNT_TX_ID,
    wallet: w,
    options: {
        function: "submitClaim",
        claimData: {
            bountyId: 1,
            url: "gitar_ankushkun.arweave.dev",
        }
    }
})

console.log("SUBMIT CLAIM ", tx2.state)

const tx3 = await writeContract({
    environment: envr,
    contractTxId: CNT_TX_ID,
    wallet: w,
    options: {
        function: "approveClaim",
        bountyId: 1,
        claimedBy: "XDOqw28LKTa2wSechfMUmBU7PfLl1Q3C3RyZ_bNogWE"
    }
})

console.log("APPROVE CLAIM FALSE", tx3.state)

const tx4 = await writeContract({
    environment: envr,
    contractTxId: CNT_TX_ID,
    wallet: w,
    options: {
        function: "approveClaim",
        bountyId: 1,
        claimedBy: "lGqE7QMt0RF_8FjH2fYCIROrh24tciRfUY2oS1rIprM"
    }
})

console.log("APPROVE CLAIM TRUE", tx4.state)