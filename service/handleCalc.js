const parserOperationalResponse = require("../util/parser");

async function handleCalculations(req, res) {


    const { error, x, y, result, msg } = await parserOperationalResponse(req.body)

    if (!error) {
        console.log(msg)
        return sendJsonResponse(res, 200, result)
    }
    return sendJsonResponse(res, 400, result)
}

module.exports = handleCalculations

function sendJsonResponse(res, code, oup) {
    res.status(code).json({
        slackUsername: "Benrobo",
        operation_type: "",
        result: oup
    })
}