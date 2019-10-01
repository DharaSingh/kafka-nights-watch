
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title.js';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Brokers() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Online Brokers</Title>
      <Typography color="textSecondary" className={classes.depositContext}>
        0
      </Typography>
      
    </React.Fragment>
  );
}