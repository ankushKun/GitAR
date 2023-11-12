import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { viewContractState } from "arweavekit/contract"
import toast from "react-hot-toast";
import { writeContract } from "arweavekit/contract";
import { timeStrToRelativeTime, shortAddr } from "../utils/functions";
import Page from "../components/page";
import deployment from "../../deployment.json"
import useParams from "../hooks/useParams";

type claimData = {
    url: string,
    creator: string,
}

export type BountyEntry = {
    id?: string,
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
    const urlParams = useParams()
    const [bounties, setBounties] = useState<BountiesState>({})
    const [selectedBounty, setSelectedBounty] = useState<BountyEntry | null>(null)
    const [submitClaimVisible, setSubmitClaimVisible] = useState<boolean>(false)
    const [claimUrl, setClaimUrl] = useState<string>("")

    useEffect(() => {
        setSubmitClaimVisible(false)
        setClaimUrl("")
        // set url parameters to none
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {}
        const pstr = window.location.toString().split("?")
        pstr.length > 1 && pstr[1].split("&").forEach(param => {
            const [key, value] = param.split("=")
            params[key] = value
        })
        window.history.pushState({}, "", pstr[0])
    }, [selectedBounty])

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
            if (urlParams.id) {
                setSelectedBounty(viewResult.viewContract.result[urlParams.id])
            }
        }
        fetchBounties()
    }, [urlParams.id, wallet])

    async function submitClaim() {
        console.log("submitting claim", selectedBounty?.title)

        if (!wallet.connected) {
            toast.error("Please connect your wallet first")
            return
        }
        if (!selectedBounty) {
            toast.error("Please select a bounty first")
            return
        }
        if (!claimUrl) {
            toast.error("Please enter a valid URL")
            return
        }

        try {
            const tx = await writeContract({
                wallet: wallet,
                contractTxId: deployment.contractAddr,
                environment: deployment.network === "mainnet" ? "mainnet" : "local",
                options: {
                    function: "submitClaim",
                    claimData: {
                        bountyId: selectedBounty.id,
                        url: claimUrl
                    }
                },
                strategy: "arweave"
            })
            console.log(tx)
            toast.success("Claim submitted successfully")
            setSubmitClaimVisible(false)
            setClaimUrl("")
            setSelectedBounty(null)
        } catch (err) {
            console.log(err)
            toast.error("Error submitting claim, check console for details")
        }
    }


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
                        <div className="flex justify-between">
                            <div className="text-2xl font-semibold mt-5">Submitted Solutions</div>
                            <button className={`${submitClaimVisible ? "bg-red-200" : "bg-green-100"} rounded-lg p-1 px-2 my-3 ${selectedBounty.claimed ? "bg-gray-300" : "hover:scale-105 hover:shadow-lg"} transition-all duration-200 ring-1 ring-black/50`}
                                onClick={() => setSubmitClaimVisible(!submitClaimVisible)} disabled={selectedBounty.claimed}
                            >{submitClaimVisible ? "Cancel" : "Submit Your Solution"}</button>
                        </div>
                        {
                            submitClaimVisible && <div className="flex flex-col gap-3 mb-3 ring-1 p-1 rounded-lg ring-black/40">
                                <div className="flex gap-2">
                                    <input type="url" className="grow ring-1 ring-black p-1 rounded-lg" placeholder="Solution URL" onChange={(e) => setClaimUrl(e.target.value)} />
                                    <button className="bg-green-200 w-fit rounded-lg ring-1 ring-black p-1 px-3 hover:scale-105 hover:shadow-md transition-all duration-200" onClick={submitClaim}>Submit</button>
                                </div>
                            </div>
                        }
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