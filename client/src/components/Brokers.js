
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title.js';
import axios from 'axios';


const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default class Brokers extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      brokers: 0
    };
  }
  componentWillMount() {
    axios.get("http://localhost:8080/kafka/brokers").then(response => {
      this.setState({brokers: response.data.brokers})
    }).catch(function (error) {
      // handle error
      console.log(error);
    })
  }
  render() {
    return (
      <React.Fragment>
        <Title>Online Brokers</Title>
        <Typography color="textSecondary" className={useStyles.depositContext}>
            {this.state.brokers}
        </Typography>
        
      </React.Fragment>
    );
  } 
}
