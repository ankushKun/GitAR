import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { viewContractState } from "arweavekit/contract"
import { timeStrToRelativeTime } from "../utils/functions";
import Page from "../components/page";
import deployment from "../../deployment.json"

type BountyEntry = {
    projectName: string,
    title: string,
    description: string,
    reward: string,
    atomicReward: boolean,
    url: string,
    creator: string,
    dateCreated: string,
    claimed: boolean,
    claimedBy?: string
}

const envr = process.env.ENV == "DEV" ? "local" : "mainnet"

// const dummyBounties: BountyEntry[] = [
//     {
//         projectName: "GitAR",
//         title: "Deploy on permaweb and setup Github Actions",
//         description: "The project is currently hosted on Github Pages. We need to deploy it on permaweb and setup Github Actions for automatic deployment on every push to the main branch",
//         reward: "10 AR",
//         atomicReward: false,
//         url: "https://github.com/ankushKun/GitAR/issues/1",
//         creator: "XDOqw28LKTa2wSechfMUmBU7PfLl1Q3C3RyZ_bNogWE",
//         dateCreated: (new Date()).toDateString(),
//         claimed: false
//     },
//     {
//         projectName: "GitAR",
//         title: "Write a blog post about GitAR",
//         description: "We need to write a blog post about GitAR and publish it on the permaweb. The blog post should be about 500 words and should include the following topics: 1. What is GitAR? 2. How to use GitAR? 3. How can it help arweave thrive?",
//         reward: "",
//         atomicReward: true,
//         url: "https://github.com/ankushKun/GitAR/issues/2",
//         creator: "XDOqw28LKTa2wSechfMUmBU7PfLl1Q3C3RyZ_bNogWE",
//         dateCreated: (new Date()).toDateString(),
//         claimed: false
//     },
// ]

type BountiesState = {
    [foo: string]: BountyEntry
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Browse({ wallet }: any) {
    const [bounties, setBounties] = useState<BountiesState>({})
    const [selectedBounty, setSelectedBounty] = useState<BountyEntry | null>(null)

    useEffect(() => {
        const fetchBounties = async () => {
            const viewResult = await viewContractState({
                wallet: wallet,
                environment: envr,
                contractTxId: deployment.contractAddr,
                options: {
                    function: "getBounties"
                },
                strategy: "arweave"
            })
            console.log(viewResult.viewContract.result)
            setBounties(viewResult.viewContract.result)
        }
        fetchBounties()
    }, [wallet])


    const BountyItem = (data: BountyEntry) => {
        return <div className="ring-1 ring-black p-2 rounded-lg bg-white/80 flex flex-col gap-2 cursor-pointer" onClick={() => setSelectedBounty(data)}>
            <div className="text-xl font-semibold">{data.title}</div>
            {/* <div className="text-lg font-light">{data.description}</div> */}
            {data.atomicReward ? <div className="text-lg font-light bg-red-200 rounded-lg px-2 w-fit">Atomic Reward</div>
                : <div className="text-lg font-light bg-green-300 rounded-lg px-2 w-fit">{data.reward}</div>}
        </div>
    }

    return <Page title="Browse | GitAR" wallet={wallet}>
        <div className="text-center text-3xl font-semibold my-10">Latest Bounties</div>
        <div className="grid grid-cols-4 gap-4 h-[75vh]">
            <div className="flex flex-col gap-5 overflow-scroll p-0.5 col-span-4 md:col-span-1">
                {
                    Object.keys(bounties).map((bountyId, i) => {
                        return <BountyItem key={i} {...bounties[bountyId]} />
                    })
                }
            </div>
            <div className="bg-white/80 backdrop-blur col-span-3 ring-1 ring-black rounded-lg fixed bottom-0 left-0 right-0 md:static">
                {
                    selectedBounty ? <div className="p-7 h-[75vh] sm:h-auto">
                        <button className="sm:hidden absolute right-5 top-3 ring-1 ring-black px-2 font-bold rounded-full" onClick={() => setSelectedBounty(null)}>X</button>
                        <div className="text-3xl font-semibold">{selectedBounty.title}</div>
                        <div className="text-gray-600">{timeStrToRelativeTime(selectedBounty.dateCreated)} by <Link to={`/profile?addr=${selectedBounty.creator}`} className="hover:text-black hover:underline underline-offset-4">{selectedBounty.creator}</Link></div>
                        <div className="text-xl text-justify my-10">{selectedBounty.description}</div>
                        {!selectedBounty.atomicReward && <div className="text-2xl font-light bg-green-300 w-fit px-2 rounded-lg"> Worth {selectedBounty.reward}</div>}
                        {selectedBounty.atomicReward && <Link to={selectedBounty.url} target="_blank">
                            <button className=" bg-red-200 text-2xl rounded-lg p-1 px-2 hover:scale-105 transition-all duration-200">View Atomic Reward</button>
                        </Link>}
                    </div> :
                        <div className="p-5 text-center">Select a bounty from the list</div>
                }
            </div>
        </div>
    </Page>
}