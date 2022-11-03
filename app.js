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

app.get("/user", (req, res) => {

  const payload = {
    slackUsername: "Benrobo",
    backend: true,
    age: 20,
    bio: `I"m a chef 🧑‍🍳, who cooks but not in a kitchen. I solve problem for a living using 1's and 0's 🧑‍💻.
      Fullstack Software Engineer`
  }
  return res.status(200).json(payload)
})


// handle mathematical calculation ( Task 3 )
app.post("/compute", (req, res) => {

  const validEnums = ["multiplication", "addition", "subtraction"]

  const { x, y, operation_type } = req.body;

  let result = 0;

  const sendPayload = (code = 200) => {
    if (code === 200) {
      return res.status(code).json({
        slackUsername: "Benrobo",
        operation_type,
        result
      })
    }
    return res.status(code).json({
      slackUsername: "Benrobo",
      operation_type: "Invalid operation type or value",
      result
    })
  }

  const isNotANumber = (param) => {
    return isNaN(parseInt(param))
  }

  console.log(isNotANumber(x))

  if (validEnums.includes(operation_type) && !isNotANumber(x) && !isNotANumber(y)) {

    try {
      operation_type === "addition" ?
        result = parseInt(x) + parseInt(y)
        :
        operation_type === "multiplication" ?
          result = parseInt(x) * parseInt(y)
          :
          operation_type === "subtraction" ?
            result = parseInt(x) - parseInt(y)
            :
            result = 0

      // send response to client
      return sendPayload(200)
    } catch (e) {
      // if an error occur
      return sendPayload(400)
    }
  }
  sendPayload(400)
})



app.listen(PORT, () => console.log(`server started at http://localhost:${PORT}`))