const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const colors = require('colors')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db')
const path = require('path')

const port = process.env.PORT || 5000
// require('dotenv').config({ debug: process.env.DEBUG })

const app = express()

/**
 * GraphiQL
 * GraphiQL is a great tool for debugging and inspecting a server,
 * so we recommend running it whenever your application is in development mode.
 */

// Connect to the MongoDB database through Mongoose
connectDB()

// Configure CORS
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and LoadBalancer IPs
    const allowedOrigins = [
      'http://localhost',
      'http://localhost:3000',
      /^http:\/\/10\.\d+\.\d+\.\d+(?::\d+)?$/
    ];

    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return origin === allowed;
    });

    if (isAllowed) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

/**
 * app.use()
 * the middleware function is executed when the base of the requested path matches path.
 */
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true // Since we configured graphqlHTTP with graphiql: true, you can use the GraphiQL tool to manually issue GraphQL queries
  })
)

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
  // Set build folder as static folder
  app.use(express.static(path.join(__dirname, '../client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Project Management App' })
  })
}

/**
 * app.listen()
 * Starts a UNIX socket and listens for connections on the given path.
 * This method is identical to Node’s http.Server.listen().
 */
app.listen(port, console.log(`Running a GraphQL API server at port ${port}`))
