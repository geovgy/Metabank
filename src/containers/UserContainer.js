import { Container } from "unstated";
import instance from "../helpers/axiosly";
import CONSTANTS from "../helpers/App.constant";
import { userRoutes, authRoutes, superadminRoutes } from "../routes/allRoutes";
import { LOCAL_STORAGE_SIGNIN_KEY} from '../App.constants'
import { ROLES } from '../App.constants'

class UserContainer extends Container {
  constructor() {
    super();
    this.state = {
      updatedProfile: false,
      sessionData: {
        user: null,
        accessToken: "",
        userId: -1,
        register: null,
        score: '',
        allUserList: []
      },
      writerDom: false
    };

    // this.init();
  }

  ispermission(role = [...ROLES]) {
    console.log(this.state?.sessionData?.user?.Role?.role)
    const adminRole = this.state?.sessionData?.user?.Role?.role;

    const isPermitted = role.filter(item => {
      return item === adminRole
    })

    return isPermitted.length > 0 ? true : false;

  }



  goBack = (props) => {
    props.history.goBack();
  };

  fetchUser = () => {
    let user

    if (!localStorage.getItem('authUser')) {
      user = localStorage.getItem(LOCAL_STORAGE_SIGNIN_KEY)
    } else user = localStorage.getItem('authUser')
    if (user) {

      user = JSON.parse(user);
      this.setState({
        sessionData: {
          user: user,
          accessToken: `${user.access_token}`,
          userId: user.id,
        },
      })
      return user;
    }
    return {};
  };

  fetchAllUser = (bearertoken) => {
    return new Promise((resolve, reject)=> {
      instance
      .get(`${process.env.REACT_APP_DATABASEURL}user`, {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {
        resolve(response)
            this.setState({
              sessionData: {
                allUserList: response.data.data.rows,
              },
            });
      })

      .catch((e) => console.log(e));
    })

  }

 

  signIn = ({ email, password }, props) => {
    return new Promise((resolve, reject) => {
      instance
      .post(`${process.env.REACT_APP_DATABASEURL}auth/login`, { email, password })
      .then(async (response) => {
        const user = response.data.data;
        console.log(user);

        console.log("check base url ", process.env.REACT_APP_DATABASEURL)

        localStorage.setItem(LOCAL_STORAGE_SIGNIN_KEY, JSON.stringify(response.data.data));
        console.log(user)

        this.setState({
          sessionData: {
            user: user,
            // accessToken: `${user.access_token}`,
            userId: user.id,
          },

        });
        let Authuser = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SIGNIN_KEY))
        if (Authuser.subRole === "Super-admin") {
          localStorage.setItem("users", Authuser.subRole)
        } else {
          localStorage.setItem("users", Authuser.Role.role)
        }
        localStorage.setItem("token", Authuser.access_token)


        if (Authuser.Role.role === 'Client') {

          // localStorage.setItem("User", 'Client')
          props.history.push("/dashboard");
        }
        // return {};
        console.log(resolve(response));
        resolve(response);

      })
      .catch((e) => {
        console.log(e);
        // console.log(reject(e));
          // reject(e);
      });

    })


  };

  // /auth/verify/{id}
  verifyUser = (id, props) => {
    console.log("my id first :", id)
    instance
      .get(`${process.env.REACT_APP_DATABASEURL}auth/verify/${id}`)
      .then((response) => {
        const resStatus = response.data.status;
        console.log(resStatus);
        props.history.push("/login");

        return true;

      })
      .catch((e) => {
        console.log(e);

      });
  }




 

}

export { UserContainer };

