// Budget Controller
const budgetController = (() => {
    const Expense = (id, description, value) => {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    const Income = (id, description, value) => {
        this.id = id;
        this.description = description;
        this.value = value;
    }
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
        // get input data
        let input = UICtrl.getInput();
        // add item to budget controller

        // add new item to the UI

        // calculate budget

        // display budget in UI
    }

    return {
        init: () => {
            console.log('App has started!')
            setupEventListeners();
        }
    }
})(UIController, budgetController)

controller.init();