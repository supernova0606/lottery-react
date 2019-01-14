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
            balance: '',
            value: '',
            message: ''
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

    onSubmit = async(e) => {
        e.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({
            message: 'Waiting on transaction success...'
        })

        await lottery.methods.enter().send({
            from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether')});

        this.setState({
            message: 'You have entered the lottery'
        })
    }

    onPickWinner = async() => {
        const accounts = await web3.eth.getAccounts();

        this.setState({
            message: 'Winner is being picked...'
        })

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        this.setState({
            message: 'A winner has been picked'
        })

    }

    render() {
        return (
            <div className="App">
                <h2>This is the lottery application</h2>
                <p>This contract is managed by {this.state.manager}.
                    There are currently {this.state.players.length} people entered competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether! 
                </p>

                <hr />

                <form 
                onSubmit = {this.onSubmit}>
                    <h4>Enter the lottery?</h4>
                    <h2>{this.state.message}</h2>
                    <div>
                        <label>Amount of ether to enter</label>
                        <input 
                            onChange={(e) => {
                                this.setState({ value: e.target.value})
                            }} 
                            value = {this.state.value}
                        />
                        <button>Enter</button>
                    </div>
                </form>

                <hr />

                <h4>Pick A Winner</h4>
                <button
                onClick={this.onPickWinner}>Pick Winner</button>
            </div>
        );
    }
}

export default App;
