import { Request, Response, NextFunction } from "express";
import { ApiError } from "../types/error";

export const errorMiddleware = (
    err: Error | ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    console.log(err);
    // Default status and message for unknown errors
    let statusCode = 500;
    let message = "An unexpected error occurred";

    // Check if the error is an instance of AppError
    if (err instanceof ApiError) {
        statusCode = err.status || 500;
        message = err.message;
    } else if (err instanceof Error) {
        // Handle generic JavaScript errors that are not AppError
        message = err.message;
        console.error("Internal Server Error:", err.stack); // Log stack trace for debugging
    } else {
        // Log unknown error types (could be string, object, etc.)
        console.error("Unknown Error:", err);
    }

    // Respond with a JSON error object
    res.status(statusCode).json({
        success: false,
        message,
    });
};
