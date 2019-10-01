import Loader from 'react-loader-spinner'
import React from 'react'
import './loader.css'

 export default class App extends React.Component {
  //other logic
    render() {
     return(
      <Loader
         type='Rings'
         color='green'
         height={200}
         width={200}
         className='Loading'
      />
     );
    }
 }
