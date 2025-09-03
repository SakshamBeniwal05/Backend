const asyncHandler = (fun) => {
    return async (req, res, next) => {
        try {
            await fun(req, res, next)
        } catch (error) {
            res.status(error.code || 500).json({ success: false, message: error.message })
            next(error)
        }
    }
}
export default asyncHandler