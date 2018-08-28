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
        btn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    
    return {
        getInput: () => {
            return {
                type: document.querySelector(domStrings.inputType).value, // income or expense
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)
            }
        },

        addListItem : (object, type) => {
            let html, element;
            if(type === 'income') {
                element = domStrings.incomeContainer

                // create HTML string with appropriate values
                html = `<div class="item clearfix" id="income-${object.id}"><div class="item__description">${object.description}</div><div class="right clearfix"><div class="item__value">${object.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>              </div></div></div>`
            } else {
                element = domStrings.expensesContainer

                html = `<div class="item clearfix" id="expense-${object.id}"><div class="item__description">${object.description}</div><div class="right clearfix">     <div class="item__value">${object.value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
            }

            // insert HTML in the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        clearInputs: () => {
            let inputFields, inputsArray;
            inputFields = document.querySelectorAll(`${domStrings.inputDescription}, ${domStrings.inputValue}`)
            
            // convert NodeList to array
            inputsArray = Array.prototype.slice.call(inputFields);

            // loops over all inputs and clears them
            inputsArray.forEach((current, index, array) => {
                current.value = '';
            });

            // set focus on the first input
            inputsArray[0].focus();
        },

        getDOMStrings: () => {
            // expose the domStrings object
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

    const updateBudget = () => {
        // calculate budget

        // return the budget

        // display budget in UI

    }
    
    const ctrlAddItem = () => {
        let input, newItem;
        // get input data
        input = UICtrl.getInput();

        // add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // add new item to the UI
        UICtrl.addListItem(newItem, input.type);

        // clear fields after adding entry
        UICtrl.clearInputs();       
        
        // calculate and update budget
        updateBudget();
    }

    return {
        init: () => {
            console.log('App has started!')
            setupEventListeners();
        }
    }
})(UIController, budgetController)

controller.init();