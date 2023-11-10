import { useEffect, useState } from "react";
import Page from "../components/page";
import profile from "../assets/profile.svg"
import walletImg from "../assets/wallet.svg"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Profile({ wallet }: { wallet: any }) {
    const [isConnected, setIsConnected] = useState<boolean>(wallet.connected)

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
    }, [])

    const shortAddr = isConnected ? wallet.address.slice(0, 5) + "..." + wallet.address.slice(-5) : ""

    return <Page title="Profile | GitAR" wallet={wallet}>
        <div className="ring-1 ring-black/60 sm:w-fit mx-auto rounded-xl p-3 flex flex-col sm:flex-row items-center justify-center gap-3 bg-white/50">
            {isConnected && <>
                <img src={profile} className="rounded-full w-20 h-20 " alt="profile image" />
                <div className="flex flex-col justify-center items-center gap-2 p-1">
                    <div className="text-lg"><span className="hidden sm:flex">{wallet?.address}</span><span className="flex sm:hidden">{shortAddr}</span></div>
                    <button className="bg-red-200 w-fit rounded-lg ring-1 ring-black p-1 px-3 hover:scale-105 hover:shadow-md transition-all duration-200">Add new bounty</button>
                </div>
            </>}
            {!isConnected && <>
                <div>Login with Arweave</div>
                <button onClick={() => wallet.connect()}
                    className="flex ring-1 transition-all duration-200 hover:scale-105 ring-black rounded-lg m-1 px-3 hover:shadow-lg shadow-black justify-center items-center gap-2 p-1">
                    <img src={walletImg} width={20} className="" />
                    <span className="">Connect</span>
                </button>
            </>}
        </div>
        {isConnected && <div>
            <div className="text-center text-2xl my-5 font-medium">
                My Bounties
            </div>
        </div>}
    </Page>
}