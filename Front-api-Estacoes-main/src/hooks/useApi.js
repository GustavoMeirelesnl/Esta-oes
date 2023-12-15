import { useState } from "react";
import { API_URI } from "../utils/constants";

const useApi = (basePath = API_URI) => {
    const [load, setLoad] = useState(false);

    const get = async (url = '') => {
        setLoad(true);

        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }
         
        const response = await fetch(basePath + url, options);
        const data = await response.json();
        

        setLoad(false);
        return { data, response };
    }

    const post = async (url = '', formData = {}, file = false) => {
        setLoad(true);

        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: file ? formData : JSON.stringify(formData)
        }

        if (file) delete options.headers['Content-Type'];

        const response = await fetch(basePath + url, options);
        const data = await response.json();

        setLoad(false);
        return { data, response };
    }

    const put = async (url = '', formData = {}) => {
        setLoad(true);

        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(formData)
        }


        const response = await fetch(basePath + url, options);
        const data = await response.json();

        setLoad(false);
        return { data, response };
    }

    const remove = async (url = '', formData = {}) => {
        setLoad(true);

        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        }

        const response = await fetch(basePath + url, options);
    
        setLoad(false);
        return { response };
    }

    return { load, get, post, put, remove };
}

export default useApi;