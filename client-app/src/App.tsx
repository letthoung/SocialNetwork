import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Header, List, Icon } from 'semantic-ui-react';

class App extends Component {
  state = {
    values: []
  }

  componentDidMount(){
      axios.get('http://localhost:5000/api/values')
        .then(response => {
          console.log(response);
          this.setState({
            values: response.data
          });
        })
  }

  render()
  {
    return (
      <div>
        <Header as='h2'>
          <Icon name='users' />
          <Header.Content>Social Network</Header.Content>
          <List>
            {this.state.values.map((value: any) => (<List.Item key={value.id}>{value.name}</List.Item>))}
          </List>
        </Header>
      </div>
    );
  }
}

export default App;
