import { useConnection, usePublicKey } from "arweave-wallet-kit"

export default function Navbar() {
    const pk = usePublicKey();
    const { connected, connect, disconnect } = useConnection();

    return <nav className="flex justify-between p-2">
        <div>

        </div>
        <button onClick={connected ? disconnect : connect} className="ring-2 ring-black rounded-lg m-1 px-3 hover:shadow-lg shadow-black">{connected ? `disconnect (${pk?.slice(0, 3)}...${pk?.slice(pk?.length - 3, pk?.length)})` : `connect`}</button>
    </nav>
}