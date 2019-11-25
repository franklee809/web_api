import React,{Fragment,useState} from 'react';
import {InputGroup,Input,Button} from 'reactstrap';
import  './search.css'


const Search = (props) => {

  return ( 
    <div className="main">
        <h2 > Stock List</h2>
        <InputGroup>
            <Input placeholder="Stock name" />
            <Button color="primary">Search</Button> 
        </InputGroup>
    </div>
  );
};  
export default Search;
