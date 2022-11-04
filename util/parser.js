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

    // valid mathematical terms
    const validEnums = ["multiplication", "addition", "subtraction", "multiply", "add", "subtract", "sum", "product", "togetherness", "plus", "+", "-", "*"];

    // valid mathmatical symbols
    const validMathSymb = ["+", "*", "-"]

    const opType = getAvailableTask(validEnums, sanitized_operation_type)

    // check if operational_type has duplicate types
    const duplicateTypes = checkDuplicateTypes(opType)

    parsedRes["type"] = duplicateTypes > 1 ? opType.join(" ") : opType.join(" ") || "Operation Type not found"


    // check if operation_type contain 3 chars / integer along with a mathmatical symbols ( 4 + 5 )

    // only works for the above  condition
    if (sanitized_operation_type.split(" ").length === 3) {
        const splitedOperationType = sanitized_operation_type.split(" ");

        // iterate over the array and check if each item is found in the validSymb
        const validateType = splitedOperationType.map((item) => {
            if (validEnums.includes(item)) {
                return item;
            }
            return item;
        })

        const extractNum = validateType.join("").match(/\d/ig)
        const extractSymb = validateType.join("").match(/\D/ig)

        const finalSolution = eval(`${+extractNum[0]} ${extractSymb[0]} ${+extractNum[1]}`)

        parsedRes["error"] = false;
        parsedRes["result"] = finalSolution;
        parsedRes["type"] = opType.join("")
        return parsedRes;
    }

    // only works if the typed passed in are > than the rquired length then use GPT-3 or intent calculation.

    if (sanitized_operation_type.split(" ").length > 1 && sanitized_operation_type.split(" ").length !== 3) {
        try {
            // predict output result
            const AI_PREDICTION = await predictIntent(sanitized_operation_type)
            const choices = AI_PREDICTION.choices[0];
            const finalRes = choices.text.split(" ")
            console.log(choices)
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
                case "*":
                    parsedRes["result"] = x * y
                    break;
                case "subtract":
                case "subtraction":
                case "minus":
                case "-":
                    parsedRes["result"] = x > y ? x - y : y - x
                    break;
                case "addition":
                case "add":
                case "sum":
                case "plus":
                case "togetherness":
                case "+":
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
            case "*":
                data = "multiplication"
                break;
            case "subtract":
            case "subtraction":
            case "minus":
            case "-":
                data = "subtraction"
                break;
            case "addition":
            case "add":
            case "sum":
            case "+":
                data = "addition"
                break;
            default:
                data = ""
                break;
        }

        return data
    })

    return newType
}


// check if a type array has duplicate types

function checkDuplicateTypes(operation_type) {
    let count = 0;
    const copyOptype = operation_type
    operation_type.map((data) => {
        if (copyOptype.includes(data)) {
            count += 1
        }
    })
    return count;
}

module.exports = parserOperationalResponse
