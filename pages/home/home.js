function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

findTransactions();

function findTransactions() {
    firebase.firestore()
    .collection('transactions')
    .get()
    .then(snapshot => {
        const transactions = snapshot.docs.map(doc => doc.data());
        addTransactionsToScreen(transactions);
        })
}

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        findTransactions(user);
    }
})

function newTransaction() {
    window.location.href = "../transaction/transaction.html";
}

function findTransactions(user){
    if(!user) return
    showLoading();
    firebase.firestore()
    .collection('transactions')
    .where('user.uid', '==', user.uid)
    .orderBy('date', 'desc')
    .get()
    .then(snapshot => {
        hideLoading();
        const transactions = snapshot.docs.map(doc => ({
            ...doc.data(),
            uid: doc.id
        }));
        addTransactionsToScreen(transactions);
    })
    .catch(error => {
        hideLoading();
        console.log(error);
        alert('Erro ao recuperar transacoes');
    })
}


function addTransactionsToScreen(transactions) {
    
    const orderedList = document.getElementById('transactions');

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        if(transaction.description) {
            const description = document.createElement('p');
            description.innerHTML = transaction.description;
            li.appendChild(description);
        }
        li.classList.add(transaction.type);
        li.classList.add(transaction.type2);
        li.classList.add(transaction.type3);
        li.id = transaction.uid;
        li.addEventListener('click', () => {
            window.location.href = "../transaction/transaction.html?uid=" + transaction.uid;
        })


        const date = document.createElement('p');
        date.innerHTML = "Idade:" + formatDate(transaction.date);
        li.appendChild(date);

        const money = document.createElement('p');
        money.innerHTML = "Melhor " + formatMoney(transaction.money);
        li.appendChild(money);

        const type = document.createElement('p');
        type.innerHTML = "Pais:" + transaction.transactionType;
        li.appendChild(type);

        const type2 = document.createElement('p');
        type2.innerHTML = "Estado:" + transaction.transactionType2;
        li.appendChild(type2);

        const type3 = document.createElement('p');
        type3.innerHTML = "Tipo Sanguineo:" + transaction.transactionType3;
        li.appendChild(type3);

        orderedList.appendChild(li);
    });
}


function askRemoveTransaction(transaction) {
    const shouldRemove = confirm('Deseja remover a transaçao?');
    if(shouldRemove){
        
        removeTransaction(transaction);
   }
}

function removeTransaction(transaction){ 
    showLoading();

    firebase.firestore()
    .collection("transactions")
    .doc(transaction.uid)
    .delete()
    .then(() => {
        hideLoading();
        document.getElementById(transaction.uid).remove();
    })
    .catch(error => {
        hideLoading();
        console.log(error);
        alert('Erro ao remover')
    })
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

function formatMoney(money) {
    return `${money.currency} ${money.value}`
}