import { useEffect, useState } from "react"
import { viewContractState, writeContract } from "arweavekit/contract"
import toast from 'react-hot-toast'
import Page from "../components/page";
import profile from "../assets/profile.svg"
import walletImg from "../assets/wallet.svg"
import deployment from "../../deployment.json"
import { shortAddr } from "../utils/functions";
import { type BountyEntry } from "./browse";

type params = {
    [foo: string]: string
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Profile({ wallet }: { wallet: any }) {
    const urlParams: params = {}
    const pstr = window.location.toString().split("?")
    pstr.length > 1 && pstr[1].split("&").forEach(param => {
        const [key, value] = param.split("=")
        urlParams[key] = value
    })
    if (urlParams.addr)
        console.log("Showing profile of", urlParams.addr)
    else if (wallet.connected)
        urlParams.addr = wallet.address


    const [isConnected, setIsConnected] = useState<boolean>(wallet.connected)
    const [address, setAddress] = useState<string>(urlParams.addr || wallet.address)
    const [newVisible, setNewVisible] = useState<boolean>(false)
    const [myBounties, setMyBounties] = useState<BountyEntry[]>([])

    const [newProject, setNewProject] = useState<string>("")
    const [newTitle, setNewTitle] = useState<string>("")
    const [newDescription, setNewDescription] = useState<string>("")
    const [newUrl, setNewUrl] = useState<string>("")
    const [newReward, setNewReward] = useState<string>("")


    async function newBounty() {
        console.log("adding bounty", newTitle)

        if (!wallet.connected) {
            toast.error("Please connect your wallet first")
            return
        }
        if (!newProject || !newTitle || !newDescription || !newUrl || !newReward) {
            toast.error("Please fill all the fields")
            return
        }

        const bounty = {
            projectName: newProject,
            title: newTitle,
            description: newDescription,
            url: newUrl,
            reward: newReward,
            atomicReward: false,
            creator: wallet.address,
            dateCreated: (new Date()).toDateString(),
            claimed: false
        }

        if (newReward.toLowerCase().endsWith("ar")) {
            bounty.atomicReward = false
            bounty.reward = newReward.toLowerCase().replace("ar", "").replace(" ", "")
        } else if (newReward.startsWith("https://")) {
            bounty.atomicReward = true
            bounty.reward = newReward
        } else {
            toast.error("Invalid reward amount. It should be an asset url or an amount of AR (e.g. 1.21 AR)")
            return
        }

        console.log("OK")

        const tx = await writeContract({
            wallet: wallet,
            environment: deployment.network === "mainnet" ? "mainnet" : "local",
            contractTxId: deployment.contractAddr,
            options: {
                function: "newBounty",
                bounty
            },
            strategy: "arweave"
        })

        console.log("tx", tx)

    }

    useEffect(() => {
        const fetchBounties = async () => {
            console.log("fetching bounties", address)
            if (!address) return
            const viewResult = await viewContractState({
                wallet: wallet,
                environment: deployment.network === "mainnet" ? "mainnet" : "local",
                contractTxId: deployment.contractAddr,
                options: {
                    function: "getBountiesForAddress",
                    address: address
                },
                strategy: "arweave"
            })
            console.log(viewResult.viewContract.result)
            setMyBounties(viewResult.viewContract.result)
        }
        fetchBounties()
    }, [address, wallet])

    // check for browser events
    useEffect(() => {
        window.addEventListener('WalletConnected', () => {
            console.log("connected")
            setIsConnected(true)
        })
        window.addEventListener('WalletDisconnected', () => {
            console.log("disconnected")
            setIsConnected(false)
        })

        if (urlParams.addr)
            setAddress(urlParams.addr)
        else if (wallet.connected)
            setAddress(wallet.address)

        return () => {
            window.removeEventListener('WalletConnected', () => { })
            window.removeEventListener('WalletDisconnected', () => { })
        }
    }, [urlParams.addr, wallet.address, wallet.connected])


    return <Page title="Profile | GitAR" wallet={wallet}>
        {newVisible && <div className="absolute top-0 left-0 w-screen h-screen bg-black/20 z-10 flex justify-center items-center" onClick={() => setNewVisible(false)}>
            <div className="bg-white/50 backdrop-blur rounded-xl p-3 ring-1 ring-black flex flex-col gap-3 min-w-[80vw] sm:min-w-[50vw]" onClick={(e) => e.stopPropagation()}>
                <input type="text" className="ring-1 ring-black p-1 rounded-lg" placeholder="Title" onChange={(e) => setNewTitle(e.target.value)} />
                <input type="text" className="ring-1 ring-black p-1 rounded-lg" placeholder="Project Name" onChange={(e) => setNewProject(e.target.value)} />
                <textarea className="ring-1 ring-black p-1 rounded-lg" placeholder="Description" onChange={(e) => setNewDescription(e.target.value)} />
                <input type="text" className="ring-1 ring-black p-1 rounded-lg" placeholder="Task URL" onChange={(e) => setNewUrl(e.target.value)} />
                <input type="text" className="ring-1 ring-black p-1 rounded-lg" placeholder="Reward Amount (AR) / Asset URL" onChange={(e) => setNewReward(e.target.value)} />
                <div className="flex justify-center gap-3">
                    <button className="bg-red-200 w-fit rounded-lg ring-1 ring-black p-1 px-3 hover:scale-105 hover:shadow-md transition-all duration-200" onClick={() => setNewVisible(false)}>Cancel</button>
                    <button className="bg-green-200 w-fit rounded-lg ring-1 ring-black p-1 px-3 hover:scale-105 hover:shadow-md transition-all duration-200" onClick={newBounty}>Add</button>
                </div>
            </div>
        </div>}
        <div className="ring-1 ring-black/60 sm:w-fit mx-auto rounded-xl p-3 flex flex-col sm:flex-row items-center justify-center gap-3 bg-white/50">
            {address && <>
                <img src={profile} className="rounded-full w-20 h-20 " alt="profile image" />
                <div className="flex flex-col justify-center items-center gap-2 p-1">
                    <div className="text-lg"><span className="hidden sm:flex">{address}</span><span className="flex sm:hidden">{shortAddr(address)}</span></div>
                    <button className="bg-red-200 w-fit rounded-lg ring-1 ring-black p-1 px-3 hover:scale-105 hover:shadow-md transition-all duration-200" onClick={() => setNewVisible(true)}>Add new bounty</button>
                </div>
            </>}
            {!isConnected && !urlParams.addr && <>
                <div>Login with Arweave</div>
                <button onClick={() => wallet.connect()}
                    className="flex ring-1 transition-all duration-200 hover:scale-105 ring-black rounded-lg m-1 px-3 hover:shadow-lg shadow-black justify-center items-center gap-2 p-1">
                    <img src={walletImg} width={20} className="" />
                    <span className="">Connect</span>
                </button>
            </>}
        </div>
        {address && <div>
            <div className="text-center text-2xl my-5 font-medium">
                Listed Bounties
            </div>
            {
                myBounties.length > 0 ? <div className="flex flex-col gap-3">
                    {myBounties.map((bounty, i) => {
                        return <div key={i} className="ring-1 ring-black p-2 rounded-lg bg-white/80 flex flex-col gap-2">
                            <div className="text-xl font-semibold">{bounty.title}</div>
                            {/* <div className="text-lg font-light">{bounty.description}</div> */}
                            {!bounty.claimed && <>
                                {bounty.atomicReward ? <div className="text-lg font-light bg-red-200 rounded-lg px-2 w-fit">Atomic Reward</div>
                                    : <div className="text-lg font-light bg-green-300 rounded-lg px-2 w-fit">{bounty.reward}</div>}
                            </>}
                            {bounty.claimed && <div className="text-lg font-light bg-green-300 rounded-lg px-2 w-fit">Solved ☑️</div>}
                        </div>
                    })}
                </div> : <div className="text-center">None listed</div>
            }
        </div>}
    </Page>
}