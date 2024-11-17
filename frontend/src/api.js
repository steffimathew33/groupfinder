import axios from "axios"

const URL = "http://localhost:3000"

export async function getTests() {
    const response = await axios.get(`${URL}/testing`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function getTest(id) {
    const response = await axios.get(`${URL}/testing/${id}`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function createTests(newTest) {
    const response = await axios.post(`${URL}/testing`, newTest)

    return response
}

export async function updateTests(id, updatedTest) {
    const response = await axios.put(`${URL}/testing/${id}`, updatedTest)

    return response
}

export async function deleteTests(id) {
    const response = await axios.delete(`${URL}/testing/${id}`)

    return response //For debugging, deleting doesn't need to return any info.
}