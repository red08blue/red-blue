import { client } from "../../lib/sanity"

const createUserOnSanity = async (req, res) => {
    try {

        const userDoc = {
            _type: "users",
            _id: req.body.userWalletAddress,
            name: req.body.name,
            walletAddress: req.body.userWalletAddress,
            profileImage: req.body.profileImage,
            password: req.body.password,
            type: req.body.type
        }

        await client.createIfNotExists(userDoc).then(() => {
            res.status(200).send({
                message: "success"
            })
        }).catch(()=>{
            res.status(500).send({
                message: "error",
                data: error.message
            })
        })

    } catch (error) {
        res.status(500).send({
            message: "error",
            data: error.message
        })
    }
}

export default createUserOnSanity