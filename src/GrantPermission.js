import {ROLES} from './App.constants';
import {LOCAL_STORAGE_SIGNIN_KEY} from './App.constants'


export const grantPermission = (role = [...ROLES]) => {

  const user = localStorage.getItem("users")

  const roles = user

  const isPermitted = role.filter(item => {
      return item === roles
    })

    return isPermitted.length > 0 ? true : false;

}