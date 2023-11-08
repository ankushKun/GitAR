import Page from "./components/page"

export default function App() {

  return <Page title="GitAR">
    <div className="z-10 mx-auto">
      <div className="mx-auto bg-cover bg-center flex justify-center items-center pb-10 rounded-3xl w-full min-h-[80vh]"
        style={{ backgroundImage: "url('https://hub.easycrypto.com/wp-content/uploads/2023/04/Arweave-AR-crypto-tokens-floating-scaled.jpg')" }}
      >
        <div className="text-white text-3xl sm:text-4xl bg-[#080c3c]/60 backdrop-blur-sm p-2 text-center w-full">
          Contribute to <span className="text-orange-300 font-bold text-4xl sm:text-5xl">Opensource</span>
          <br />
          <span className="text-green-300 font-bold text-4xl sm:text-5xl">ARWEAVE</span> Apps and collect rewards</div>
      </div>
      <div className="font-light text-center text-4xl my-10">How does it work?</div>
      <div className="my-10 text-center flex flex-col items-start justify-center gap-10 w-fit mx-auto">
        <div className="flex items-center gap-5">
          <span className="text-5xl bg-[#080c3c] text-white rounded-full p-2 px-5">1</span> <span className="text-4xl font-extralight"><span className="text-red-400 font-bold">Browse</span> issues and bounties</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-5xl bg-[#080c3c] text-white rounded-full p-2 px-5">2</span><span className="text-4xl font-extralight"><span className="text-yellow-500 font-bold">Fork</span> the repo and start working</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-5xl bg-[#080c3c] text-white rounded-full p-2 px-5">3</span> <span className="text-4xl font-extralight"><span className="text-blue-400 font-bold">Submit</span> a pull request</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-5xl bg-[#080c3c] text-white rounded-full p-2 px-5">4</span><span className="text-4xl font-extralight"><span className="text-green-500 font-bold">Get rewarded</span> in Atomic Assets or AR</span>
        </div>
      </div>
    </div>
  </Page>
}