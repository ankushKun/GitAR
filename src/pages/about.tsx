import Page from "../components/page";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function About({ wallet }: any) {
    return <Page title="About | GitAR" wallet={wallet}>
        <div className="flex flex-col gap-4">
            <div className="text-center text-3xl font-semibold">What is GitAR?</div>
            <div className="text-justify">GitAR is a platform where arweave developers can list their opensource products and assign bounties or rewards for solving issues, reporting bugs and contributing to the development.</div>
            <div className="text-justify">This will speedup the whole development - testing process and useage of the arweave ecosystem since more users will be interested in trying out applications and contributing to it for collectible rewards</div>
            <div className="text-justify">The rewards can be in the form of AR or Atomic Assets</div>
            <div></div>
            <div className="text-center text-3xl font-semibold">Simplified user flow</div>
            <div className="text-justify">1. Developers join the platform, list their repos github issues, and assign a specified bounty amount or reward asset</div>
            <div className="text-justify">2. Users browse through the list of issues and start working on them</div>
            <div className="text-justify">3. Users fork the repo, work on the issue and submit a pull request</div>
            <div className="text-justify">4. Developers review the pull request and merge it if it's valid</div>
            <div className="text-justify">5. Users receive the reward on successful contribution</div>
            <div className="text-justify">6. Arweave ecosystem grows!</div>
        </div>
    </Page>
}