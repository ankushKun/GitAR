/* eslint-disable no-undef */
// import { ContractError } from "warp-contracts"

function addGithubUsername(state, action) {
    const githubUsername = action.input.githubUsername
    if (!githubUsername) throw new ContractError("Github Username is required")
    state.users[action.caller] = githubUsername

    return { state }
}

function newBounty(state, action) {
    const bounty = action.input.bounty

    if (!bounty.projectName) throw new ContractError("Project Name is required")
    if (!bounty.title) throw new ContractError("Title is required")
    if (!bounty.description) throw new ContractError("Description is required")
    if (!bounty.url) throw new ContractError("URL is required")
    if (bounty.atomicReward == undefined) bounty.atomicReward = false

    bounty.creator = action.caller
    bounty.claimed = false
    bounty.dateCreated = new Date()
    bounty.claimData = []

    state.bounties[state.bcount + 1] = bounty
    state.bcount += 1

    return { state }
}

function submitClaim(state, action) {
    const claimData = action.input.claimData
    if (!claimData) throw new ContractError("Claim Data is required")
    if (!claimData.bountyId) throw new ContractError("Bounty Id is required")
    if (!claimData.url) throw new ContractError("URL is required")
    const bounty = state.bounties[claimData.bountyId]
    if (!bounty) throw new ContractError("Bounty does not exist")
    if (bounty.claimed) throw new ContractError("Bounty already claimed")
    claimData.creator = action.caller
    if (!bounty.claimData) bounty.claimData = []
    delete claimData.bountyId
    bounty.claimData.push(claimData)

    return { state }
}

function approveClaim(state, action) {
    const bountyId = action.input.bountyId
    if (!bountyId) throw new ContractError("Bounty Id is required")
    const bounty = state.bounties[bountyId]
    if (!bounty) throw new ContractError("Bounty does not exist")
    if (!action.caller == bounty.creator) throw new ContractError("Only the creator of the bounty can approve claims")
    if (bounty.claimed) throw new ContractError("Bounty already claimed")
    if (!bounty.claimData) throw new ContractError("No claim data found")
    const claimData = bounty.claimData
    if (claimData.length == 0) throw new ContractError("No claim data found")
    const claimIdx = action.input.claimIdx
    if (!claimIdx) throw new ContractError("Claimed Index is required")
    const claim = claimData[claimIdx]
    if (!claim) throw new ContractError("Claim does not exist")

    bounty.claimed = true
    bounty.claimedBy = claim.creator
    bounty.solutionUrl = claim.url

    return { state }
}

function getBounties(state) {
    return { result: state.bounties }
}

function getBounty(state, action) {
    const bountyId = action.input.bountyId
    if (!bountyId) throw new ContractError("Bounty Id is required")
    const bounty = state.bounties[bountyId]
    if (!bounty) throw new ContractError("Bounty does not exist")

    return { result: bounty }
}

function getBountiesForAddress(state, action) {
    const address = action.input.address
    console.log(address)
    if (!address) throw new ContractError("Address is required")
    const bounties = Object.values(state.bounties).filter(b => {
        console.log(b.creator, address)
        return b.creator == address
    })

    return { result: bounties }
}

export function handle(state, action) {
    const input = action.input
    switch (input.function) {
        // WRITE
        case 'addGithubUsername':
            return addGithubUsername(state, action)
        case 'newBounty':
            return newBounty(state, action)
        case 'submitClaim':
            return submitClaim(state, action)
        case 'approveClaim':
            return approveClaim(state, action)
        // READ
        case 'getBounties':
            return getBounties(state)
        case 'getBounty':
            return getBounty(state, action)
        case 'getBountiesForAddress':
            return getBountiesForAddress(state, action)
        default:
            throw new ContractError(`No function supplied or function not recognised: "${input.function}".`)
    }
}