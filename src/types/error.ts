export class ApiError extends Error {
    public status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class BadRequestError extends ApiError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}
