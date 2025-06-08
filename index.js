const amountInput = document.getElementById('amount');
const termInput = document.getElementById('term');
const interestInput = document.getElementById('interest-rate');

const typeSelector = document.querySelector('.types');
const types = document.querySelectorAll('.checkbox');

const caclculateButton = document.querySelector('button');
const container = document.querySelector('main');

const resultsContainer = document.querySelector('.results');
const monthlyLabel = document.querySelector('.monthly .amount');
const totalLabel = document.querySelector('.total .amount');

const clearButton = document.querySelector('.clear');

// Selected mortgage type
let selectedType;

/**
 * format's a string into xxx,xxx (ex: 30000 -> 30,000)
 * @param { string } value 
 * @returns the formted value
 */
function formatInput(value) {
    if (value.length <= 3) {
        return value;
    }

    let formated = '';
    if (value.includes('.')) {
        formated = value.slice(value.indexOf('.'));
        value = value.slice(0, value.indexOf('.'));
    }
    
    for (let i = value.length; i > 0; i -= 3) {
        const curSlice = value.slice(Math.max(i - 3, 0), i);
        formated = i > 3
            ? ',' + curSlice + formated
            : curSlice + formated;
    }

    return formated;
}

/**
 * Format's the input of an HTML input element.
 * @param { InputEvent } event 
 */
function onInput(event) {
    const value = event.target.value.replace(',', '');

    if (isNaN(Number(value))) {
        return;
    }

    event.target.value = formatInput(value);
}

/**
 * Handle's selecting the mortgage type.
 * @param {number} id
 */
function selectType(id) {
    const checkbox = types[id];
    const type = checkbox.closest('.type');

    type.classList.toggle('checked');

    if (id == selectedType) {
        selectedType = undefined;
        return;
    }

    if (selectedType != undefined) {
        const checked = id == 0 ? types[1] : types[0];
        checked.closest('.type').classList.remove('checked');
    }

    selectedType = id;
}

/**
 * Trigger's an error if the input value is invalid
 * otherwise it return's its value
 * @param {HTMLInputElement} input the input element
 * @returns the input value
 */
function getInputValue(input) {
    const value = Number(input.value.replace(',', ''));

    const inputContainer = input.parentElement;
    const errorMessage = inputContainer.nextSibling.nodeType == Node.TEXT_NODE
        ? inputContainer.nextSibling.nextSibling
        : inputContainer.nextSibling;

    inputContainer.classList.remove('valid', 'invalid');

    if (isNaN(value) || value <= 0) {
        input.value = '';
        
        inputContainer.classList.add('invalid');
        errorMessage.style.display = 'block';

        return null;

    } 

    inputContainer.classList.add('valid');
    errorMessage.style.display = 'none';

    return value;
}


/**
 * Calculate's/display's the monthly and the total mortgage repayements.
 */
function calculateRepayements() {
    const amount = getInputValue(amountInput);

    const term = getInputValue(termInput);

    let interestRate = getInputValue(interestInput);

    // Triggers an error if there is not selected mortgage type
    const errorMessage = typeSelector.querySelector('.error-message');
    if (selectedType == undefined) {
        errorMessage.style.display = 'block';

    } else {
        errorMessage.style.display = 'none';
    }

    if (!amount || !term || !interestRate || selectedType == undefined) {
        container.classList.add('error');
        return;
    }

    // Calculate the monthly and total repayements
    let monthly, total = 0;

    interestRate = interestRate / 100;
    if (selectedType == 0) {
        const r = interestRate / 12;
        const n = term * 12;

        monthly = amount * (r * (1 + r) ** n) / ((1 + r) ** n - 1);
        total = monthly * n;

    } else {
        const interest = amount * interestRate;

        monthly = interest / 12;
        total = interest * term;
    }

    // Display the results
    resultsContainer.classList.add('shown');

    monthlyLabel.innerHTML = `£${formatInput(String(monthly.toFixed(2)))}`;
    totalLabel.innerHTML = `£${formatInput(String(total.toFixed(2)))}`;

    container.classList.remove('error');
}

/**
 * Clear's all the input, selectors and labels.
 */
function clear() {
    // Clear the input elements
    for (let inputElement of [amountInput, termInput, interestInput]) {
        const inputContainer = inputElement.parentElement;
        const errorMessage = inputContainer.nextSibling.nodeType == Node.TEXT_NODE
        ? inputContainer.nextSibling.nextSibling
        : inputContainer.nextSibling;

        inputElement.value = '';
        inputContainer.classList.remove('valid', 'invalid');
        errorMessage.display = 'none';
    }

    // Clear the types selector
    selectedType = undefined;
    for (let checkbox of types) {
        checkbox.parentElement.classList.remove('checked');
    }

    container.classList.remove('error');
    resultsContainer.classList.remove('shown');
}

/**
 * Executes once the DOM content is loaded.
 */
function onMount() {
    amountInput.addEventListener('input', onInput);

    types.forEach((checkbox, id) => {
        checkbox.addEventListener('click', () => selectType(id));
    });

    caclculateButton.addEventListener('click', calculateRepayements);

    clearButton.addEventListener('click', clear);
}

document.addEventListener('DOMContentLoaded', onMount);