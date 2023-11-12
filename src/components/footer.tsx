import { Link } from "react-router-dom"
import perma from "../assets/perma.svg"

export default function Footer() {
    return <div className="w-full bg-[#222326] text-white p-5 px-10 flex gap-4 flex-col sm:flex-row items-center justify-between">
        <Link to="https://ankushKun.github.io" target="_blank" className="text-lg">
            <pre>
                {" "}∧  ,,, ∧ <br />
                (  ̳• · • ̳) <br />
                /    づ <span className="font-sans">Made with ❤️ by Ankush</span>
            </pre>
        </Link>
        <div className="flex gap-4 items-center justify-center">
            <Link to="https://github.com/ankushKun/gitar" target="_blank" className="flex flex-col items-center text-xs gap-1">
                <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="github logo" className=" rounded-full" width={50} />
                <span className="">Opensourced</span>
            </Link>
            <Link to="https://arweave.org" target="_blank"><img src={perma} alt="permanent on arweave" width={150} /></Link>
        </div>
    </div>
}