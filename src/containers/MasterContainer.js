import { Container } from "unstated";
import instance from "../helpers/axiosly";
import { LOCAL_STORAGE_SIGNIN_KEY } from '../App.constants'

// Get token from local storage
const token = localStorage.getItem("token");

class MasterContainer extends Container {
  constructor() {
    super();
    this.state = {
      sessionData: {
        serviceList: [],
        subjectareaList: [],
        spacingList: [],
        libraryList: [],
        projectList: [],
        withdrawalList: [],
        paperFormatListL: [],
        paperTypeList: [],
        supportList: [],
        examList: [],
        questionList: []
      },
    };
  }

/**
 *
 * State manager for Services
 *
* */

// Function to get list of services

  fetchService = (bearertoken) => {
    return new Promise((resolve, reject)=> {
      instance
      .get(`${process.env.REACT_APP_DATABASEURL}services`, {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {
        resolve(response)

            this.setState({
              sessionData: {
                serviceList: response.data.data.rows,
              },
            });
            console.log(this.state.sessionData.serviceList)


      })

      .catch((e) => console.log(e));
    })


  };

  // Function to get list of order

  fetchOrder = (bearertoken) => {
    console.log(bearertoken)
    return new Promise((resolve, reject)=> {
      instance
      .get(`${process.env.REACT_APP_DATABASEURL}project`, {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {
        resolve(response)

            this.setState({
              sessionData: {
                serviceList: response.data.data.rows,
              },
            });
            console.log(this.state.sessionData.serviceList)


      })

      .catch((e) => console.log(e));
    })


  };

//post service
  addService = (state, bearertoken) => {
    instance
      .post(`${process.env.REACT_APP_DATABASEURL}services`,{
        name: state.name,
        price: state.price
        },  {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {

        console.log("services here ", response.data.data)

      })

      .catch((e) => console.log(e));
  }

  //update service
  updateServices = (state, bearertoken, id) => {
    instance
    .put(`${process.env.REACT_APP_DATABASEURL}services/${id}`,{
      name: state.name.toString(),
      price: state.price.toString()
      },  {
      headers: {
        Authorization: `Bearer ${bearertoken}`,
      },
    })
    .then((response) => {

      console.log("services here ", response.data.data)

    })

    .catch((e) => console.log(e));
  }

// function to delete service
  deleteService = (id) => { return new Promise((resolve, reject)=> {
    instance
    .delete(`${process.env.REACT_APP_DATABASEURL}services/${id}`, {

      headers: {
        Authorization: `Bearer ${token}`,
      },

    }).then((response) => {

      resolve(response);

    }).catch((e) => {
      console.log(e);
    });
  })



  }


  // Function to get list of subject area

  fetchSubjectarea = (bearertoken) => {
    return new Promise((resolve, reject)=>{
      instance
      .get(`${process.env.REACT_APP_DATABASEURL}subject-area`, {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {
        resolve(response)
            this.setState({
              sessionData: {
                subjectareaList: response.data.data.rows,
              },
            });



      })

      .catch((e) => console.log(e));
    })

  };

//post subject
  addSubjectarea = (state, bearertoken) => {
    instance
      .post(`${process.env.REACT_APP_DATABASEURL}subject-area`,{
        name: state.name,
        price: state.price
        },  {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {

        console.log("services here ", response.data.data)

      })

      .catch((e) => console.log(e));
  }

  //update subject
  updateSubjectarea = (state, bearertoken, id) => {
    instance
    .put(`${process.env.REACT_APP_DATABASEURL}subject-area/${id}`,{
      name: state.name.toString(),
      price: state.price.toString()
      },  {
      headers: {
        Authorization: `Bearer ${bearertoken}`,
      },
    })
    .then((response) => {

      console.log("services here ", response.data.data)

    })

    .catch((e) => console.log(e));
  }

// function to delete subject
  deleteSubjectarea = (id) => {
    return new Promise((resolve, reject)=> {
    instance
    .delete(`${process.env.REACT_APP_DATABASEURL}subject-area/${id}`, {

      headers: {
        Authorization: `Bearer ${token}`,
      },

    }).then((response) => {
      console.log(resolve(response));
      resolve(response);

    }).catch((e) => {
      console.log(e);
    });
  })



  }


   // Function to get list of spacing

   fetchSpacing = (bearertoken) => {
    return new Promise((resolve, reject)=>{
      instance
      .get(`${process.env.REACT_APP_DATABASEURL}spacing`, {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {
        resolve(response)
            this.setState({
              sessionData: {
                spacingList: response.data.data,
              },
            });



      })

      .catch((e) => console.log(e));
    })

  };

//post spacing
  addSpacing = (state, bearertoken) => {
    instance
      .post(`${process.env.REACT_APP_DATABASEURL}spacing`,{
        name: state.name,
        price: state.price
        },  {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {

        console.log("services here ", response.data.data)

      })

      .catch((e) => console.log(e));
  }

  //update spacing
  updateSpacing = (state, bearertoken, id) => {
    instance
    .put(`${process.env.REACT_APP_DATABASEURL}spacing/${id}`,{
      name: state.name.toString()
      },  {
      headers: {
        Authorization: `Bearer ${bearertoken}`,
      },
    })
    .then((response) => {

      console.log("services here ", response.data.data)

    })

    .catch((e) => console.log(e));
  }

// function to delete spacing
  deleteSpacing = (id) => {
    return new Promise((resolve, reject)=> {
    instance
    .delete(`${process.env.REACT_APP_DATABASEURL}spacing/${id}`, {

      headers: {
        Authorization: `Bearer ${token}`,
      },

    }).then((response) => {
      console.log(resolve(response));
      resolve(response);

    }).catch((e) => {
      console.log(e);
    });
  })

  }

  fetchPaperFormat = (bearertoken) => {
    return new Promise((resolve, reject)=>{
      instance
      .get(`${process.env.REACT_APP_DATABASEURL}paper-format`, {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {
        resolve(response)
            this.setState({
              sessionData: {
                paperFormatList: response.data.data,
              },
            });



      })

      .catch((e) => console.log(e));
    })

  };

  addPaperFormat = (state, bearertoken) => {
    instance
      .post(`${process.env.REACT_APP_DATABASEURL}paper-format`,{
        name: state.name
        },  {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {



      })

      .catch((e) => console.log(e));
  }

  updatePaperFormat = (state, bearertoken, id) => {
    instance
    .put(`${process.env.REACT_APP_DATABASEURL}paper-format/${id}`,{
      name: state.name.toString()
      },  {
      headers: {
        Authorization: `Bearer ${bearertoken}`,
      },
    })
    .then((response) => {

      console.log(response.data.data)

    })

    .catch((e) => console.log(e));
  }

  deletePaperFormat = (id) => {
    return new Promise((resolve, reject)=> {
    instance
    .delete(`${process.env.REACT_APP_DATABASEURL}paper-format/${id}`, {

      headers: {
        Authorization: `Bearer ${token}`,
      },

    }).then((response) => {
      console.log(resolve(response));
      resolve(response);

    }).catch((e) => {
      console.log(e);
    });
  })

  }

  fetchPaperType = (bearertoken) => {
    return new Promise((resolve, reject)=>{
      instance
      .get(`${process.env.REACT_APP_DATABASEURL}paper-format`, {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {
        resolve(response)
            this.setState({
              sessionData: {
                paperTypeList: response.data.data,
              },
            });



      })

      .catch((e) => console.log(e));
    })

  };

  addPaperType = (state, bearertoken) => {
    instance
      .post(`${process.env.REACT_APP_DATABASEURL}paper-format`,{
        name: state.name
        },  {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {



      })

      .catch((e) => console.log(e));
  }

  updatePaperType = (state, bearertoken, id) => {
    instance
    .put(`${process.env.REACT_APP_DATABASEURL}paper-format/${id}`,{
      name: state.name.toString()
      },  {
      headers: {
        Authorization: `Bearer ${bearertoken}`,
      },
    })
    .then((response) => {

      console.log(response.data.data)

    })

    .catch((e) => console.log(e));
  }

  deletePaperType = (id) => {
    return new Promise((resolve, reject)=> {
    instance
    .delete(`${process.env.REACT_APP_DATABASEURL}paper-format/${id}`, {

      headers: {
        Authorization: `Bearer ${token}`,
      },

    }).then((response) => {
      console.log(resolve(response));
      resolve(response);

    }).catch((e) => {
      console.log(e);
    });
  })

  }



  //Function to make single payment for any Order placed by the client
  singleOrderPayment = (id, user_id, amount, balance, redirect_url) => {
    console.log(`${window.location.origin}/payments`)
    return new Promise((resolve, reject)=> {
    instance
    .post(`${process.env.REACT_APP_DATABASEURL}order/${id}/complete-pay`,
    {
      id: id,
      user_id: user_id,
      amount: amount,
      balance: balance,
      redirect_url: `${window.location.origin}/payments`
    },
    {

      headers: {
        Authorization: `Bearer ${token}`,
      },

    }).then((response) => {
      console.log(resolve(response));
      resolve(response);

    }).catch((e) => {
      console.log(e);
    });
  })

  }


  //fetch exams
  fetchExam = (bearertoken) => {
    return new Promise((resolve, reject)=>{
      instance
      .get(`${process.env.REACT_APP_DATABASEURL}exam`, {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {

        resolve(response)
            this.setState({
              sessionData: {
                examList: response.data.data,
              },
            });



      })

      .catch((e) => console.log(e));
    })

  };


  //post exam
  addExam = (state, bearertoken) => {
    instance
      .post(`${process.env.REACT_APP_DATABASEURL}exam`,{
        name: state.name
        },  {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {

        console.log("exam here ", response.data.data)

      })

      .catch((e) => console.log(e));
  }

  //update spacing
  updateExam = (state, bearertoken, id) => {
    instance
    .put(`${process.env.REACT_APP_DATABASEURL}exam/${id}`,{
      name: state.name.toString()
      },  {
      headers: {
        Authorization: `Bearer ${bearertoken}`,
      },
    })
    .then((response) => {

      console.log("exam here ", response.data.data)

    })

    .catch((e) => console.log(e));
  }

  deleteExam = (id) => {
    return new Promise((resolve, reject)=> {
    instance
    .delete(`${process.env.REACT_APP_DATABASEURL}exam/${id}`, {

      headers: {
        Authorization: `Bearer ${token}`,
      },

    }).then((response) => {
      console.log(resolve(response));
      resolve(response);

    }).catch((e) => {
      console.log(e);
    });
  })

  }

  fetchQuestion = (bearertoken, id) => {
    return new Promise((resolve, reject)=>{
      instance
      .get(`${process.env.REACT_APP_DATABASEURL}exam/${id}/question`, {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {

        resolve(response)
            this.setState({
              sessionData: {
                questionList: response.data.data,
              },
            });



      })

      .catch((e) => console.log(e));
    })

  };

  addQuestion = (state, bearertoken, id) => {
    instance
      .post(`${process.env.REACT_APP_DATABASEURL}exam/${id}/question`,{
        question: state.question,
        answer: state.answer,
        options: state.options,
        score: state.score
        },  {
        headers: {
          Authorization: `Bearer ${bearertoken}`,
        },
      })
      .then((response) => {

        console.log("question here ", response.data.data)

      })

      .catch((e) => console.log(e));
  }

  // check writer exam score exist
 findWriterExam = (userId,bearertoken) => {
  return new Promise((resolve, reject)=> {
  instance
  .get(`${process.env.REACT_APP_DATABASEURL}exam/user/${userId}`, {
    // {userId: userId},
    headers: {
      Authorization: `Bearer ${bearertoken}`,
    },

  }).then((response) => {
    console.log(resolve(response?.data));
    resolve(response?.data);

  }).catch((e) => {
    console.log(e);
  });
})


}

// Function to get list of library

fetchLibrary = (bearertoken) => {
  return new Promise((resolve, reject)=>{
    instance
    .get(`${process.env.REACT_APP_DATABASEURL}library`, {
      headers: {
        Authorization: `Bearer ${bearertoken}`,
      },
    })
    .then((response) => {

      resolve(response)
          this.setState({
            sessionData: {
              libraryList: response.data.data.rows
            },
          });



    })

    .catch((e) => console.log(e));
  })

};

// Function to add library

addLibrary = (state, bearertoken, selectedFiles) => {
console.log(state)
  const form = new FormData();

    form.append("title", state.title);
    form.append("description", state.description);
    form.append("file", selectedFiles);
  instance
    .post(`${process.env.REACT_APP_DATABASEURL}library`,form,  {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${bearertoken}`,
      },
    })
    .then((response) => {

      console.log("lib here ", response.data)

    })

    .catch((e) => console.log(e));
}


// Function to delete library
deleteLibrary = (id) => {
  return new Promise((resolve, reject)=> {
  instance
  .delete(`${process.env.REACT_APP_DATABASEURL}library/${id}`, {

    headers: {
      Authorization: `Bearer ${token}`,
    },

  }).then((response) => {
    console.log(resolve(response));
    resolve(response);

  }).catch((e) => {
    console.log(e);
  });
})

}

// Function to update a library
updateLibrary = (state, bearertoken, selectedFiles, id) => {
  console.log(selectedFiles)
  const form = new FormData();

    form.append("title", state.title);
    form.append("description", state.description);
    form.append("file", selectedFiles);
  instance
  .patch(`${process.env.REACT_APP_DATABASEURL}library/${id}`,form,  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${bearertoken}`,
    },
  })
  .then((response) => {

    console.log("services here ", response.data.data)

  })

  .catch((e) => console.log(e));
}

fetchProject = (bearertoken) => {
  return new Promise((resolve, reject)=> {
    instance
    .get(`${process.env.REACT_APP_DATABASEURL}project`, {
      headers: {
        Authorization: `Bearer ${bearertoken}`,
      },
    })
    .then((response) => {
      resolve(response)
        console.log(response.data.data.rows)
          this.setState({
            sessionData: {
              projectList: response.data.data.rows
            },
          });


    })

    .catch((e) => console.log(e));
  })

}

fetchWithdrawal = (bearertoken) => {
  return new Promise((resolve, reject)=> {
    instance
    .get(`${process.env.REACT_APP_DATABASEURL}withdrawal`, {
      headers: {
        Authorization: `Bearer ${bearertoken}`,
      },
    })
    .then((response) => {
      resolve(response)

          this.setState({
            sessionData: {
              withdrawalList: response.data.data.rows
            },
          });


    })

    .catch((e) => console.log(e));
  })

}

fetchSuppprt = (bearertoken) => {
  return new Promise((resolve, reject)=> {
    instance
    .get(`${process.env.REACT_APP_DATABASEURL}support`, {
      headers: {
        Authorization: `Bearer ${bearertoken}`,
      },
    })
    .then((response) => {
      resolve(response)
        console.log(response)
          this.setState({
            sessionData: {
              supportList: response.data.data.rows
            },
          });


    })

    .catch((e) => console.log(e));
  })

}

}



export { MasterContainer };



