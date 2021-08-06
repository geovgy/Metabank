import {
    SEARCH_PROJECT,
    CLEAR_PROJECT
} from './actiontype'

export const searchProject = (text) => async dispatch => {
    try {
             
        dispatch({
            type: SEARCH_PROJECT,
            payload: text
        })
    } catch (err) {
       
    }

   
}

export const clearSearch = () => {
    return{
        type: CLEAR_PROJECT
    }
}