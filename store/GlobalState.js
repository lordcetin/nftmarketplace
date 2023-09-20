import React from 'react'
import {createContext,useReducer,useEffect} from 'react'
import reducers from './Reducers'
import {getData} from '../utils/fetchData'

export const DataContext = createContext()

export const DataProvider = ({children}) => {
    const initialState = { 
        notify: {}, auth: {}, cart: [], modal: [], orders: [], users: [], categories: []
    }

    const [state, dispatch] = useReducer(reducers, initialState)
    const { cart, auth } = state

    useEffect(() => {
        const firstLogin = localStorage.getItem("firstLogin");
        if(firstLogin){
            getData('accessToken').then(res => {
                if(res.err) return localStorage.removeItem("firstLogin")
                dispatch({ 
                    type: "AUTH",
                    payload: {
                        token: res.access_token,
                        user: res.user
                    }
                })
            })
        }
    }, []);
    

    return(
        <DataContext.Provider value={{state,dispatch}}>
            {children}
        </DataContext.Provider>    
    )
}