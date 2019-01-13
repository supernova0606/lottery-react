import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            manager: '',
            players: [],
            balance: ''
        };
    }

    async componentDidMount(){
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);

        this.setState({
            manager: manager,
            players: players,
            balance: balance
        });
    }

    render() {
        return (
            <div className="App">
                <h2>This is the lottery application</h2>
                <p>This contract is managed by {this.state.manager}.
                    There are currently {this.state.players.length} people entered competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether! 
                </p>
            </div>
        );
    }
}

export default App;
