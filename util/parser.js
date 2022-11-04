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

    const validEnums = ["multiplication", "addition", "subtraction", "multiply", "add", "divide", "subtract", "division", "sum", "product", "togetherness"];

    const opType = getAvailableTask(validEnums, operation_type)
    parsedRes["type"] = opType.join(" ")

    if (operation_type.length > 15) {
        try {
            // predict output result
            const AI_PREDICTION = await predictIntent(operation_type)
            const choices = AI_PREDICTION.choices[0];
            const finalRes = choices.text.split(" ")
            parsedRes["result"] = +finalRes[finalRes.length - 1].trim().replace(".", '').replace(",", "")
            return parsedRes
        } catch (e) {
            parsedRes.error = true;
            parsedRes["msg"] = "AI Prediction Failed.." + e.message
            parsedRes["result"] = 0;
            return parsedRes
        }
    }
    else {
        console.log(operation_type)
        if (validEnums.includes(operation_type.toLowerCase())) {
            switch (operation_type) {
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
                    parsedRes["result"] = x + y
                    break;
                case "divide":
                case "division":
                    parsedRes["result"] = x / y
                    break;

                default:
                    parsedRes["result"] = 0
                    break;
            }
            return parsedRes
        }
        parsedRes.error = true;
        parsedRes["msg"] = "Invalid Operational Type"
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