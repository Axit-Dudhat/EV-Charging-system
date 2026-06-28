import API from '../api/axios.js'
export const registerUser=(userdata)=>{
    return API.post("api/auth/register",userdata)
}
export const loginuser=(userdata)=>{
    return API.post("api/auth/login",userdata)
}