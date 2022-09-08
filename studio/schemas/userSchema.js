export const userSchema = {
    name: "users",
    type: "document",
    title: "Users",
    fields: [
        {
            name: "name",
            type: "string",
            title: "Name",
        },
        {
            name: "walletAddress",
            type: "string",
            title: "Wallet Address",
        },
        {
            name: "profileImage",
            type: "string",
            title: "Profile Image"
        },
        {
            name: "password",
            type: "string",
            title: "Password"
        },
        {
            name: "type",
            type: "string",
            title: "Type"
        }
    ]
}