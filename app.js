const budgetController = (() => {
    let x = 12;

    let add = (a) => {
        return a + x;
    }

    return {
        publicTest: (b) => {
            console.log(add(b));
        }
    }
})()

