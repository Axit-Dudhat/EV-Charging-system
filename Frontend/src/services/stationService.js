import API from "../api/axios";
export const getstation=()=>{
    return API.get("/stations");
}
export const createStation=(data)=>{
    return API.post("/stations",data);
}
export const updatedStation =(id,data)=>{
    return API.put(`/stations/${id}`,data);
}
export const deleteStation=(id)=>{
    return API.delete(`/stations/${id}`);
}
