import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { loadProducts } from "../store/product";
import { Button, Card, Container, Row, Col, Image } from "react-bootstrap";
import {addNewCoffee, updatedStock} from '../store'


// so essentially this needs to change if a guest is logged in was trying a whole bunch of things but can probably just use 
// an empty auth {}

class Coffees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: '',
      page: 1
    };
  
    this.onChange = this.onChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  componentDidMount() {
    this.props.bootstrap();
    console.log(this.props);
     // if nothing was added to the cart before log in only tken should be there
  const storage = window.localStorage;
  console.log(storage.length);
  if(storage.length>1){
    // we added stuff to the cart already need to get those itmes and put them in the cart
    let orders = {};
    let keys = Object.keys(storage);
    let i = keys.length;
    while ( i ) {
              i--;
              if (keys[i] !== 'token'){
                this.props.addNewCoffee(1, this.props.auth.id, keys[i]);
                orders[ keys[i] ] = storage.getItem( keys[i] );
              storage.removeItem( keys[i] );}
          }
          //need to seend orders to cart 
          console.log(orders)
  }

  }

  putInCart(coffeeId, coffeeStock){
    
    let stock = coffeeStock - 1;
    // should update the stock of coffee we have in the store
    if (stock >= 0){
      this.props.updateStock(stock, coffeeId)
    }
    // we are out of stock can't put it in the cart
    if (coffeeStock > 0 && this.props.auth.id) {      
      this.props.addNewCoffee(1, this.props.auth.id, coffeeId);
      //ideally a function for a pop up window would be called to tell user they added to cart
      
    } else if ( coffeeStock > 0 ) {      
      console.log('you are trying to add coffee to the guest cart')
      // so this will put an item into local storage
      localStorage.setItem( coffeeId, 1);
      // this.props.addNewCoffee(1, this.props.auth.id, coffeeId);
      //ideally a function for a pop up window would be called to tell user they added to cart  
    }
  }

  nextPage(number){
    let num = this.state.page + number;
    this.setState({page: num});    
  }

  onChange(ev){
    const change = {};
    change[ev.target.name] = ev.target.value;
    this.setState(change);
  }

  render() {
    const categories = ['LIGHT', 'MEDIUM', 'DARK'];
    let coffees = this.props.product;
    // console.log(coffees);
    const { category, page } = this.state;
    const { onChange } = this;
    // console.log(category);
    if (category !== ''){
      coffees = coffees.filter(coffee=> coffee.category === category );
      // maybe should be in component did update?? esentially trying to get back to page one when we sort by category 
      // if (page != 1){
      //   this.setState({page: 1});
      // }
    }
    const lastPage = Math.ceil(coffees.length/12);
    // console.log(lastPage);
    // maybe just take 12 coffees need some more logic to turn off buttons
    coffees = coffees.filter((coffee, idx) => { if ((idx) < 13  * page && idx >= 13 * (page-1) ){ return coffee}});
    // console.log(coffees);
    return (
      <div className={"list"}>
            <select name='category' value={ category } onChange = { onChange }>
                    <option value = ''>All</option>
                    {
                        categories.map( (cat) => { 
                                return (
                                    <option key={ cat } value = { cat }>
                                        { cat } 
                                    </option>
                                );
                            })
                    }

                </select>
        {/* can turn this off at page 1 */}
        <Button variant="primary" disabled={page <= 1 } onClick = {()=> this.nextPage(-1)}>Previous Page</Button>
        {/* need to caluclate length divide by 12 an stop at that page */}
        <Button variant="primary" disabled={page >= lastPage } onClick = {()=> this.nextPage(1)}>Next Page</Button>
        <Container>
          <Row>
            {coffees.map((coffee) => {
              return (
                <div key={coffee.id}>
                  <Col md={4} sm={6}>
                    {" "}
                    <Card
                      className="bg-dark text-white mt-4"
                      className="body2 mt-4"
                      style={{ width: "18rem" }}
                      key={coffee.id}
                    >
                      <Card.Img
                        variant="top"
                        src={window.location.origin + "/assets/Coffee1.jpg"}
                      />
                      <Card.Body>
                        <Card.Title>
                          <Link to={`/coffee/${coffee.id}`}>{coffee.name}</Link>{" "}
                        </Card.Title>
                        <Card.Text>{coffee.category}</Card.Text>
                        { coffee.stock > 0 ? (
                          <Button variant="primary" onClick = {()=> this.putInCart(`${coffee.id}`, `${coffee.stock}`)}>Add to Cart</Button> 
                          ) : (
                            <p>Out of Stock</p>
                          )}

                      </Card.Body>
                    </Card>
                  </Col>
                </div>
              );
            })}
          </Row>
        </Container>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    bootstrap: () => {
      dispatch(loadProducts());
    },
    addNewCoffee(quantity, userId, coffeeId){
      dispatch(addNewCoffee(quantity, userId, coffeeId))
    },
    updateStock(stock, coffeeId){
      dispatch(updatedStock(stock, coffeeId))
    },  
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Coffees);
