// Used for consistent success & error handling
class ResponseFormatter{

    // Success Response
    static success(data=null, message='success', statusCode=200) {
        return {
            success: true,
            message,
            data,
            statusCode,                             // HTTP status code
            timestamp: new Date().toISOString(),    // Response time (ISO format)
        }
    }

    // Error Response
    static error(message='Internal Server Error', statusCode=500, error=null) {
        return {
            success: false,
            message,
            statusCode,
            error,
            timestamp: new Date().toISOString(),
        }
    }

    // Validation Error Response
    static validationError(error=null) {
        return {
            success: false,
            error,
            message: "Validation Failed",
            statusCode: 400,
            timestamp: new Date().toISOString(),
        }
    }

    // Paginated Response
    static paginated(data=null, page, limit, total) {
        return {
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            timestamp: new Date().toISOString(),
        }
    }

}


export default ResponseFormatter;