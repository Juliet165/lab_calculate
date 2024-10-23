function parseNumber(input) {
    input = input.replace(",", ".");
    return input;
}

function isInRange(number) {
    const lowerLimit = new Decimal("-1000000000000.000000");
    const upperLimit = new Decimal("1000000000000.000000");

    return number.greaterThanOrEqualTo(lowerLimit) && number.lessThanOrEqualTo(upperLimit);
}

function calculate() {
    // Получаем значения полей
    let firstNumber = parseNumber(document.getElementById('firstNumber').value);
    let secondNumber = parseNumber(document.getElementById('secondNumber').value);
    let operation = document.getElementById('operation').value;

    try {
        let num1 = new Decimal(firstNumber);
        let num2 = new Decimal(secondNumber);

        if (!isInRange(num1) || !isInRange(num2)) {
            throw new RangeError("Одно или оба введенных числа выходят за пределы допустимого диапазона.");
        }

        let result;

        if (operation === 'add') {
            result = num1.plus(num2);
        } else if (operation === 'subtract') {
            result = num1.minus(num2);
        }

        if (!isInRange(result)) {
            throw new RangeError("Результат выходит за пределы допустимого диапазона.");
        }

        document.getElementById('result').innerText = `Результат: ${result.toFixed(6)}`;
    } catch (error) {
        if (error instanceof RangeError) {
            alert("Ошибка: " + error.message);
        } else {
            alert("Ошибка: Неверный ввод чисел.");
        }
    }
}
