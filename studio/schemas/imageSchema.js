export default {
    name: "photo",
    title: "Photo", // name of the model
    type: "document",
    fields: [
        {
            name: "image", // name of the field
            title: "Image",
            // photos are identified in the sanity database by the keyword image
            type: "image",
            options: {
                hotspot: true,
            },
        },
    ],
}