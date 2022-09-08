import { client } from "../../lib/sanity";

const getUser = async (req, res) => {

    try {
        const query = `*[_type == "users" && _id == $id]{
        name,
        walletAddress,
        profileImage,
        password,
        type
    }`
        const params = { id: req.body.id }

        const sanityResponse = await client.fetch(query, params)

        res.status(200).send({
            message: 'success',
            data: sanityResponse
        })

    } catch (error) {
        res.status(500).send({
            message: "error",
            data: error.message
        })
    }
}

export default getUser