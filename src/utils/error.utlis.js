class apiError extends Error{
    constructor(stauscode,message="something went wrong",error=[],stack=""){
        super(message),
        this.stauscode = stauscode,
        this.error = error

        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export default apiError