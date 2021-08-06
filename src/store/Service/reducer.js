import {
    REQUEST_SERVICE,
    GET_SERVICE,
    DELETE_SERVICE,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_SERVICE
} from './actiontype';

const initialState = {
    services: [],
    current: null,
    loading: false,
  };

const Service = (state = initialState, action) =>{
    switch(action.type){
        case REQUEST_SERVICE:
            return{
                loading: true,
            }
        case GET_SERVICE: 
            return{
                ...state,
                loading: false,
                services: action.payload,
            }
        case  DELETE_SERVICE:
            return{
                ...state,
                services: state.services.filter(service => service.id !== action.payload),
                loading: false
            }
        default:
            return{state}
            
    }
  }

export default Service;