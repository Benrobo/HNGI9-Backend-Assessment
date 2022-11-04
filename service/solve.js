

// solves the question passed in and returns a result;
function solveQuestion(operation_type, x, y) {
    let result = 0;
    switch (operation_type) {
        case "multiply":
        case "multiplication":
        case "product":
        case "*":
            result = x * y
            break;
        case "subtract":
        case "subtraction":
        case "minus":
        case "-":
            result = x > y ? x - y : y - x
            break;
        case "addition":
        case "add":
        case "sum":
        case "plus":
        case "togetherness":
        case "+":
            result = x + y
            break;
        default:
            result = 0
            break;
    }
    return result
}

module.exports = solveQuestion