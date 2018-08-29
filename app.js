// Budget Controller
const budgetController = (() => {
    const Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
        this.calcPercentage = (totalIncome) => {
            // calculate percentage if there is income
            (totalIncome > 0) && (this.percentage = Math.round((this.value / totalIncome) * 100));
        }
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
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1
    }

    const sumTotal = (type) => {
        let sum = 0;

        data.allEntries[type].forEach((currentEl) => {
            sum += currentEl.value;
        })

        data.totals[type] = sum
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

        // removeItem : (type, id) => {
        //     let IDs, index;
        //     IDs = data.allEntries[type].map((current) => {
        //         // return an array of the actual IDs
        //         return current.id 
        //     })

        //     // find the index of the element in the array
        //     console.log(IDs, id)
        //     index = IDs.indexOf(id)

        //     // remove the element from the data object if the index is not -1
        //     (index !== -1) && (data.allEntries[type].splice(index, 1))
        // },

        removeItem: function(type, id) {
 
            const delIndex = data.allEntries[type].findIndex(el => {
                return el.id === id;
            });
         
            data.allEntries[type].splice(delIndex, 1);
         
        },

        calculateBudget: () => {
            // calculate total income and expenses
            sumTotal('expense');
            sumTotal('income');

            // calculate budget --> income - expenses
            data.budget = data.totals.income - data.totals.expense

            // calculate percentage of expenses from income only if there is income
            if(data.totals.income > 0 ) {
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: () => {
            data.allEntries.expense.forEach((current) => {
                // calculate percentage for every expense entry
                current.calcPercentage(data.totals.income);
            })
        },

        getPercentages: () => {
            // get percentages and return them
            let allPercentages = data.allEntries.expense.map((current) => {
                return current.percentage;
            })
            // array of percentages
            return allPercentages;
        },

        getBudget: () => {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalIncome: data.totals.income,
                totalExpenses: data.totals.expense
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        itemsContainer: '.container',
        expensePercentageLabel: '.item__percentage'
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

        deleteListItem : (idOfElement) => {
            // remove an entry
            let element = document.getElementById(idOfElement)
            element.parentNode.removeChild(element);
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

        displayBudget: (dataObject) => {
            document.querySelector(domStrings.budgetLabel).textContent = dataObject.budget;
            document.querySelector(domStrings.incomeLabel).textContent = dataObject.totalIncome;
            document.querySelector(domStrings.expensesLabel).textContent = dataObject.totalExpenses;

            dataObject.percentage > 0 ? document.querySelector(domStrings.percentageLabel).textContent = `${dataObject.percentage}%` :  document.querySelector(domStrings.percentageLabel).textContent = 'N/A';
        },

        displayPercentages: (percentages) => {
            // get nodeList
            let fields = document.querySelectorAll(domStrings.expensePercentageLabel);

            // custom forEach funciton for nodeLists
            const nodeListForEach = (list, callback) => {
                for (let i = 0; i < list.length; i++) {
                    callback(list[i], i)
                }
            }

            nodeListForEach(fields, (current, index) => {
                // current = list[i] ; index = i
                percentages[index] > 0 ? current.textContent = `${percentages[index]}%` :  current.textContent = 'N/A';
                
            })
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

        document.querySelector(DOM.itemsContainer).addEventListener('click', deleteItem)
    }

    const updateBudget = () => {
        // calculate budget
        budgetCtrl.calculateBudget();

        // return the budget
        let budget = budgetCtrl.getBudget()

        // display budget in UI
        UICtrl.displayBudget(budget);
    }

    const updatePercentages = () => {
        // calculate percentage
        budgetCtrl.calculatePercentages();

        // read percentages from budget controller
        let percentages = budgetCtrl.getPercentages();

        // update UI with new percentage
        UICtrl.displayPercentages(percentages);
    }
    
    const ctrlAddItem = () => {
        let input, newItem;
        // get input data
        input = UICtrl.getInput();

        // test whether there is something in the description, the value is a number and it's bigger than 0
        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // add new item to the UI
            UICtrl.addListItem(newItem, input.type);

            // clear fields after adding entry
            UICtrl.clearInputs();       
            
            // calculate and update budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();
        }        
    }

    const deleteItem = (event) => {
        let entryID, splitID, type, id;
        // gets the Id of the entry element
        entryID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(entryID) {
            splitID = entryID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            // delete item from data structure
            budgetCtrl.removeItem(type, id);

            // delete item from UI
            UICtrl.deleteListItem(entryID);

            // update and show budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();
        }
    }

    return {
        init: () => {
            // reset everything to 0
            UICtrl.displayBudget({
                budget: 0,
                percentage: -1,
                totalIncome: 0,
                totalExpenses: 0
            });
            setupEventListeners();
        }
    }
})(UIController, budgetController)

controller.init();