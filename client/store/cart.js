import axios from 'axios'

const storage = () => window.localStorage
const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const SET_CART = 'SET_CART';

/**
 * ACTION CREATORS
 */
const setCart = cartList => ({type: SET_CART, cartList})

/**
 * THUNK CREATORS
 */
export const cart = (id) => async dispatch => {
  const token = storage().getItem(TOKEN)
  if (token) {
    const res = await axios.get(`/api/cart/${id}`)
    return dispatch(setCart(res.data))
  }
}

export const addNewCoffee = (quantity, userId, coffeeId) =>{
  // console.log('in thunk for addnewCoffe');
  return async(dispatch)=>{
    //try and find an open cart for user
    let cart = (await axios.get(`/api/cart/simple/${userId}`)).data;

    // console.log(cart);
    if(!cart){
      // console.log('no cart')
      // user does not have an open cart create one
      cart = (await axios.post('/api/cart/newCart', { userId })).data;
      // console.log(cart.id)
    }         
    
    //check the contents of the cart 
    let contents = (await axios.get(`/api/cart/${userId}`)).data;
  
    //console.log(contents); 
    let newCoffee = true;

    //see if they already have the coffee in the cart 
    for (let i=0; i<contents.length; i++){
            // console.log(contents[i].coffeeId);
            if(contents[i].coffeeId * 1 === coffeeId * 1){
                // console.log('you already have it')
                newCoffee = false;
            }
        }

    // console.log(newCoffee)
    const cartId = cart.id;
    
    // they don't have that kind of coffee in their cart so add it 
    if (newCoffee){
        let cart_coffee = (await axios.post('/api/cart/', { quantity, cartId, coffeeId })).data;
        // console.log('in thunk');
        // console.log(cart);
        contents = (await axios.get(`/api/cart/${userId}`)).data;
        dispatch(setCart(contents));
    }
    //need to add an else statement to update quanity
  }
};

/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case SET_CART:
      return action.cartList;
    default:
      return state
  }
}
