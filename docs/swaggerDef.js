const swaggerConfig = {
    swaggerDefinition: {
        info: {
            title: "Library Management API",
            version: "0.0.1",
            description: "This is a documentation for the library management system. This is one of the major APIs to do CRUD operations on the library management system. This API is developed by Zuru Tech.",
            termsOfService: "https://zuru.tech/",
            contact: {
                email: "apiteam@zuru.tech"
            },
            host: "localhost:3001",
            basePath: "/",
            schemes: [
                "http"
            ],
            swagger: "2.0"
        },
    },
    apis: [
        "./routes/*.js"
    ],
};

module.exports = swaggerConfig;