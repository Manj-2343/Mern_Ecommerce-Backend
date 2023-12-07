import  { Router, Request, Response } from "express";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import * as addressController from "../../controllers/addressController"
import {body} from "express-validator"
import { validateForm } from "../../middlewares/validateForm";

const addressRouter: Router = Router();
/**
 * usage:Create New Address(one user one address)
 * url:http://localhost:9999/api/address/new
 * params:mobile,flat,landmark,street,city,state,country,pinCode
 * method: POST,
 * access:Private
 */
addressRouter.post("/new",[
body("mobile").not().isEmpty().withMessage("Mobile is required"),
body("flat").not().isEmpty().withMessage("Address is required"),
body("landmark").not().isEmpty().withMessage("LandMark is required"),
body("street").not().isEmpty().withMessage("Street is required"),
body("city").not().isEmpty().withMessage("City is required"),
body("state").not().isEmpty().withMessage("State is required"),
body("country").not().isEmpty().withMessage("Country is required"),
body("pinCode").not().isEmpty().withMessage("PinCode is required")
],tokenVerifier,validateForm, async (request: Request, response: Response) => {
 await addressController.createNewAddress(request, response);
});
/**
 * usage:Update Address
 * url:http://localhost:9999/api/address/:addressId
 * params:name,email,mobile,flat,landmark,street,city,state,country,pincode
 * method: PUT,
 * access:Private
 */
addressRouter.put("/:addressId",[
  body("mobile").not().isEmpty().withMessage("Mobile is required"),
  body("flat").not().isEmpty().withMessage("Address is required"),
  body("landmark").not().isEmpty().withMessage("LandMark is required"),
  body("street").not().isEmpty().withMessage("Street is required"),
  body("city").not().isEmpty().withMessage("City is required"),
  body("state").not().isEmpty().withMessage("State is required"),
  body("country").not().isEmpty().withMessage("Country is required"),
  body("pinCode").not().isEmpty().withMessage("PinCode is required")
  ],tokenVerifier,validateForm, async (request: Request, response: Response) => {
  await addressController.updateAddress(request, response);
 });
/**
 * usage:Get Address
 * url:http://localhost:9999/api/address/me
 * params:no-params
 * method: GET,
 * access:Private
 */
addressRouter.get("/me",tokenVerifier, async (request: Request, response: Response) => {
  await addressController.getAddress(request, response);
 });
 /**
 * usage:Delete Address
 * url:http://localhost:9999/api/address/:addressId
 * params:no-params
 * method: GET,
 * access:Private
 */
 addressRouter.delete("/:addressId",tokenVerifier, async (request: Request, response: Response) => {
  await addressController.deleteAddress(request, response);
 });
export default addressRouter;
