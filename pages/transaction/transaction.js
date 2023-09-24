if(!isNewTransaction()) {
    const uid = getTransactionUid();
    findTransactionByUid(uid);
}

function getTransactionUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid');
}

function isNewTransaction() {
    return getTransactionUid() ? false : true;
}

function findTransactionByUid(uid) {
    showLoading();

    firebase.firestore()
    .collection("transactions")
    .doc(uid)
    .get()
    .then(doc => {
        hideLoading();
        if(doc.exists) {
            fillTransactionScreen(doc.data());
            toggleSaveButtonDisable();
        } else {
            alert("Documento nao encontrado");
            window.location.href = "../home/home.html";
        }
    })
    .catch(() => {
        hideLoading();
        alert("Erro ao recuperar documento");
        window.location.href = "../home/home.html";
    });
}

function fillTransactionScreen(transaction) {
    if(transaction.description) {
        form.description().value = transaction.description;
    }
    if(transaction.type == "expense") {
        form.typeExpense().checked = true;
    } else {
        form.typeIncome().checked = true;
    }

    form.date().value = transaction.date;
    form.currency().value = transaction.money.currency;
    form.value().value = transaction.money.value;
    form.transactionType().value = transaction.transationType;
    form.transactionType2().value = transaction.transationType2;
    form.transactionType3().value = transaction.transationType3;
    
}

function saveTransaction() {
    const transaction = createTransaction();
    if(isNewTransaction()){
        save(transaction);
    } else {
        update(transaction);
    }
    
}

function save(transaction) {
    showLoading();

    firebase.firestore()
        .collection('transactions')
        .add(transaction)
        .then(() => {
            hideLoading();
            window.location.href = "../home/home.html";
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao salvar transaçao');
        })
}

function update(transaction) {
    showLoading();

    firebase.firestore() 
        .collection("transactions")
        .doc(getTransactionUid())
        .update(transaction)
        .then(() => {
            hideLoading();
            window.location.href = "../home/home.html";
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao atualizar transaçoes')
        })
    
}

function createTransaction() {
    return {
        description: form.description().value,
        type: form.typeExpense().checked ? "expense" : "income",
        date: form.date().value,
        money: {
            currency: form.currency().value,
            value: form.value().value
        },
        transactionType: form.transactionType().value,
        transactionType2: form.transactionType2().value,
        transactionType3: form.transactionType3().value,
        user: {
            uid: firebase.auth().currentUser.uid
        }
    };
}

function onChangeDate() {
    const date = form.date().value;
    form.dateRequiredError().style.display = !date ? "block" : "none";
    toggleSaveButtonDisable();
}

function onChangeValue() {
    const value = form.value().value;
    form.valueRequiredError().style.display = !value ? "block" : "none";
    toggleSaveButtonDisable();
}

function onChangeTransactionType() {
    const transactionType = form.transactionType().value;
    console.log(transactionType)
    form.transactionTypeRequiredError().style.display = !transactionType ? "block" : "none";

    toggleSaveButtonDisable();
}

function onChangeTransactionType2() {
    const transactionType2 = form.transactionType2().value;
    console.log(transactionType2)
    form.transactionTypeRequiredError2().style.display = !transactionType2 ? "block" : "none";

    toggleSaveButtonDisable();
}
function onChangeTransactionType3() {
    const transactionType3 = form.transactionType3().value;
    console.log(transactionType3)
    form.transactionTypeRequiredError3().style.display = !transactionType3 ? "block" : "none";

    toggleSaveButtonDisable();
}

function toggleSaveButtonDisable() {
    form.saveButton().disabled = !isFormValid();
}

function isFormValid() {
    const date = form.date().value;
    if(!date) {
        return false;
    }

    const value = form.value().value;
    if(!value || value <= 0) {
        return false;
    }

    const transactionType = form.transactionType().value;
    if(!transactionType) {
        return false;
    }

    const transactionType2 = form.transactionType2().value;
    if(!transactionType2) {
        return false;
    }

    const transactionType3 = form.transactionType3().value;
    if(!transactionType3) {
        return false;
    }

    return true;
}

const form = {
    currency: () => document.getElementById('currency'),
    date: () => document.getElementById('date'),
    description: () => document.getElementById('description'),
    dateRequiredError: () => document.getElementById('date-required-error'),
    saveButton: () => document.getElementById('save-button'),
    transactionType: () => document.getElementById('transaction-type'),
    transactionTypeRequiredError: () => document.getElementById('transaction-type-required-error'),
    transactionType2: () => document.getElementById('transaction-type2'),
    transactionTypeRequiredError2: () => document.getElementById('transaction-type2-required-error'),
    transactionType3: () => document.getElementById('transaction-type3'),
    transactionTypeRequiredError3: () => document.getElementById('transaction-type3-required-error'),
    typeExpense: () => document.getElementById('expense'),
    typeIncome: () => document.getElementById('income'),
    value: () => document.getElementById('value'),
    valueRequiredError: () => document.getElementById('value-required-error'),
    valueLessOrEqualToZeroError: () => document.getElementById('value-less-or-equal-to-zero-error')
}