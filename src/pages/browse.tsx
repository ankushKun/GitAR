import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { viewContractState } from "arweavekit/contract"
import { timeStrToRelativeTime, shortAddr } from "../utils/functions";
import Page from "../components/page";
import deployment from "../../deployment.json"

type claimData = {
    url: string,
    creator: string,
}

export type BountyEntry = {
    projectName: string,
    title: string,
    description: string,
    url: string,
    reward: string,
    atomicReward: boolean,
    creator: string,
    dateCreated: string,
    claimed: boolean,
    claimData: claimData[],
    claimIdx?: number,

}

export type BountiesState = {
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
                environment: deployment.network === "mainnet" ? "mainnet" : "local",
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
            {!data.claimed && <>
                {data.atomicReward ? <div className="text-lg font-light bg-red-200 rounded-lg px-2 w-fit">Atomic Reward</div>
                    : <div className="text-lg font-light bg-green-300 rounded-lg px-2 w-fit">{data.reward}</div>}
            </>}
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
                    selectedBounty ? <div className="p-7 h-[75vh] sm:h-auto overflow-y-scroll">
                        <button className="sm:hidden absolute right-5 top-3 ring-1 ring-black px-2 font-bold rounded-full bg-white" onClick={() => setSelectedBounty(null)}>X</button>
                        <div className="text-3xl font-semibold">{selectedBounty.title}</div>
                        <div className="text-lg text-right">Project: <span className="font-semibold">{selectedBounty.projectName}</span></div>
                        <div className="text-gray-600">{timeStrToRelativeTime(selectedBounty.dateCreated)} by <Link to={`/profile?addr=${selectedBounty.creator}`} className="hover:text-black hover:underline underline-offset-4">{selectedBounty.creator}</Link></div>
                        <div className="text-xl text-justify my-10">{selectedBounty.description}</div>
                        <div className="flex">
                            {!selectedBounty.atomicReward && <div className="text-2xl font-light bg-green-300 w-fit px-2 rounded-lg"> Worth {selectedBounty.reward}</div>}
                            {selectedBounty.atomicReward && <Link to={selectedBounty.url} target="_blank">
                                <button className=" bg-red-200 text-2xl rounded-lg p-1 px-2 hover:scale-105 transition-all duration-200">View Atomic Reward</button>
                            </Link>}
                            {selectedBounty.claimed && <div className="text-2xl font-light bg-green-300 w-fit px-2 rounded-lg ml-2">Claimed ☑️</div>}
                        </div>
                        <div className="text-2xl font-semibold my-2 mt-6">Submitted Solutions</div>
                        {(selectedBounty.claimData?.length > 0) ? <div className="flex flex-col gap-3 overflow-scroll p-0.5">
                            {selectedBounty.claimData?.map((claim, i) => {
                                return <div className={`flex gap-5 items-cetner justify-center ${i == selectedBounty.claimIdx ? "bg-green-200" : "bg-zinc-100"} ring-1 ring-black/50 rounded-lg p-2 w-fit`}>
                                    {i == selectedBounty.claimIdx && <div className="">⛳️</div>}
                                    <div className="hidden sm:flex">{claim.creator}</div>
                                    <div className="flex sm:hidden">{shortAddr(claim.creator)}</div>
                                    <Link to={claim.url} target="_blank" className="font-semibold ring-1 ring-black/50 rounded-lg px-1 hover:scale-105 transition-all duration-200 hover:shadow-lg shadow-black">View Solution</Link>
                                </div>
                            })}
                        </div> : <div>No submissions yet</div>}
                    </div> :
                        <div className="p-5 text-center">Select a bounty from the list</div>
                }
            </div>
        </div>
    </Page>
}