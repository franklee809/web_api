import React,{Fragment,Component} from 'react';
import ReactTable from 'react-table';
import {InputGroup,Input,Button} from 'reactstrap';
import 'react-table/react-table.css';
import axios from 'axios'; 
// import Search from './search';
import  './search.css'

class Home extends Component {
    constructor() {
        super();
        this.state = {
          limit: 20,
          loading: false,
          data:[],
          symbols:'',
          tempArr:[],
          columns: [
            {  
                Header: 'Symbol',  
                accessor: 'symbol',
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
            }] ,
          pageIndex: 0,
          search: ''
        };
        this.startPoint();
        this.handleChange = this.handleChange.bind(this);
      }

      next = () =>{
        this.state.limit += 10;
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
        axios.get(`http://localhost:5000/api/home/searchStock?search=${this.state.search}`)
        .then(res =>{
          this.state.data = res.data
          this.setState({data:res.data});
          // console.log(res.data)
          this.state.loading = false;
        })  
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
                  <InputGroup >
                      <Input placeholder="Stock name" value={this.state.search} onChange={(e)=>{this.handleChange(e)}}/>
                      <Button color="primary" type="submit" onClick={(e)=>{this.search(e)}} >Search</Button> 
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
