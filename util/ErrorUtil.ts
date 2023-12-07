import { APP_CONSTANTS } from "../constants";
import { Response } from "express";

export const ThrowError = (response: Response, statusCode?: number, msg?: string, error?: any) => {
  console.error("Error:", error); // Log the error for debugging

  // Check if response is already sent
  if (response.headersSent) {
    console.error("Response already sent, skipping error response");
    return;
  }

  // Send an appropriate error response to the client
  return response.status(statusCode || 500).json({
    status: APP_CONSTANTS.FAILED,
    msg: msg || "Internal Server Error",
    data: null,
  });
};
