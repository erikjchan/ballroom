import styles from './addEvent.css';
import React from 'react';

export default class AddEvent extends React.Component {
	constructor() {
		super();
		this.state = {
			// TODO: consider nesting later
			selectedDance: null,
			selectedLevel: null,
			selectedStyle: null,
			dances: null,
			levels: null,
			styles: null
		} 
	}

	componentDidMount() {
		fetch("/api/events", {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json"
			})
		}).then((response) => {
			response.json().then((data) => {
				console.log(data);
				this.setState({
					dances: data.map((d) => {
						return d.title
					})
				});
			});
		}).catch(function(err) {
			console.log(err);
		});
	}

	getLevelsAndStyles() {
		fetch("/api/events", {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json"
			})
		}).then((response) => {
			response.json().then((respJson) => {
				console.log(respJson);
				const data = respJson.reduce(
					(acc, val) => {
						acc.levels.push(val.level);
						acc.styles.push(val.style);
						return {
							levels: acc.levels,
							styles: acc.styles
						};
					},
					{
						levels: [],
						styles: []
					}
				);
				this.setState({
					levels: data.levels,
					styles: data.styles		
				});
			});
		}).catch(function(err) {
			console.log(err);
		});
	}

	selectDance(dance) {
		this.getLevelsAndStyles();

		// TODO: Uncomment when we figure out how an element can pass itself into a click handler
		/*this.setState({
			selectedDance: dance
		});*/
	}

	render() {
		return (
			<div className={styles.addEvent}>
				<div>Add New Event</div>
				<div className={styles.eventListsContainer}>
					<div className={styles.eventListWrapper}>
						{this.state.dances ? (
							<div>
								<Number number="1" />
								<List name="Dance" data={this.state.dances} selectDance={this.selectDance.bind(this)} />
							</div>
						) : (
							<div>Loading dances...</div>
						)}
					</div>
					<div className={styles.eventListWrapper}>
						{this.state.levels ? (
							<div>
								<Number number="2" />
								<List name="Level" data={this.state.levels} />
							</div>
						) : (
							<div className={styles.placeholder}>Select a Dance</div>
						)}
					</div>
					<div className={styles.eventListWrapper}>
						{this.state.styles ? (
							<div>
								<Number number="3" />
								<List name="Style" data={this.state.styles} />
							</div>
						) : (
							<div className={styles.placeholder}>Select a Dance</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

function Number(props) {
	return (
		<div className={styles.number}>{props.number}.</div>
	)
}

class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: null
		};
	}

	handleClick(li) {
		console.log(this.props);
		if (this.props.name === "Dance") {
			// TODO: Uncomment when we figure out how an element can pass itself into a click handler
			// this.props.selectDance(li.props.value);
			this.props.selectDance();
		}
		// TODO: Uncomment when we figure out how an element can pass itself into a click handler
		/*this.setState({
			selected: li
		});*/
	}

	// TODO: Uncomment when we figure out how an element can pass itself into a click handler
	/*isSelected(li) {
		return "eventListItem" + (this.state.selected === li ? " selected" : "");
	}*/

	render() {
		const listItems = this.props.data.map((d, i) =>
			<li onClick={this.handleClick.bind(this)} key={i}>{d}</li>
		);
		return (
			<ul className={styles.eventList}>
				<li>{this.props.name}</li>
				{listItems}
			</ul>
		);
	}
}