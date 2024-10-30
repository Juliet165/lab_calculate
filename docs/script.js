function parseNumber(input) {
    input = input.replace(",", ".");  

    if (/[^0-9\s.-]/.test(input)) {
        throw new Error("Некорректный ввод чисел: введите только цифры, пробелы и знак '-' для отрицательных чисел.");
    }

    if (/(?:^|\s)\s{2,}/.test(input) || /(?<=\s)\s{2,}/.test(input)) {
        throw new Error("Некорректный ввод чисел: неправильное использование пробелов.");
    }

    

    const validFormat = /^-?(\d{1,3}(?: \d{3})*|\d+)(?:\.\d+)?$/;
    if (!validFormat.test(input)) {
        throw new Error("Некорректный ввод чисел: проверьте формат.");
    }

    return input.replace(/\s+/g, ""); 
}


function isInRange(number) {
    const lowerLimit = new Decimal("-1000000000000.000000");
    const upperLimit = new Decimal("1000000000000.000000");
    return number.greaterThanOrEqualTo(lowerLimit) && number.lessThanOrEqualTo(upperLimit);
}


function formatResult(result) {
    let [integerPart, decimalPart] = result.toFixed(6).split('.');

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");  

    if (decimalPart) {
        decimalPart = decimalPart.replace(/0+$/, ""); 
    }

    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
}

function calculate() {
    const resultElement = document.getElementById('result');
    resultElement.innerText = ""; 
    resultElement.style.color = "#085f63"; 

    try {
        
        let firstNumber = parseNumber(document.getElementById('firstNumber').value);
        let secondNumber = parseNumber(document.getElementById('secondNumber').value);
        let operation = document.getElementById('operation').value;

        
        let num1 = new Decimal(firstNumber);
        let num2 = new Decimal(secondNumber);
        
        if (!isInRange(num1) || !isInRange(num2)) {
            throw new RangeError("Одно или оба введенных числа выходят за пределы допустимого диапазона.");
        }

        let result;

        switch (operation) {
            case 'add':
                result = num1.plus(num2);
                break;
            case 'subtract':
                result = num1.minus(num2);
                break;
            case 'multiply':
                result = num1.times(num2);
                break;
            case 'divide':
                if (num2.isZero()) {
                    throw new Error("Деление на ноль невозможно.");
                }
                result = num1.dividedBy(num2);
                break;
            default:
                throw new Error("Неизвестная операция.");
        }

        if (!isInRange(result)) {
            throw new RangeError("Результат выходит за пределы допустимого диапазона.");
        }

        resultElement.innerText = `Результат: ${formatResult(result)}`;
    } catch (error) {
        resultElement.innerText = `Ошибка: ${error.message}`;
        resultElement.style.color = "red"; // Цвет для ошибок
    }
}
