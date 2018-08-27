// Budget Controller
const budgetController = (() => {
    
})()

// UI Controller
const UIController = (() => {
    
    
    return {
        getInput: () => {
            return {
                type: document.querySelector('.add__type').value, // income or expense
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value
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
