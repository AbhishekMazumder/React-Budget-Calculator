import React, { useState, useEffect } from 'react';
import './App.css';

import ExpenseList from './components/ExpenseList';
import Form from './components/Form';
import Alert from './components/Alert';
import { v4 as uuidv4 } from 'uuid';

// const initialExpenses = [
// 	{ id: uuidv4(), charge: 'rent', amount: 5000 },
// 	{ id: uuidv4(), charge: 'Car EMI', amount: 4000 },
// 	{ id: uuidv4(), charge: 'Credit Card Bill', amount: 8000 },
// ];

const initialExpenses = localStorage.getItem('expenses')
	? JSON.parse(localStorage.getItem('expenses'))
	: [];

function App() {
	// *************state values************
	const [expenses, setExpenses] = useState(initialExpenses);

	// single expense
	const [charge, setCharge] = useState('');

	// single expense amount
	const [amount, setAmount] = useState('');

	// alert
	const [alert, setAlert] = useState({ show: false });

	//edit
	const [edit, setEdit] = useState(false);

	//edit item
	const [id, setId] = useState(0);

	useEffect(() => {
		localStorage.setItem('expenses', JSON.stringify(expenses));
	}, [expenses]);

	const handleCharge = e => {
		setCharge(e.target.value);
	};

	const handleAmount = e => {
		setAmount(e.target.value);
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (charge !== '' && amount > 0) {
			if (edit) {
				let tempExpense = expenses.map(item =>
					item.id === id ? { ...item, charge, amount } : item
				);
				setExpenses(tempExpense);
				setEdit(false);
				handleAlert({ type: 'success', text: 'item edited' });
			} else {
				const newExpense = { id: uuidv4(), charge, amount };
				setExpenses([...expenses, newExpense]);
				// alert
				handleAlert({ type: 'success', text: 'item added successfully' });
			}
			setCharge('');
			setAmount('');
		} else {
			// alert
			handleAlert({
				type: 'danger',
				text: `charge can't be empty and the amount has to be bigger than zero`,
			});
		}
	};

	const handleAlert = ({ type, text }) => {
		setAlert({ show: true, type, text });
		setTimeout(() => {
			setAlert({ show: false });
		}, 3000);
	};

	// clear all items
	const clearItems = () => {
		setExpenses([]);
		handleAlert({ type: 'danger', text: 'all items deleted' });
	};

	//delete single item
	const handleDelete = id => {
		let tempExpenses = expenses.filter(item => item.id !== id);
		setExpenses(tempExpenses);
		handleAlert({ type: 'danger', text: 'item deleted' });
	};

	// edit single item
	const handleEdit = id => {
		let editExpense = expenses.find(item => item.id === id);
		console.log(editExpense);
		setCharge(editExpense.charge);
		setAmount(editExpense.amount);
		setEdit(true);
		setId(id);
	};

	return (
		<>
			{alert.show && <Alert type={alert.type} text={alert.text} />}
			<h1>Budget calculator</h1>
			<main className="App">
				<Form
					charge={charge}
					amount={amount}
					handleCharge={handleCharge}
					handleAmount={handleAmount}
					handleSubmit={handleSubmit}
					edit={edit}
				/>
				<ExpenseList
					expenses={expenses}
					handleDelete={handleDelete}
					handleEdit={handleEdit}
					clearItems={clearItems}
				/>
			</main>
			<h1>
				Total spending:{' '}
				<span className="total">
					$
					{expenses.reduce((tot, curr) => {
						return (tot += parseInt(curr.amount));
					}, 0)}
				</span>
			</h1>
		</>
	);
}

export default App;
