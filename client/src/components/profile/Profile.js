import React from 'react';
import {Redirect } from 'react-router-dom'
import axios from 'axios';
import {
     Button,Container, Row, Col
  } from 'reactstrap';

const Profile1 = (props) => {
    console.log(props.location.state.symbol);
    
}
    class Profile extends React.Component{
        constructor(props) {
            super(props);
            this.state = {
                data:[]
            }
             axios.post('http://localhost:5000/api/home/companyProfile?symbol='+this.props.location.state.symbol).then(res=>{
                // console.log(res.data)
                this.state.data = res.data
                this.setState({data:this.state.data})
                })
          }
    render(){
        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <a href={this.state.data.website} target="_blank">
                                <img style={{"width":"20%"}} src={this.state.data.image}/></a>
                        </Col><br/>
                    </Row>

                    <Row>
                        <Col>{this.state.data.companyName}</Col>
                        <Col>Price : {this.state.data.price}</Col>
                        <Col>Changes : {this.state.data.changes}</Col>
                        <Col>ChangesPercentage : {this.state.data.changesPercentage}</Col><br/>
                    </Row>
                    <Row>
                        <Col xs="3">{this.state.data.description}</Col><br/>
                        <Col xs="auto"><Button color="info" onClick={()=>this.props.history.push('/home')}>Back</Button></Col>
                        {/* <Col xs="3">.col-3</Col> */}
                    </Row> 
                    </Container>

                </div>
            );
        }
    }




Profile.propTypes = {};

export default Profile;
