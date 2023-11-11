import { Link } from "react-router-dom"
import Page from "./components/page"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function App({ wallet }: any) {

  return <Page title="GitAR" wallet={wallet}>
    <div className="z-10 mx-auto">
      <div className="mx-auto bg-cover bg-center flex justify-center items-center pb-10 rounded-3xl w-full min-h-[80vh]"
        style={{ backgroundImage: "url('https://hub.easycrypto.com/wp-content/uploads/2023/04/Arweave-AR-crypto-tokens-floating-scaled.jpg')" }}
      >
        <div className="text-white text-3xl sm:text-4xl bg-[#080c3c]/60 backdrop-blur-sm p-2 text-center w-full">
          Contribute to the <span className="text-green-300 font-bold text-4xl sm:text-5xl">Arweave</span>
          <br />
          <span className="text-orange-300 font-bold text-4xl sm:text-5xl">Ecosystem</span> and collect rewards</div>
      </div>
      <div className="font-light text-center text-4xl my-10">How does it work?</div>
      <div className="my-10 text-center flex flex-col items-start justify-center gap-10 w-fit mx-auto">
        <div className="flex items-center gap-5">
          <span className="text-5xl bg-[#080c3c] text-white rounded-full p-2 px-5">1</span> <span className="text-4xl font-extralight"><span className="text-red-400 font-bold">Browse</span> issues and bounties</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-5xl bg-[#080c3c] text-white rounded-full p-2 px-5">2</span><span className="text-4xl font-extralight"><span className="text-yellow-500 font-bold">Work</span> on the specified task</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-5xl bg-[#080c3c] text-white rounded-full p-2 px-5">3</span> <span className="text-4xl font-extralight"><span className="text-blue-400 font-bold">Submit</span> a url that shows your work</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-5xl bg-[#080c3c] text-white rounded-full p-2 px-5">4</span><span className="text-4xl font-extralight"><span className="text-green-500 font-bold">Get rewarded</span> in Atomic Assets or AR</span>
        </div>
      </div>
      <Link to="/browse">
        <button className="text-center block my-20 text-3xl font-bold bg-green-400 text-white w-fit mx-auto p-3 px-5 rounded-xl hover:scale-105 hover:shadow-lg shadow-black transition-all duration-200">
          Checkout Latest Bounties
        </button>
      </Link>
    </div>
  </Page>
}