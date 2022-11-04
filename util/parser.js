const predictIntent = require("../service/predictIntent");


async function parserOperationalResponse(payload) {

    const { operation_type, x, y } = payload;
    let parsedRes = {
        x,
        y,
        error: false,
        msg: "",
        type: "",
        result: 0
    };
    // sanitized any operation passed in.
    const sanitized_operation_type = operation_type.trim().toLowerCase()

    const validEnums = ["multiplication", "addition", "subtraction", "multiply", "add", "subtract", "sum", "product", "togetherness", "plus"];

    const opType = getAvailableTask(validEnums, sanitized_operation_type)
    parsedRes["type"] = opType.join(" ") || "Operation Type not found"


    if (sanitized_operation_type.split(" ").length > 1) {
        try {
            // predict output result
            const AI_PREDICTION = await predictIntent(sanitized_operation_type)
            const choices = AI_PREDICTION.choices[0];
            const finalRes = choices.text.split(" ")
            parsedRes["result"] = +finalRes[finalRes.length - 1].trim().replace("/(.+)(.)$/", '').replace(",", "")
            return parsedRes
        } catch (e) {
            console.log(e.message)
            parsedRes.error = true;
            parsedRes["msg"] = "Invalid Operation Type"
            parsedRes["type"] = "Invalid Operation Type. AI Prediction failed."
            parsedRes["result"] = 0;
            return parsedRes
        }
    }
    else {
        // console.log(operation_type)
        if (validEnums.includes(sanitized_operation_type)) {
            switch (operation_type.trim().toLowerCase()) {
                case "multiply":
                case "multiplication":
                case "product":
                    parsedRes["result"] = x * y
                    break;
                case "subtract":
                case "subtraction":
                case "minus":
                    parsedRes["result"] = x > y ? x - y : y - x
                    break;
                case "addition":
                case "add":
                case "sum":
                case "plus":
                case "togetherness":
                    parsedRes["result"] = x + y
                    break;
                default:
                    parsedRes["result"] = 0
                    break;
            }
            return parsedRes
        }
        parsedRes.error = true;
        parsedRes["msg"] = "Invalid Operation Type"
        parsedRes["type"] = "Invalid Operation Type"
        parsedRes["result"] = 0;
        return parsedRes
    }
}

function getAvailableTask(validEnums, operation_type) {
    const arrOptype = operation_type.split(" ")
    const filteredType = arrOptype.filter((data, i) => validEnums.includes(data))

    const newType = filteredType.map((data) => {
        switch (data) {
            case "multiply":
            case "multiplication":
            case "product":
                data = "Multiplication"
                break;
            case "subtract":
            case "subtraction":
            case "minus":
                data = "Subtraction"
                break;
            case "addition":
            case "add":
            case "sum":
                data = "Addition"
                break;
            case "divide":
            case "division":
                data = "Division"
                break;

            default:
                data = ""
                break;
        }

        return data
    })

    return newType
}

module.exports = parserOperationalResponse
