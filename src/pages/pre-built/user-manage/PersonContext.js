import React, { useState, createContext, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import axios from "axios";



const BASE_URL = "https://tiosone.com/customers/api/"

export const PersonContext = createContext();


export const PersonContextProvider = (props) => {
  let { userId } = useParams();
  const [data, setData] = useState();
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');


    if (!refreshToken) {
      console.error('No refresh token found in local storage.');
      return null;
    }

    try {
      const response = await axios.post("https://tiosone.com/api/token/refresh/", {
        refresh: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const newAccessToken = response.data.access;
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Refresh token is invalid or expired. User needs to re-login.");
        window.location.href = '/auth-login';
      } else {
        console.error("Error refreshing access token", error);
      }
      return null;
    }
  };
  const getAllUsers = async () => {
    let accessToken = localStorage.getItem('accessToken');


    try {
      const response = await axios.get(BASE_URL + "persons/", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {

        accessToken = await refreshAccessToken();
        if (accessToken) {

          try {
            const response = await axios.get(BASE_URL + "persons/", {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setData(response.data);

          } catch (retryError) {
            console.error("Retry error after refreshing token", retryError);
          }
        }
      } else {
        console.error("There was an error fetching the data!", error);
      }
    }
  };
  useEffect(() => {
    getAllUsers()

  }, [userId])



  return <PersonContext.Provider value={{ contextData: [data, setData] }}> <Outlet /> </PersonContext.Provider>
};
