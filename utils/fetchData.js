
export const getData = async (url,token) => {
    const res = await fetch(`http://localhost:3000http://localhost:3000/${url}`,{
    method: 'GET',
    headers:{
        'Content-Type': 'aplication/json',
        'Authorization':token
    }
})
    const data = await res.json()
    return data
}

export const postData = async (url,post,token) => {
    const res = await fetch(`http://localhost:3000http://localhost:3000/${url}`,{
    method: 'POST',
    headers:{
        'Content-Type': 'aplication/json',
        'Authorization':token
    },
    body:JSON.stringify(post)
})
    const data = await res.json()

    return data
}

export const putData = async (url,post,token) => {
    const res = await fetch(`http://localhost:3000http://localhost:3000/${url}`,{
    method: 'PUT',
    headers:{
        'Content-Type': 'aplication/json',
        'Authorization':token
    },
    body:JSON.stringify(post)
})
    const data = await res.json()
    return JSON.stringify(data)
}

export const patchData = async (url,post,token) => {
    const res = await fetch(`http://localhost:3000http://localhost:3000/${url}`,{
    method: 'PATCH',
    headers:{
        'Content-Type': 'aplication/json',
        'Authorization':token
    },
    body:JSON.stringify(post)
})
    const data = await res.json()
    return data
}

export const deleteData = async (url,token) => {
    const res = await fetch(`http://localhost:3000http://localhost:3000/${url}`,{
    method: 'DELETE',
    headers:{
        'Content-Type': 'aplication/json',
        'Authorization':token
    },
    body:JSON.stringify(post)
})
    const data = await res.json()
    return data
}