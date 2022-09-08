import { clusterApiUrl, PublicKey } from "@solana/web3.js"
import process from "./process.json"

export const CLUSTER = "devnet"
export const SOLANA_HOST = "https://api.devnet.solana.com/"

export const STABLE_POOL_PROGRAM_ID = new PublicKey(
    "DGSAqH69w6bPthAQojYoNWscJdK4Dww896rwxhuQ4tmh"
)

export const STABLE_POOL_IDL = process