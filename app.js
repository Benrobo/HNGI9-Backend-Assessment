const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
// middleware setup
app.use(cors()) // prevent CORS error.
app.use(bodyParser.json({ extended: true })) // allows sending of data from client in json format.



const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {

	return res.send(`
 			<h1> Hello World </h1>
 	`)
})


app.listen(PORT, () => console.log(`server started at http://localhost:${PORT}`))