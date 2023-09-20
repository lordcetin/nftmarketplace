import React from 'react'
import {useContext} from 'react'
import {DataContext} from '../store/GlobalState'
import Loading from './Loading'
import Toast from './Toast'

const Notify = () => {

    const {state, dispatch} = useContext(DataContext)
    const { notify } = state

    return(
        <>
            {notify.loading && <Loading/>}
            {notify.error && 
                <Toast 
                msg={{msg:notify.error, title:"Error"}} 
                handleShow={() => dispatch({type:'NOTIFY',payload:{}})} 
                bgColor="border-b-2 border-red-600" />
            }
            {notify.success && 
                <Toast 
                msg={{msg:notify.success, title:"Success"}} 
                handleShow={() => dispatch({type:'NOTIFY',payload:{}})} 
                bgColor="border-b-2 border-green-600" />
            }
        </>    
    )
}

export default Notify