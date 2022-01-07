let transactionListId = 0;
let transactionId = 0;
const addDescription = document.querySelector('.add__description');
const addValue = document.querySelector('.add__value');
const addButton = document.querySelector('.add__btn');
const incomeList = document.querySelector('.income__list');
const expenseList = document.querySelector('.expenses__list');
const containerDiv = document.querySelector('.container'); 
const budgetValue = document.querySelector('.budget__value');
const incomeTotal = document.querySelector('.budget__income--value');
const expenseTotal = document.querySelector('.budget__expenses--value');
const expensePercentage = document.querySelector('.budget__expenses--percentage');
const budgetMonth = document.querySelector('.budget__title--month');

budgetMonth.innerHTML = '';
budgetMonth.innerHTML = `${new Date().toLocaleDateString('en-CA', {month: 'long', year: 'numeric'})}`

class Transaction {
  constructor(description, amount) {
    this.description = description;
    this.amount = amount;
    this.id = transactionId++
    this.date = new Date().toLocaleDateString('en-CA', {month: 'short', day: 'numeric', year: 'numeric' })
  }
}

class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
    this.id = transactionListId++
  }

  addTransaction(description, amount) {
    if(amount >= 0) {
      this.incomeList.push(new Transaction(description, amount));
    }
    if (amount < 0) {
      this.expenseList.push(new Transaction(description, amount));
    }
    this.render()
  }

  removeTransaction(id) {
    this.incomeList = this.incomeList.filter(transaction => transaction.id !== id);
    this.expenseList = this.expenseList.filter(transaction => transaction.id !== id);
    this.render()
  }

  totalIncome() {
    let incomeArr = this.incomeList.map(item => item.amount)
    if(incomeArr.length !== 0) {
      const incomeTotal = incomeArr.reduce((pv, cv) => {
        return pv + cv;
      });
      return incomeTotal
    } else {
      return 0
    }
  }

  totalExpense() {
    let expenseArr = this.expenseList.map(item => item.amount)
    if (expenseArr.length !== 0) {
      const expenseTotal = expenseArr.reduce((pv, cv) => {
        return pv + cv;
      });
      return expenseTotal
    } else {
      return 0
    }
  }

  render() {
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';
    if(this.incomeList.length !== 0) {
      this.incomeList.forEach(income => {
        incomeList.insertAdjacentHTML('beforeend', 
      `<div class="item" data-transaction-id=${income.id}>
        <div class="item__description">${income.description}</div>            
        <div class="right">
          <div class="item__value">+ $${income.amount.toFixed(2)}</div>
          <div class="item__delete">
            <button class="item__delete--btn">
              <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
        <div class="item__date">${income.date}</div>
      </div>`
        )
      });
    }
    if (this.expenseList.length !== 0) {
      this.expenseList.forEach(expense => {
        expenseList.insertAdjacentHTML('beforeend',
      `<div class="item" data-transaction-id=${expense.id}>
        <div class="item__description">${expense.description}</div>
        <div class="right">
          <div class="item__value">- $${Math.abs(expense.amount).toFixed(2)}</div>
          <div class="item__percentage">${((expense.amount / this.totalIncome()) * 100).toFixed(0)}%</div>
          <div class="item__delete">
            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
          </div>
        </div>
        <div class="item__date">${expense.date}</div>
      </div>`
        )
      });
    }

    budgetValue.innerHTML = '';
    budgetValue.innerHTML = `${this.totalIncome() - Math.abs(this.totalExpense()) >= 0 ? '+' : '-'} $${Math.abs(this.totalIncome() - Math.abs(this.totalExpense())).toFixed(2)}`
    incomeTotal.innerHTML = '';
    incomeTotal.innerHTML = `+ $${this.totalIncome().toFixed(2)}`
    expenseTotal.innerHTML = '';
    expenseTotal.innerHTML = `- $${Math.abs(this.totalExpense()).toFixed(2)}`;
    expensePercentage.innerHTML = '';
    expensePercentage.innerHTML = `${isNaN(this.totalExpense()/ this.totalIncome()) === true ? 0 : ((Math.abs(this.totalExpense()) / this.totalIncome()) * 100).toFixed(0)}%`
  }
}

const myList = new TransactionList()

function handleTransaction(e) {
  if (addDescription.value !== '' && addValue.value !== '') {
    myList.addTransaction(addDescription.value, +addValue.value)
    addValue.value = '';
    addDescription.value = '';
  }
}

function handleClick(e) {
  if (e.target.classList.contains('ion-ios-close-outline')) {
    const itemId = +e.target.closest('.item').dataset.transactionId;
    myList.removeTransaction(itemId);
  }
}

addButton.addEventListener('click', handleTransaction)
containerDiv.addEventListener('click', handleClick)