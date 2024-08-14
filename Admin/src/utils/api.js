import axios from "axios";


export const fetchDataFromApi=async(url)=>{

try{
    const {data} = await axios.get(import.meta.env.VITE_SERVER_URL+url)
    return data;
    }
catch(error) { 
    console.log(error); 
    return error;
}
}

export const postData = async (url, formData ) => {
    const { res} = await axios.post(import.meta.env.VITE_SERVER_URL + url, formData)
    return res;
    }


export const editData = async (url, updatedData) => {
        const baseUrl = import.meta.env.VITE_SERVER_URL;
        const { res } = await axios.put(`${baseUrl}${url}`,updatedData)
        return res;
}

export const deleteData = async (url) => {
    try {
        const baseUrl = import.meta.env.VITE_SERVER_URL;
        const { data } = await axios.delete(`${baseUrl}${url}`);
        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
};



