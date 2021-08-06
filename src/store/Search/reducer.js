import {
    SEARCH_PROJECT,
    CLEAR_PROJECT
} from './actiontype'

const initialState = {
    orders: localStorage.getItem("orders"),
    search: null
}

const Search = (state =initialState, action) => {
    switch(action.type){
        case SEARCH_PROJECT:
            return{
                ...state,
                search: state.orders.filter(order => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return order.topic.match(regex) 
                })
            }
        case CLEAR_PROJECT: 
            return{
                ...state,
                search: null
            }
        default:
            return state;
    }
}

export default Search;