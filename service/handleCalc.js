const parserOperationalResponse = require("../util/parser");

async function handleCalculations(req, res) {


    const { error, x, y, result, msg, type } = await parserOperationalResponse(req.body)

    if (!error) {
        console.log(msg)
        return sendJsonResponse(res, 200, type, result)
    }
    console.log(msg)
    return sendJsonResponse(res, 400, type, result)
}

module.exports = handleCalculations

function sendJsonResponse(res, code, type, oup) {
    res.status(code).json({
        slackUsername: "benrobo",
        result: oup,
        operation_type: type.toLowerCase(),
    })
}