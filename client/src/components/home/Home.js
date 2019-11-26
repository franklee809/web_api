import React,{Fragment,Component} from 'react';
import ReactTable from 'react-table';
import {InputGroup,Input,Button} from 'reactstrap';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import 'react-table/react-table.css';
import axios from 'axios'; 
import {Redirect,Link} from 'react-router-dom'
import  './search.css'
import { Alert } from 'reactstrap';

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}
 

class Home extends Component {
    constructor() {
        super();
        this.state = {
          limit: 20,
          loading: false,
          data:[],
          symbols:'',
          tempArr:[],
          redirect:false,
          error:{"display":"none"},
          columns: [
            {  
                Header: 'Symbol',  
                accessor: 'symbol',
                maxWidth: 100,
                headerStyle: { textAlign: 'left', 'backgroundColor': '#4CAF50', color: 'white',   'paddingTop': '12px','paddingBottom': '12px'},
            },
            {  
                Header: 'Name',  
                accessor: 'name',
                headerStyle: { textAlign: 'left', 'backgroundColor': '#4CAF50',color: 'white','paddingTop': '12px','paddingBottom': '12px'} , 
            },
            {  
              Header: 'Price',  
              accessor: 'price',
              headerStyle: { textAlign: 'left' ,'backgroundColor': '#4CAF50',color: 'white','paddingTop': '12px','paddingBottom': '12px'},
            },
            { 
              Header: 'Profile',
              headerStyle: { textAlign: 'left' ,'backgroundColor': '#4CAF50',color: 'white','paddingTop': '12px','paddingBottom': '12px'},
              maxWidth: 100,
              Cell : row => (
                <div> {this.viewProfile(row.original.symbol)}<Button color="secondary" onClick={this.setRedirect}>Look</Button></div>
              )
            }
          ] ,
          pageIndex: 0,
          search: '',
          user:null
        };
        this.startPoint();
        this.handleChange = this.handleChange.bind(this);
        this.isAuthenticated()
      }

      next = () =>{
        this.state.limit += 10;
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
          })
        }
      }
      async startPoint(index = null){
        var self = this;
        if(this.state.pageIndex < index || index === null){
            this.setState({pageIndex: index})
            await axios.get(`http://localhost:5000/api/home/getAllSymbolList?limit=${self.state.limit}`).then(res => {
                var oldArray = self.state.data;
                var newArray = res.data
                Array.prototype.push.apply(oldArray,newArray)
                this.state.data = newArray;
                self.next();
            })
            self.getPrice();
        }
      }
      viewProfile(symbol){
        if (this.state.redirect) {
         return <Redirect to={{
              pathname:'/profile', 
              state:{"symbol": symbol}}}/> 
         }
      }
      setRedirect = () => {
        this.setState({
          redirect: true
        })
      }
      

      goTop(){
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      }

    async getPrice(){
      var self = this;
      var array = this.state.data;
      var string = '';
      
        await array.forEach((item)=>{
            string = string+item.symbol+',';
        })
        await axios.post(`http://localhost:5000/api/home/getRealTimePrice`,{
          "list": string
        }).then(res=>{
          let arr = res.data.companiesPriceList;
          var addKey = [];
          for(let i = 0; i < arr.length; i++){
            addKey[arr[i].symbol] = arr[i].price
          }
          self.state.tempArr = addKey;
        })
        var a = self.state.data;
        var b = self.state.tempArr;

        a.forEach((item)=>{
          item.price = b[item.symbol]
        })
      self.setState({data:a})
    }
    search(e){
      e.preventDefault();
      this.state.loading = true
      if(this.state.search != '' && this.state.loading === true){
        axios.get(`http://localhost:5000/api/home/searchStock?search=${this.state.search}&user=${this.state.user}`)
        .then(res =>{
          console.log(res.status)
          if(res.status != 200){
            this.state.error = {"display":"inline"};
            this.setState({error:this.state.error});
            setTimeout(function() {this.setState({error: {"display":"none"}});}.bind(this),3000);
          }
          else{
            this.state.data = res.data
            this.setState({data:res.data});
          }
          this.state.loading = false;

        }).catch(err=>{
          console.log(err)
          this.state.error = {"display":"inline"};
          this.setState({error:this.state.error});
          setTimeout(function() {this.setState({error: {"display":"none"}});}.bind(this),3000);})
      }
    }
  
    handleChange(e){
      this.setState({search:e.target.value})
    }
      render(){
        return(
            <Fragment>
              <div className="main">
                  <h2> Stock List</h2>
                  <Alert color="danger" style={this.state.error}>
                    No Search Result...
                  </Alert>
                  <InputGroup >
                      <Input placeholder="Stock name" value={this.state.search} onChange={(e)=>{this.handleChange(e)}}/>
                      <Button color="primary" type="submit" onClick={(e)=>{this.search(e)}} >Search</Button> 
                      <Button color="secondary"><Link to="/history">History</Link></Button> 
                  </InputGroup>
              </div>

                    <ReactTable
                    data={this.state.data}  
                    columns={this.state.columns}  
                    defaultPageSize = {10}  
                    pageSizeOptions = {[10]} 
                    onPageChange={(pageIndex) => {
                        this.startPoint(pageIndex)
                        this.goTop()
                      }}
                    />

            </Fragment>
        );
    }
};


Home.propTypes = {};

export default Home;
