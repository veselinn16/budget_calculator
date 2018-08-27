const budgetController = (() => {
    let x = 12;

    let add = (a) => {
        return a + x;
    }

    return {
        publicTest: (b) => {
            return add(b);
        }
    }
})()

const UIController = (() => {

})();

const controller = ((UICtrl, budgetCtrl) => {
    let z = budgetCtrl.publicTest(1);
    return {
        public: () => {
            console.log(z);
        }
    }
})(UIController, budgetController)
controller.public();