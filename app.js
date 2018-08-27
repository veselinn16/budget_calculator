// Budget Controller
const budgetController = (() => {
    const Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    const Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let data = {
        allEntries: {
            expense: [],
            income: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: (type, description, value) => {
            let newItem, id;
            // generate new id by getting the last element in the data object's allEntries array according to the type and adding 1
            if(data.allEntries[type].length > 0) {
                id = data.allEntries[type][data.allEntries[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            if(type === 'expense') {
                newItem = new Expense(id, description, value)
            } else {
                newItem = new Income(id, description, value)
            }
            // access object using string notation
            data.allEntries[type].push(newItem);
            // console.log(data[type]);

            // return new item
            return newItem;
        },

        testing: () => {
            console.log(data);
        }
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
        let input, newItem;
        // get input data
        input = UICtrl.getInput();

        // add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        budgetCtrl.testing();
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