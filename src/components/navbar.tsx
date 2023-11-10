import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import walletImg from "../assets/wallet.svg"
import hamMenu from "../assets/hamburger.svg"

const MenuLinks = [
    { to: "/profile", text: "Profile" },
    { to: "/browse", text: "Browse" },
    { to: "/about", text: "About" },
]



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Navbar({ wallet }: { wallet: any }) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [_menuOpen, _setMenuOpen] = useState<boolean>(false)
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

    useEffect(() => {
        if (menuOpen) {
            _setMenuOpen(true)
        } else {
            setTimeout(() => {
                _setMenuOpen(false)
            }, 210)
        }
    }, [menuOpen])

    function connect() {
        wallet.connect()
    }

    function disconnect() {
        wallet.disconnect()
    }

    function menuToggle() {
        setMenuOpen(!menuOpen)
    }

    const MenuLink = ({ to, text }: { to: string, text: string }) => {
        return <Link to={to} className="text-3xl sm:text-lg">{text}</Link>
    }

    return <nav className="flex justify-between items-center border-black">
        <Link to="/" className="font-light tracking-widest hover:font-medium text-2xl hover:tracking-[5px] transition-all duration-200">🎸 GitAR</Link>
        <div className="hidden sm:flex gap-10 items-center">
            {
                MenuLinks.map((link, i) => {
                    return <MenuLink key={i} to={link.to} text={link.text} />
                })
            }
            <button onClick={isConnected ? disconnect : connect}
                className="flex ring-1 transition-all duration-200 hover:scale-105 ring-black rounded-lg m-1 px-3 hover:shadow-lg shadow-black justify-center items-center gap-2 p-1">
                <img src={walletImg} width={20} />
                <span className="hidden sm:flex">{isConnected ? `${wallet.address?.slice(0, 3)}...${wallet.address?.slice(wallet.address?.length - 3, wallet.address?.length)}` : `Connect`}</span>
            </button>
        </div>
        <button onClick={menuToggle}
            className="ring-1 transition-all duration-200 hover:scale-105 ring-black rounded-lg m-1 px-3 hover:shadow-lg shadow-black flex justify-center items-center gap-2 p-1 sm:hidden">
            <img src={hamMenu} width={22} />
        </button>
        {_menuOpen && <div id="menu" className={`${menuOpen ? "slide-in-bottom" : "slide-out-bottom"} fixed bg-[#080c3c]/70 w-full h-3/4 border border-black rounded-t-3xl p-10 backdrop-blur z-20 text-white bottom-0 left-0 right-0 flex flex-col items-end gap-10`}>
            <button onClick={menuToggle} className=" ring-1 ring-white/20 rounded-full p-1 px-3 -m-5">X</button>
            <button onClick={isConnected ? disconnect : connect}
                className="flex ring-1 transition-all duration-200 hover:scale-105 ring-white rounded-lg m-1 px-3 hover:shadow-lg shadow-black justify-center items-center gap-2 p-1 absolute bottom-20 text-white">
                <img src={walletImg} width={20} className="invert" />
                <span className="">{isConnected ? `${wallet.address?.slice(0, 3)}...${wallet.address?.slice(wallet.address?.length - 3, wallet.address?.length)}` : `Connect`}</span>
            </button>
            {MenuLinks.map((link, i) => {
                return <MenuLink key={i} to={link.to} text={link.text} />
            })}
        </div>}
    </nav>
}