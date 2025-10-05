// script.js

// ===========================================
//           DOM Element Selection
// ===========================================
// (Your element selection code is here, including resetButton)
const billInput = document.getElementById('bill-input');
const tipButtons = document.querySelectorAll('.tip-percent-btn');
const customTipInput = document.getElementById('custom-tip-input');
const peopleInput = document.getElementById('people-input');
const tipAmountDisplay = document.getElementById('tip-amount-display');
const totalAmountDisplay = document.getElementById('total-amount-display');
const resetButton = document.getElementById('reset-button');

// ===========================================
//           Event Listeners
// ===========================================
// Listener for bill input
billInput.addEventListener('input', calculateTip);

// Listeners for tip percentage buttons
tipButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        tipButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        customTipInput.value = '';
        if (customTipInput) {
            const customTipPercent = parseFloat(customTipInput.value);
            const isCustomTipNowEffectivelyValid = customTipInput.value === '' || (!isNaN(customTipPercent) && customTipPercent >= 0);
            customTipInput.classList.toggle('error', !isCustomTipNowEffectivelyValid);
        }
        calculateTip();
    });
});

// Listener for custom tip input
customTipInput.addEventListener('input', () => {
    tipButtons.forEach(btn => btn.classList.remove('active'));
    calculateTip();
});

// Listener for number of people input
peopleInput.addEventListener('input', calculateTip);

// Listener for the Reset button
if (resetButton) {
    resetButton.addEventListener('click', () => {
        resetCalculator();
    });
}

// ===========================================
//             Core Functions
// ===========================================

function calculateTip() {
    const billValueStr = billInput.value;
    const peopleValueStr = peopleInput.value;
    const customTipValueStr = customTipInput.value;
    
    // --- 2. Convert to Numbers ---
    const billAmount = parseFloat(billValueStr);
    const numberOfPeople = parseFloat(peopleValueStr);
    const customTipPercent = parseFloat(customTipValueStr);

    // ===========================================================
    // --- 3. INPUT VALIDATION SECTION ---
    // ===========================================================
    const isBillValid = !isNaN(billAmount) && billAmount >= 0;
    const isPeopleValid = !isNaN(numberOfPeople) && numberOfPeople > 0 && Number.isInteger(numberOfPeople);
    const isCustomTipInputValid = customTipValueStr === '' || (!isNaN(customTipPercent) && customTipPercent >= 0);

    // --- 4. Determine Tip Percentage to Use ---
    let actualTipPercent = 0;
    if (customTipValueStr !== '' && !isNaN(customTipPercent) && customTipPercent >= 0) {
         actualTipPercent = customTipPercent;
    } else if (customTipValueStr === '') { 
        const activeButton = document.querySelector('.tip-percent-btn.active');
        if (activeButton) {
            const selectedButtonTipPercent = parseFloat(activeButton.dataset.tip);
            if (!isNaN(selectedButtonTipPercent) && selectedButtonTipPercent >= 0) {
                actualTipPercent = selectedButtonTipPercent;
            }
        }
    }
    const isTipValid = !isNaN(actualTipPercent) && actualTipPercent >= 0;

    // --- 5. Calculate Total Tip ---
    let totalTipAmount = 0; 
    if (isBillValid && isTipValid) {
        totalTipAmount = billAmount * (actualTipPercent / 100);
    }

    // --- 6. Calculate Total Bill ---
    let totalBillAmount = 0; 
    if (isBillValid) { 
        totalBillAmount = billAmount + totalTipAmount;
    }
    
    // --- 7. Calculate Per-Person Amounts ---
    let tipAmountPerPerson = 0;    
    let totalAmountPerPerson = 0;  
    if (isBillValid && isTipValid && isPeopleValid) {
        if (!isNaN(totalBillAmount)) { 
            tipAmountPerPerson = totalTipAmount / numberOfPeople;
            totalAmountPerPerson = totalBillAmount / numberOfPeople;
        } else {
             tipAmountPerPerson = 0;
             totalAmountPerPerson = 0;
        }
    }

    // --- 8. Format Results for Display ---
    const formattedTipAmount = tipAmountPerPerson.toFixed(2);
    const formattedTotalAmount = totalAmountPerPerson.toFixed(2);
    const displayTipAmount = `$${formattedTipAmount}`;
    const displayTotalAmount = `$${formattedTotalAmount}`;

    // --- 9. Update DOM Text Content ---
    if (tipAmountDisplay) {
        tipAmountDisplay.textContent = displayTipAmount;
    }
    if (totalAmountDisplay) {
        totalAmountDisplay.textContent = displayTotalAmount;
    }

    // --- 10. Apply Visual Feedback (Error Styling) ---
    if (billInput) {
        billInput.classList.toggle('error', !isBillValid);
    }
    if (peopleInput) {
        peopleInput.classList.toggle('error', !isPeopleValid);
    }
    if (customTipInput) {
        const activeButton = document.querySelector('.tip-percent-btn.active');
        let showErrorForCustomTip = !isCustomTipInputValid;
        if (customTipInput.value === '' && activeButton) {
            showErrorForCustomTip = false;
        }
        customTipInput.classList.toggle('error', showErrorForCustomTip);
    }
}

// --- Definition for the Reset Calculator Function ---
function resetCalculator() {
    if (billInput) {
        billInput.value = '';
    }
    if (customTipInput) {
        customTipInput.value = '';
    }
    if (tipButtons && tipButtons.length > 0) {
        tipButtons.forEach(button => {
            button.classList.remove('active');
        });
    }
    if (peopleInput) {
        peopleInput.value = '';
    }
    if (tipAmountDisplay) {
        tipAmountDisplay.textContent = '$0.00';
    }
    if (totalAmountDisplay) {
        totalAmountDisplay.textContent = '$0.00';
    }
    if (billInput) {
        billInput.classList.remove('error');
    }
    if (customTipInput) {
        customTipInput.classList.remove('error');
    }
    if (peopleInput) {
        peopleInput.classList.remove('error');
    }
}

// ===========================================
//           Initial Execution
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    calculateTip();
});