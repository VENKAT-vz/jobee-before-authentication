var ErrorHandler=require('../utils/errorhandler');

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;

    if(process.env.NODE_ENV==='development'){
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errMessage:err.message,
            stack:err.stack
        });
    }

    if(process.env.NODE_ENV==='production '){
        let error={...err};
        error.message=err.message;

        //wrong mongoose object id error
        if(err.name==='CastError'){
            const message = `Resource not found. Invalid: ${err.path}`;
            error= new ErrorHandler(message,404);
        }

        //handling mongoose validation error
        if(err.name === 'ValidationError'){
            const message=Object.values(err.errors).map(value=>value.message);
            error=new ErrorHandler(message,400);
        }

        res.status(error.statusCode).json({
            success:false,
            message:error.message || 'Internal Server error'
        });
    }

    err.message=err.message || 'Internal Server error';

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}