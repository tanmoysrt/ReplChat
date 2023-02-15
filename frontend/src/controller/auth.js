import config from "../config.js";
import Swal from 'sweetalert2'
var axios = require('axios');


class AuthContoller{
    static async login(username, password){
        var data = JSON.stringify({
          "username": username,
          "password": password
        });
        
        var axios_config = {
          method: 'post',
          url: `${config.BACKEND_URL}/auth/login`,
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
        try {
            const data = await axios(axios_config);
            const data_json = data.data;
            if(data_json.success){
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Login Successful',
                })
                localStorage.setItem("token", data_json.token);
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500)
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data_json.error || 'Something went wrong!',
                })
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.error || 'Something went wrong!',
            })
        }
        
    }

    static async register(name, username, password){
        var data = JSON.stringify({
          "name": name,
          "username": username,
          "password": password
        });
        
        var axios_config = {
          method: 'post',
          url: `${config.BACKEND_URL}/auth/register`,
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
        try {
            const data = await axios(axios_config);
            const data_json = data.data;
            if(data_json.success){
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data_json.message,
                })
                localStorage.setItem("token", data_json.token);
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500)
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data_json.error
                })
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.error || 'Something went wrong!',
            })
        }
        
    }
}

export default AuthContoller;