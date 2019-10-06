
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title.js';
import axios from 'axios';


const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  }
});

export default class Card extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      title: props.title,
      count: props.count
    };
  }

  componentWillMount() {
    if (this.state.type != "" ) {
      axios.get("http://localhost:8080/kafka/"+this.state.type).then(response => {
        let body = response.data;
        this.setState({ count: body.data[this.state.type] })
      }).catch(function (error) {
        // handle error
        console.log(error);
      })
    }
    
  }

  render() {
    return (
      <React.Fragment>
        <Title>{this.props.title}</Title>
        <Typography component="h2" color="textSecondary" className={useStyles.depositContext}>
            {this.state.count}
        </Typography>
      </React.Fragment>
    );
  }
}
