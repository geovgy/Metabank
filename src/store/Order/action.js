/*import {
    GET_ORDER
} from './actiontype'
import instance from "../../helpers/axiosly";

export const getOrder = async() => ( { 
    try {
        const {res} = await instance
          .get(`${process.env.REACT_APP_DATABASEURL}order`, {
            headers: {
              Authorization: `Bearer ${props.userStore.state.sessionData.accessToken}`,
            },
          })
          dispatch({ type: GET_ORDER, payload: res.data})
      } catch (e) {
        console.log(e);
      }
})*/