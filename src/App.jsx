import React, { useState, useEffect } from 'react';
import './App.css';
import toast, { Toaster } from 'react-hot-toast';
export default App;

function App() {
	const [tasks, setTasks] = useState([]);
	const [favorites, setFavorites] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [theme, setTheme] = useState('light');
	const [isFirst, setFirst] = useState(true);

	useEffect(() => {
		const localTasks = localStorage.getItem('tasks');
		const localFavs = localStorage.getItem('fav-tasks');

		if (localTasks) {
			const parsedTasks = JSON.parse(localTasks);
			setTasks(parsedTasks);
		} else {
			const stringedTasks = JSON.stringify(tasks);
			localStorage.setItem('tasks', stringedTasks);
		}

		if (localFavs) {
			const parsedFavs = JSON.parse(localFavs);
			setFavorites(parsedFavs);
		} else {
			const stringedFavs = JSON.stringify(favorites);
			localStorage.setItem('fav-tasks', stringedFavs);
		}
		setFirst(false)
	}, []);

	useEffect(() => {
		if (isFirst===false) {
			const stringedTasks = JSON.stringify([...tasks]);
			localStorage.setItem('tasks', stringedTasks);
		}
		}, [tasks]);

	useEffect(() => {
		if (isFirst===false) {	
			const stringedFavs = JSON.stringify([...favorites]);
			localStorage.setItem('fav-tasks', stringedFavs);
		}
	}, [favorites]);



	const handleAddToFavorite = (event, taskIndex, listType) => {
		if (listType === 'task-list' && event.target.checked) {
			const filteredArr = tasks.filter((item, index) => {
				if (index === taskIndex) {
					setFavorites([...favorites, item]);
				} else {
					return item;
				}
				const filteredArray = tasks.filter((item, index) => {
					return index !== taskIndex;
				});
				setTasks(filteredArray);
			});
			setTasks(filteredArr);
			event.target.checked = false;
		}

		if (listType === 'fav-list' && event.target.checked) {
			const filteredArr = favorites.filter((item, index) => {
				if (index === taskIndex) {
					setTasks([...tasks, item]);
				} else {
					return item;
				}
				const filteredFav = favorites.filter((item, index) => {
					return index !== taskIndex;
				});
				setFavorites(filteredFav)
			});
			setFavorites(filteredArr);
			event.target.checked = false;
		}
	};

	const handleChangeInput = (event) => {
		setInputValue(event.target.value);

	};

	const handleAddTask = () => {
		if (inputValue !== '') {
			const allTasks = [...tasks, ...favorites];

			const isNotDuplicate = allTasks.every((task) => task !== inputValue);

			if (isNotDuplicate) {
				setTasks([...tasks, inputValue]);
				
			}
			else toast('уже есть', { icon: '🤦‍♀️' })
		} else {
			toast('введите текст ', { icon: '🙃' })
		}
	};
	const toggleTheme = () => {
		if (theme === 'light') {
			document.documentElement.style.setProperty(`--background`, '#282828');
			document.documentElement.style.setProperty(`--text-color`, '#fafafa');
			document.documentElement.style.setProperty(`--accent-color`, '#a3a3a3');
			setTheme('dark')
		} else {
			document.documentElement.style.setProperty(`--background`, '#fafafa');
			document.documentElement.style.setProperty(`--text-color`, '#282828');
			document.documentElement.style.setProperty(`--accent-color`, '#5c5c5c');
			setTheme('light')
		}
	}


	const handleDelete = (taskIndex) => {
		const filteredArray = tasks.filter((item, index) => {
			return index !== taskIndex;
		});
		
		setTasks(filteredArray);
	}

	const handleDeleteFav = (taskIndex) => {
		const filteredFav = favorites.filter((item, index) => {
			return index !== taskIndex;
		});
		
		setFavorites(filteredFav)
	};

	
	return (
		<div className="big-wrapper">
			<Toaster />
			<button onClick={toggleTheme} className='toggle'>Switch mode</button>
			<div className='todo-wrapper'>
				<div className='todo-actions'>
					<input className='todo-input' type='text' value={inputValue} onChange={handleChangeInput} />
					<button className='todo-btn' onClick={handleAddTask}>Add</button>
				</div>
				<ol className='todo-list'>
					{favorites.map(function (favTask, index) {
						return (
							<li key={index} className='fav-item items'>
								<span>{favTask}</span>
								<div className='actions'><input
									type='checkbox'
									onChange={(event) =>
										handleAddToFavorite(event, index, 'fav-list')
									}
								/>
									<img src='./krest.jpg' className='delete' onClick={() => handleDeleteFav(index)} />
								</div>
							</li>
						);
					})}
					{tasks.map(function (task, index) {
						return (
							<li key={index} className='list-item items'>
								<span>{task}</span>
								<div className='actions'><input
									type='checkbox'
									onChange={(event) =>
										handleAddToFavorite(event, index, 'task-list')
									}
								/>
									<img src='./krest.jpg' className='delete' onClick={() => handleDelete(index)} />
								</div></li>
						);
					})}
				</ol>
			</div>
		</div>
	);
}

