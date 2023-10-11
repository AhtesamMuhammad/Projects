document.addEventListener("DOMContentLoaded", function () {

    let screen = document.getElementById("calculator-screen");
    screen.innerHTML = '0';
    let mainElement = document.querySelector('main');
    let result = document.getElementById("calculator-result");

    let operator = null;
    let firstValue = '';
    let secondValue = '';

    let previousResult = ''; // This variable we will use in case the user wants to do another operation with the last result
    let isFirstValue = true; // We start with the value 'true' because it will be easy for understand

    /*
    * The variable @isNewOperation helps to not confuse when the user will do a new operation
    * or use the result of the last operation for do another operation
    * */
    let isNewOperation = false;

    mainElement.addEventListener('click', function (event) {
        if (event.target.classList.contains('calculator-button')) {
            restartButtons(event) // They are two bottons we use for clean the last operation or do a new one
        }

        if (event.target.classList.contains('calculator-number')) {
            if (isNewOperation) {
                cleanValues();
                isNewOperation = false; // We change to false because when the user realize the last operation it turns 'true'
            }
            selectNumbers(event);
        }
        if (event.target.classList.contains('calculator-operation')) {
            if (firstValue)
                selectOperator(event)
        }
    });

    function restartButtons(event) {
        if (event.target.textContent === 'CA') {
            cleanValues()
            screen.innerHTML = '0';
        } else if (event.target.textContent === 'C') {
            secondValue = '';
            screen.innerHTML = '0';
        }
    }
    function selectNumbers(event) {
        // @isFirstValue will change if the user presses an operator to choose the first or second value
        isFirstValue ? (firstValue += event.target.textContent) : (secondValue += event.target.textContent);

        // After depend on the value is going to change in a number to show in the screen
        screen.innerHTML = Number(isFirstValue ? firstValue : secondValue)
    }
    function selectOperator(event) {
        isFirstValue = false;
        isNewOperation = false;

        screen.innerHTML = firstValue;
        operator = event.target.textContent; // In the 'event' it save the operator that the user select

        if (previousResult) {
            firstValue = previousResult;
            screen.innerHTML = firstValue;
            secondValue = '';
            previousResult = null;
        }
    }

    //This function clean all the values to do an operation
    function cleanValues() {
        firstValue = '';
        secondValue = '';
        operator = null;
        isFirstValue = true;
        previousResult = '';
    }

    result.addEventListener('click', function () {
        if (operator && firstValue && secondValue) {
            switch (operator) {
                case '/':
                    screen.innerHTML = Number(firstValue) / Number(secondValue);
                    break;
                case '*':
                    screen.innerHTML = Number(firstValue) * Number(secondValue);
                    break;
                case '-':
                    screen.innerHTML = Number(firstValue) - Number(secondValue);
                    break;
                case '+':
                    screen.innerHTML = Number(firstValue) + Number(secondValue);
                    break;
            }

            previousResult = screen.textContent;
            isNewOperation = true;
            showDetailsOperation()
        }
    });

    function showDetailsOperation() {
        document.getElementById('detailsOfOperation').innerHTML = `For this operation we take first value: ${firstValue} with the operator ' ${operator} ' 
and the second value: ${secondValue} to do this operation and have this result:`
        document.getElementById('outputOfOperation').innerHTML = `Result: ${screen.textContent}`
    }

});