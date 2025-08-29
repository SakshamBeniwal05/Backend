class apiResponse {
    constructor (statuscode,data,message="succesful api"){
        this.statuscode = statuscode,
        this.data = data,
        this.message = message
    }
}

export default apiResponse