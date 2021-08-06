import axios from 'axios'
import instance from "../../helpers/axiosly";
import {
    REQUEST_SERVICE,
    GET_SERVICE,
    DELETE_SERVICE,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_SERVICE
} from './actiontype';


export const getService = ()  => async (dispatch) => {
  let token = JSON.parse(localStorage.getItem("authUser"))
  console.log(token.access_token)
  try {
    dispatch({type: REQUEST_SERVICE});
    const res = await instance
      .get(`${process.env.REACT_APP_DATABASEURL}services`, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      })
      
    
      dispatch({
        type: GET_SERVICE, payload: res.data.data.rows
    });
  } catch (e) {
    console.log(e);
  }
  
}

export const deleteService = (id)  => async (dispatch) => {
   let token = JSON.parse(localStorage.getItem("authUser"))
  
    try {

        await instance
        .delete(`${process.env.REACT_APP_DATABASEURL}services/{id}`, {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        })
        dispatch({
            type: DELETE_SERVICE, payload: id
        });
    } catch (err) {
       
    }

   
}