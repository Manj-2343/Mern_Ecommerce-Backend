import { Request, Response, NextFunction } from "express";
import  Jwt  from "jsonwebtoken";
import { APP_CONSTANTS } from "../constants";



export const tokenVerifier = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // Read the token from the request headers
    const secretKey: string | undefined = process.env.EXPRESS_APP_JWT_SECRET_KEY;
    if (!secretKey) {
      return response.status(500).json({
        status: APP_CONSTANTS.FAILED,
        data: null,
        error: "JWT secret key not configured",
      });
    }

    // Check if a token is provided in the request headers
    const token: string | string[] | undefined = request.headers["x-auth-token"];
    if (!token) {
      return response.status(401).json({
        status: APP_CONSTANTS.FAILED,
        data: null,
        error: "No Token Provided",
      });
    }

    // Verify and decode the token
    if (typeof token === "string") {
      const decodeObj: any = Jwt.verify(token, secretKey) ;
      if (decodeObj) {
        // Attach the decoded user information to the request headers
        request.headers["user"] = decodeObj;
        next();//passing an actual URL
      } else {
        return response.status(401).json({
          status: APP_CONSTANTS.FAILED,
          data: null,
          error: "Unauthorized, Invalid token",
        });
      }
    } else {
      return response.status(401).json({
        status: APP_CONSTANTS.FAILED,
        data: null,
        error: "Unrecognized token format",
      });
    }
  } catch (error: any) {
    // Handle any unexpected errors
    return response.status(500).json({
      status: APP_CONSTANTS.FAILED,
      data: null,
      error: error.message,
    });
  }
};
