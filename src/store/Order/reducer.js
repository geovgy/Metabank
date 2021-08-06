import {
    GET_ORDER
} from './actiontype'


const initialState = {
    Order: {}
    
}

function Order(state =initialState, action){
    switch(action.type){
        case GET_ORDER: 
            return{
                ...state,
                Order: action.payload
            }
        default:
             return state
    }
}


export default Order