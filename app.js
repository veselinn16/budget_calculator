// Budget Controller
const budgetController = (() => {
    
})()

// UI Controller
const UIController = (() => {
    const domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        btn: '.add__btn'
    }
    
    return {
        getInput: () => {
            return {
                type: document.querySelector(domStrings.inputType).value, // income or expense
                description: document.querySelector(domStrings.inputDescription).value,
                value: document.querySelector(domStrings.inputValue).value
            }
        },

        getDOMStrings: () => {
            // expose the domString variable
            return domStrings;
        }
    }
})();

// App controller
const controller = ((UICtrl, budgetCtrl) => {
    const setupEventListeners = () => {
        const DOM = UICtrl.getDOMStrings();

        // click event listener
        document.querySelector(DOM.btn).addEventListener('click', ctrlAddItem);
        
        // event listener for ENTER
        document.addEventListener('keypress', (event) => {
            (event.keyCode === 13) && (ctrlAddItem());
        });
    }
    
    const ctrlAddItem = () => {
        // 1. get input data
        let input = UICtrl.getInput();
        // 2. add item to budget controller

        // 3. add new item to the UI

        // 4. calculate budget

        // 5. display budget in UI
    }

    return {
        init: () => {
            console.log('App has started!')
            setupEventListeners();
        }
    }
})(UIController, budgetController)

controller.init();