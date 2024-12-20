       document.getElementById('calculateButton').addEventListener('click', calculate);

        // Функция для парсинга чисел
        function parseNumber(input) {
            input = input.replace(",", ".");
            if (/[^0-9\s.-]/.test(input)) {
                throw new Error("Некорректный ввод чисел");
            }
            return input.replace(/\s+/g, "");
        }

        // Проверка, что число в пределах допустимого диапазона
        function isInRange(number) {
            const lowerLimit = new Decimal("-100000000000000.0000000000");
            const upperLimit = new Decimal("100000000000000.0000000000");
            return number.greaterThanOrEqualTo(lowerLimit) && number.lessThanOrEqualTo(upperLimit);
        }

        // Форматирование результата
        function formatResult(result) {
            let [integerPart, decimalPart] = result.toFixed(10).split('.');
            integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            if (decimalPart) {
                decimalPart = decimalPart.replace(/0+$/, "");
            }
            return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
        }

        // Функция вычислений
        function calculate() {
    const resultElement = document.getElementById('result');
    const roundedResultElement = document.getElementById('roundedResult');
    resultElement.innerText = "";
    resultElement.style.color = "#085f63";

    try {
        // Считывание входных данных
        let firstNumber = parseNumber(document.getElementById('firstNumber').value || "0");
        let secondNumber = parseNumber(document.getElementById('secondNumber').value || "0");
        let thirdNumber = parseNumber(document.getElementById('thirdNumber').value || "0");
        let fourthNumber = parseNumber(document.getElementById('fourthNumber').value || "0");

        let operation1 = document.getElementById('operation1').value || "add";
        let operation2 = document.getElementById('operation2').value || "add";
        let operation3 = document.getElementById('operation3').value || "add";

        // Преобразование строк в числа с использованием Decimal.js
        let num1 = new Decimal(firstNumber);
        let num2 = new Decimal(secondNumber);
        let num3 = new Decimal(thirdNumber);
        let num4 = new Decimal(fourthNumber);

        // Проверка диапазона введенных чисел
        if (!isInRange(num1) || !isInRange(num2) || !isInRange(num3) || !isInRange(num4)) {
            throw new RangeError("Одно или несколько введенных чисел выходят за пределы допустимого диапазона.");
        }

        // Шаг 1: выполнение второй операции
        let intermediateResult;
        switch (operation2) {
            case 'add':
                intermediateResult = num2.plus(num3);
                break;
            case 'subtract':
                intermediateResult = num2.minus(num3);
                break;
            case 'multiply':
                intermediateResult = num2.times(num3);
                break;
            case 'divide':
                if (num3.isZero()) {
                    throw new Error("Деление на ноль невозможно.");
                }
                intermediateResult = num2.dividedBy(num3);
                break;
            default:
                throw new Error("Неизвестная операция.");
        }

        // Округление промежуточного результата
        intermediateResult = intermediateResult.toDecimalPlaces(10, Decimal.ROUND_HALF_UP);

        // Проверка диапазона промежуточного результата
        if (!isInRange(intermediateResult)) {
            throw new RangeError("Промежуточный результат выходит за пределы допустимого диапазона.");
        }

        let finalResult;

        // Шаг 2: анализ третьей операции
        if (operation3 === 'multiply' || operation3 === 'divide') {
            if (operation1 === 'add' || operation1 === 'subtract') {
                // Сначала выполняется третья операция, затем первая
                let tempResult;
                switch (operation3) {
                    case 'multiply':
                        tempResult = intermediateResult.times(num4);
                        break;
                    case 'divide':
                        if (num4.isZero()) {
                            throw new Error("Деление на ноль невозможно.");
                        }
                        tempResult = intermediateResult.dividedBy(num4);
                        break;
                }

                switch (operation1) {
                    case 'add':
                        finalResult = num1.plus(tempResult);
                        break;
                    case 'subtract':
                        finalResult = num1.minus(tempResult);
                        break;
                    default:
                        throw new Error("Неизвестная операция.");
                }
            } else {
                // Сначала выполняется первая операция, затем третья
                let tempResult;
                switch (operation1) {
                    case 'multiply':
                        tempResult = num1.times(intermediateResult);
                        break;
                    case 'divide':
                        if (intermediateResult.isZero()) {
                            throw new Error("Деление на ноль невозможно.");
                        }
                        tempResult = num1.dividedBy(intermediateResult);
                        break;
                    default:
                        throw new Error("Неизвестная операция.");
                }

                switch (operation3) {
                    case 'multiply':
                        finalResult = tempResult.times(num4);
                        break;
                    case 'divide':
                        if (num4.isZero()) {
                            throw new Error("Деление на ноль невозможно.");
                        }
                        finalResult = tempResult.dividedBy(num4);
                        break;
                    default:
                        throw new Error("Неизвестная операция.");
                }
            }
        } else {
            // Если третья операция + или -, сначала выполняется первая, затем третья
            let tempResult;
            switch (operation1) {
                case 'add':
                    tempResult = num1.plus(intermediateResult);
                    break;
                case 'subtract':
                    tempResult = num1.minus(intermediateResult);
                    break;
                case 'multiply':
                    tempResult = num1.times(intermediateResult);
                    break;
                case 'divide':
                    if (intermediateResult.isZero()) {
                        throw new Error("Деление на ноль невозможно.");
                    }
                    tempResult = num1.dividedBy(intermediateResult);
                    break;
                default:
                    throw new Error("Неизвестная операция.");
            }

            switch (operation3) {
                case 'add':
                    finalResult = tempResult.plus(num4);
                    break;
                case 'subtract':
                    finalResult = tempResult.minus(num4);
                    break;
                default:
                    throw new Error("Неизвестная операция.");
            }
        }

        // Округление финального результата
        finalResult = finalResult.toDecimalPlaces(10, Decimal.ROUND_HALF_UP);

        // Проверка диапазона финального результата
        if (!isInRange(finalResult)) {
            throw new RangeError("Результат вычислений выходит за пределы допустимого диапазона.");
        }

        // Отображение результата
        resultElement.innerText = `Результат: ${formatResult(finalResult)}`;

        // Округление результата до целых по выбранному методу
        let roundingMethod = document.getElementById('rounding').value || "math";
        let roundedResult;
        switch (roundingMethod) {
            case 'math':
                roundedResult = finalResult.toNearest(1, Decimal.ROUND_HALF_UP);
                break;
            case 'bankers':
                roundedResult = finalResult.toNearest(1, Decimal.ROUND_HALF_EVEN);
                break;
            case 'truncate':
                roundedResult = finalResult.toNearest(1, Decimal.ROUND_DOWN);
                break;
            default:
                throw new Error("Неизвестный метод округления.");
        }

        roundedResultElement.innerText = `Округленный до целых результат: ${roundedResult}`;
    } catch (error) {
        resultElement.innerText = `Ошибка: ${error.message}`;
        resultElement.style.color = "red";
        roundedResultElement.innerText = "";
    }
}