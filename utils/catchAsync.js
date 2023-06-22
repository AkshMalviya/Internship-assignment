const catchAsync = funct => {
    return ( req, res, next ) =>{
        funct ( req, res, next ).catch(next)
    }
}
export default catchAsync