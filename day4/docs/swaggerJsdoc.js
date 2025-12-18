// const swaggerJsdoc = require("swagger-jsdoc");

// const options = {
//     definition: {
//         openapi: "3.0.0",
//         info: {
//             title: "Student Job Portal API",
//             version: "1.0.0",
//             description: "Day 4 + Day 5 JWT Auth API Documentation"
//         },
//         servers: [
//             {
//                 url: "http://localhost:3000"
//             }
//         ],
//         components: {
//             securitySchemes: {
//                 bearerAuth: {
//                     type: "http",
//                     scheme: "bearer",
//                     bearerFormat: "JWT"
//                 }
//             }
//         },
//         security: [
//             {
//                 bearerAuth: []
//             }
//         ]
//     },
//     apis: ["./routes/*.js"] // read comments from routes
// };

// module.exports = swaggerJsdoc(options);