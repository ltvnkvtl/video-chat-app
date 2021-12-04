class ApiError extends Error {
    status: number;
    errors: any;

    constructor(status: number, message: string, errors: any[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static BadRequest(message: string, errors: any[] = []): ApiError {
        return new ApiError(400, message, errors);
    }

    static UnauthorizedError(): ApiError {
        return new ApiError(401, 'User is not authorized');
    }

    static ForbiddenError(message: string): ApiError {
        return new ApiError(403, message);
    }

    static NotFoundError(message: string): ApiError {
        return new ApiError(404, message);
    }
}

export default ApiError;
