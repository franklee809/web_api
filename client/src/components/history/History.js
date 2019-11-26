import React from 'react';
import {Redirect } from 'react-router-dom'
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';
import "./history.css"
import {Button,Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

    class History extends React.Component{
        constructor(props) {
            super(props);
            this.state = {
                data:[],
                columns: [
                    {  
                        Header: 'Search Keyword',  
                        accessor: 'search',
                        maxWidth: 200,
                        headerStyle: { textAlign: 'left', 'backgroundColor': '#4CAF50', color: 'white',   'paddingTop': '12px','paddingBottom': '12px'},
                    },
                    {  
                        Header: 'Created',  
                        accessor: 'created',
                        headerStyle: { textAlign: 'left', 'backgroundColor': '#4CAF50',color: 'white','paddingTop': '12px','paddingBottom': '12px'} , 
                    },
                    {  
                      Header: 'Notes',  
                      accessor: 'note',
                      headerStyle: { textAlign: 'left' ,'backgroundColor': '#4CAF50',color: 'white','paddingTop': '12px','paddingBottom': '12px'},
                    },
                    { 
                      Header: 'Delete',
                      headerStyle: { textAlign: 'left' ,'backgroundColor': '#4CAF50',color: 'white','paddingTop': '12px','paddingBottom': '12px'},
                      maxWidth: 100,
                      Cell : row => (
                        // <div> {this.viewProfile(row.original.symbol)}<Button color="secondary" onClick={this.setRedirect}>Look</Button></div>
                        <Button color="secondary" onClick={()=>this.delete(row.original._id)}>delete </Button>
                      )
                    }
                  ] ,
                user:null,
                isOpen:true
            }
            this.isAuthenticated();
          }
          delete(id){
            axios.delete('http://localhost:5000/api/home/deleteOne?id='+id).then(res=>{
              this.getAll();
            })
          }
          isAuthenticated(){
            var token = localStorage.getItem('token')
            if(token != null){
               axios.get('http://localhost:5000/api/auth',{
                'header':{
                  'x-auth-token': token
                }
              }).then(response=>{
                  this.state.user = response.data._id
                  this.setState({user:this.state.user})
              }).then(response2=>{
                this.getAll();
              })
            }
          }
          getAll(){
            axios.post('http://localhost:5000/api/home/getSearchHistory?id='+this.state.user).then(res=>{
                console.log(res.data)
                this.state.data = res.data
                this.setState({data:this.state.data})
                })
          }
          toggleModal = () => {
            this.setState(prevState => ({
              isOpen: !prevState.isOpen
            }));
          }
          render(){
              return (
                  <div>
                      <p>Your previous searching history</p>
                      <ReactTable
                          data={this.state.data.reverse()}  
                          columns={this.state.columns}  
                          defaultPageSize = {10}  
                          pageSizeOptions = {[10]} 
                          />

                    {/* <Button color="danger" onClick={this.toggleModal}>Delete</Button>
                            <Modal isOpen={this.state.isOpen} toggle={this.toggleModal}>
                              <ModalHeader className="text-center" toggle={this.toggleModal}>
                                <div className="icon-box">
                                  <i className={`fa red-circle fa-trash`}></i>
                                </div>
                                <h2>Are you sure?</h2>
                              </ModalHeader>
                              <ModalBody>Do you really want to delete these records? This process cannot be undone.</ModalBody>
                              <ModalFooter>
                                <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>{' '}
                                <Button color="danger" onClick={this.toggleModal}>Delete</Button>
                              </ModalFooter>
                            </Modal> */}
                      </div>
                      
                  );
              }
          }




History.propTypes = {};

export default History;
