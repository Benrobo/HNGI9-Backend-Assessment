const predictIntent = require("../service/predictIntent");
const solveQuestion = require("../service/solve");


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
    const validEnums = ["multiplication", "addition", "subtraction", "multiply", "add", "subtract", "difference", "sum", "product", "togetherness", "plus", "+", "-", "*"];

    // valid mathmatical symbols
    const validMathSymb = ["+", "*", "-"]

    const opType = getAvailableTask(validEnums, sanitized_operation_type)

    // check if operational_type has duplicate types
    const duplicateTypes = checkDuplicateTypes(opType)

    parsedRes["type"] = duplicateTypes > 1 ? opType.join(" ") : opType.join(" ") || "Operation Type not found"

    // check if the opreation_type feels like a question without number.
    const { hasNumber, type } = checkIfOptypeHasQuestion(validEnums, operation_type)

    // if the operation_type has only a question 
    // without any number present.
    // if (hasNumber === false && (isNumber(x) && isNumber(y))) {
    //     const result = solveQuestion(type, x, y);
    //     parsedRes["result"] = result;
    //     return parsedRes
    // }

    if (sanitized_operation_type.split(" ").length > 1 && sanitized_operation_type.split(" ").length !== 3 && hasNumber === false && (isNumber(x) && isNumber(y))) {
        // const result = solveQuestion(type, x, y);
        parsedRes["result"] = 0;
        parsedRes["type"] = "invalid operator type";
        parsedRes["error"] = true;
        return parsedRes
    }


    // check if operation_type contain 3 chars / integer along with a mathmatical symbols ( 4 + 5 )
    // only works for the above  condition
    if (sanitized_operation_type.split(" ").length === 3 && hasNumber) {
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

    if (sanitized_operation_type.split(" ").length > 1 && sanitized_operation_type.split(" ").length !== 3 && hasNumber) {
        try {
            // predict output result
            const AI_PREDICTION = await predictIntent(sanitized_operation_type)
            const choices = AI_PREDICTION.choices[0];
            const finalRes = choices.text.split(" ")
            console.log(choices)
            parsedRes["result"] = +finalRes[finalRes.length - 1].trim().replace("/(.+)(.)$/", '').replace(",", "")
            return parsedRes
        } catch (e) {
            console.log(e)
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
            const result = solveQuestion(sanitized_operation_type, x, y);
            parsedRes["result"] = result;
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


// check if operation_type contains only questions with valid type without any number.
// but x and y values has a number.

function checkIfOptypeHasQuestion(validType, operational_type) {
    const hasNumber = operational_type.match(/\d/ig)
    let obj = { hasNumber, type: "" }

    const opType = operational_type.split(" ").map((data, i) => {
        return validType.indexOf(data)
    }).filter(num => num > 0)[0];

    // if a number is present, it isn't a question
    if (hasNumber !== null) {
        obj.hasNumber = true;
        obj.type = validType[opType];
        return obj
    }

    // if a number isn't present, it a question.
    obj.hasNumber = false;
    obj.type = validType[opType];
    return obj
}


const isNumber = (x) => {
    return typeof parseInt(x) !== "NaN" ? true : false
}

module.exports = parserOperationalResponse
