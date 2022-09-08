import sanityClient from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import { SANITY_PROJECT_ID, SANITY_TOKEN } from "../secret"

export const client = sanityClient({
    //projectId: process.env.SANITY_PROJECT_ID,
    projectId: SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: 'v1',
    useCdn: true,
    //token: process.env.SANITY_TOKEN,
    token: SANITY_TOKEN
})

const build = imageUrlBuilder(client)

export const urlFor = (source) => build.image(source)