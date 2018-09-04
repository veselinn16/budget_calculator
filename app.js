// Budget Controller
const budgetController = (() => {
    // Expense Class
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
            this.calcPercentage = (totalIncome) => {
                // calculate percentage if there is income
                (totalIncome > 0) && (this.percentage = Math.round((this.value / totalIncome) * 100));
            }
        }
    }

    // Income constructor function
    const Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // checks whether there is such an object in the storage and if there is, it uses it; if not, it creates a new object and assigns the data variable to it
    const data = localStorage.getItem('data') ?  JSON.parse(localStorage.getItem('data')) : localStorage.setItem('data', JSON.stringify({
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
    }));

    // sums the totals of expenses and incomes and puts them in the data object
    const sumTotal = (type) => {
        let sum = 0;

        data.allEntries[type].forEach((currentEl) => {
            sum += currentEl.value;
        })

        data.totals[type] = sum;

        controller.changeStorage(data);
    }

    return {
        // creates a new expense/income instance and returns it
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

            controller.changeStorage(data);

            // return new item
            return newItem;
        },

        // remove instance from data object
        removeItem: function(type, id) {
 
            const delIndex = data.allEntries[type].findIndex(el => {
                return el.id === id;
            });
         
            data.allEntries[type].splice(delIndex, 1);
            
            controller.changeStorage(data);
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

            controller.changeStorage(data);
        },

        calculatePercentages: () => {
            data.allEntries.expense.forEach((current) => {
                // calculate percentage for every expense entry              
                (data.totals.income > 0) && (current.percentage = Math.round((current.value / data.totals.income) * 100));
            })
            controller.changeStorage(data);
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
            if (data) { 
                return {
                    budget: data.budget,
                    percentage: data.percentage,
                    totalIncome: data.totals.income,
                    totalExpenses: data.totals.expense
                }
            } else {
                return {
                    budget: 0,
                    percentage: -1,
                    totalIncome: 0,
                    totalExpenses: 0
                }
            }
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
        expensePercentageLabel: '.item__percentage',
        currentDateLabel: '.budget__title--month'
    }

    const formatNumber = (num, type) => {
        let numSplit, int, decimal;
        // place 2 decimal points after integers
        num = Math.abs(num);
        num = num.toFixed(2);

        // separate thousands with commas
        numSplit = num.split('.');
        int = numSplit[0];
        decimal = numSplit[1];
        if(int.length > 3)  {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // if int = 2310, int = 2,310
        }

        // add +/- before number and return it            
        return `${(type === 'expense' ? '-' : '+')} ${int}.${decimal}`
    }

    // custom forEach funciton for nodeLists
    const nodeListForEach = (list, callback) => {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
    }
    
    return {
        getInput: () => {
            // values of inputs
            return {
                type: document.querySelector(domStrings.inputType).value, // income or expense
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)
            }
        },

        // creates html string, inserts it in the DOM and puts it in the localStorage as a key
        addListItem : (object, type) => {
            let html, element;
            if(type === 'income') {
                element = domStrings.incomeContainer

                // create HTML string with appropriate values
                html = `<div class="item green_item" id="income-${object.id}"><div class="item__description">${object.description}</div><div class="right"><div class="item__value">${formatNumber(object.value, type)}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`

                controller.addStorageHtml(`income-${object.id}`, html, type);
            } else {
                element = domStrings.expensesContainer

                html = `<div class="item red_item" id="expense-${object.id}"><div class="item__description">${object.description}</div><div class="right"><div class="item__value">${formatNumber(object.value, type)}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`

                controller.addStorageHtml(`expense-${object.id}`, html, type);
            }

            // insert HTML in the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);    
        },

        // remove an entry from DOM and localStorage
        deleteListItem : (idOfElement) => {
            let element = document.getElementById(idOfElement)
            element.parentNode.removeChild(element);

            localStorage.removeItem(idOfElement);
        },

        clearInputs: () => {
            let inputFields, inputsArray;
            inputFields = document.querySelectorAll(`${domStrings.inputDescription}, ${domStrings.inputValue}`)
            
            // convert NodeList to array
            inputsArray = Array.prototype.slice.call(inputFields);

            // loops over all inputs and clears them
            inputsArray.forEach((current) => {
                current.value = '';
            });

            // set focus on the first input
            inputsArray[0].focus();
        },

        // display budget in the DOM
        displayBudget: (dataObject) => {
            let type;

            dataObject.budget > 0 ? type = 'income' : type = 'expense';

            document.querySelector(domStrings.budgetLabel).textContent = formatNumber(dataObject.budget, type);
            document.querySelector(domStrings.incomeLabel).textContent = formatNumber(dataObject.totalIncome, 'income');
            document.querySelector(domStrings.expensesLabel).textContent = formatNumber(dataObject.totalExpenses, 'expense');

            dataObject.percentage > 0 ? document.querySelector(domStrings.percentageLabel).textContent = `${dataObject.percentage}%` :  document.querySelector(domStrings.percentageLabel).textContent = 'N/A';
        },

        // calculate percentage of total expenses to total income
        displayPercentages: (percentages) => {
            // get nodeList
            let fields = document.querySelectorAll(domStrings.expensePercentageLabel);

            nodeListForEach(fields, (current, index) => {
                // current = list[i] ; index = i
                percentages[index] > 0 ? current.textContent = `${percentages[index]}%` :  current.textContent = 'N/A';
                
            })
        },

        displayDate: () => {
            let now, year, month, months;
            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            year = now.getFullYear();
            month = now.getMonth()
            document.querySelector(domStrings.currentDateLabel).textContent = `${months[month]}, ${year}`;
        },

        // changes border color of inputs according to type of entry - expense/income
        changeType: () => {
            const inputs = document.querySelectorAll(
                `${domStrings.inputType},${domStrings.inputDescription},${domStrings.inputValue}`
            )

            nodeListForEach(inputs, (current) => {
                current.classList.toggle('red-focus');
            });

            document.querySelector(domStrings.btn).classList.toggle('red');
        },

        // expose the domStrings object
        getDOMStrings: () => {
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

        document.querySelector(DOM.itemsContainer).addEventListener('click', deleteItem);

        //changes border color
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
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
            UICtrl.deleteListItem(entryID, type, id);

            // update and show budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();
        }
    }

    // get entries' html from localStorage and place them in the DOM
    const displayEntries = () => {
        for (let i=0; i < localStorage.length; i++) {
            if (localStorage.getItem(`income-${i}`)) {
                document.querySelector(UICtrl.getDOMStrings().incomeContainer).insertAdjacentHTML('beforeend', localStorage.getItem(`income-${i}`));
            }
            if (localStorage.getItem(`expense-${i}`)) {
                document.querySelector(UICtrl.getDOMStrings().expensesContainer).insertAdjacentHTML('beforeend', localStorage.getItem(`expense-${i}`));
            }
        }
    }

    return {
        init: () => {
            UICtrl.displayBudget(budgetCtrl.getBudget());
            setupEventListeners();
            UICtrl.displayDate();
            displayEntries();
            updatePercentages();
        },

        // updates the localStorage object
        changeStorage: (data) => {
            localStorage.setItem('data', JSON.stringify(data));
        },

        // places html entry in localStorage
        addStorageHtml: (key, html, type) => {
            type === 'expense' ? localStorage.setItem(key, html) : localStorage.setItem(key, html)
        }
    }
})(UIController, budgetController)

controller.init();