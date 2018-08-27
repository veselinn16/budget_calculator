// Budget Controller
const budgetController = (() => {
    
})()

// UI Controller
const UIController = (() => {
    const domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value'
    }
    
    return {
        getInput: () => {
            return {
                type: document.querySelector(domStrings.inputType).value, // income or expense
                description: document.querySelector(domStrings.inputDescription).value,
                value: document.querySelector(domStrings.inputValue).value
            }
        }
    }
})();

// App controller
const controller = ((UICtrl, budgetCtrl) => {
    const ctrlAddItem = () => {
        // 1. get input data
        let input = UICtrl.getInput();
        console.log(input);
        // 2. add item to budget controller

        // 3. add new item to the UI

        // 4. calculate budget

        // 5. display budget in UI
    }

    // click event listener
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    
    // event listener for ENTER
    document.addEventListener('keypress', (event) => {
        (event.keyCode === 13) && (ctrlAddItem());
    });
})(UIController, budgetController)
