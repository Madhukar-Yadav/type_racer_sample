import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'grommet/components/Button';
import TextInput from 'grommet/components/TextInput';

class App extends Component {

  constructor(props){
    super(props);
    this.state={
      checkStmt: 'Welcome to React',
      checkstr: 'Welcome to React',
      greenStmt: '',
      typeValue: '',
      time: {}, 
      seconds: 45,
      wordlength: 0
    };
    this.timer = 0;

    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    
    this.onTxtChange = this.onTxtChange.bind(this);
  }

  getNewData(){
    let txt = '';
    fetch('http://www.randomtext.me/api/')
    .then(function(response) {
          return response.json();
    })
    .then(function(myJson) {
          txt = myJson.text_out.replace(/<[^>]*>/g, ' ');
          this.state.checkstr = txt.trim();
          this.state.wordlength = 0;
          this.setState({checkStmt: txt.trim()});
    }.bind(this));
  }

  componentWillMount(){
    this.getNewData();    
  }

  checkword(value){
    if(this.state.checkstr.split(' ')[0] === value){
        this.state.greenStmt += this.state.checkstr.split(' ')[0]+' ';
        this.state.checkstr = this.state.checkStmt.slice(this.state.greenStmt.length, this.state.checkStmt.length);
        return true;
    }else{
        return false;
    }
  }

  onTxtChange(e){
    if(e.target.value.slice(e.target.value.length-1, e.target.value.length) === ' '){
      let txt = e.target.value.split(' ');
      if(this.checkword(txt[0])){
        this.setState({typeValue: ''});
      }else{
        this.setState({typeValue: e.target.value}); 
      }
    }else{
      this.setState({typeValue: e.target.value});
    }
  }

  resetTimer(){
    this.timer = 0;
    this.getNewData();    
    this.setState({seconds: 45, greenStmt: ''});
  }

  startTimer() {
    if (this.timer == 0) {
      this.state.wordlength = 0;
      this.state.greenStmt = '';
      this.state.checkstr = this.state.checkStmt;
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {    
    let seconds = this.state.seconds - 1;
    
    // Check if we're at zero.
    if (seconds == 0) { 
      clearInterval(this.timer);
      this.state.wordlength = this.state.greenStmt.split(' ').length-1;
    }
    
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    
  }
  
  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro"style={{marginTop: '20px'}}>
            <span style={{color: 'green'}}>{this.state.greenStmt}</span>
            <span>{this.state.checkstr}</span>
        </p>
        <div>
          <span style={{marginRight: '20px'}}>
              <TextInput onDOMChange={ (e) => this.onTxtChange(e) } value={this.state.typeValue} />
          </span>
          <span>
              <Button onClick={this.startTimer} label='Start Timer' />
          </span>
          <span style={{margin: '0px 20px'}} >{this.state.seconds}</span>
          <span>
              <Button onClick={this.resetTimer} label='Reset Timer' />
          </span>
          
        </div>
        <div style={{padding: '25px'}}>
          {this.state.seconds == 0 ? 
            <div>
              <p>Race is over : </p>
              <p>Total no of words typed within the time-limit is : {this.state.wordlength}</p>
            </div> : null }
        </div>
      </div>
    );
  }
}

export default App;
