import { CheckEmailExistsUseCaseInterface } from "@/application/auth/interfaces/CheckEmailExistsUseCaseInterface.js";
import { RequestHandler } from "express";
import { CheckEmailExistsSchema } from "../validators/auth/CheckEmailExistsSchema.js";
import { FindUserUseCaseInterface } from "@/application/auth/interfaces/FindUserUseCaseInterface.js";
import { SignUpUseCaseInterface } from "@/application/auth/interfaces/SignUpUseCaseInterface.js";
import { SignUpSchema } from "../validators/auth/SignUpSchema.js";
import { SignInUseCaseInterface } from "@/application/auth/interfaces/SignInUseCaseInterface.js";
import { SignInSchema } from "../validators/auth/SignInSchema.js";
import { validateUser } from "../utils/ValidateUser.js";

export class AuthController {
    constructor(
        private readonly checkEmailExistsUseCase: CheckEmailExistsUseCaseInterface,
        private readonly findUserUseCase: FindUserUseCaseInterface,
        private readonly signUpUseCase: SignUpUseCaseInterface,
        private readonly signInUseCase: SignInUseCaseInterface,
    ) { }

    checkEmail: RequestHandler = async (req, res, next) => {
        try {
            const { email } = res.locals.validatedQuery as CheckEmailExistsSchema;

            const exists = await this.checkEmailExistsUseCase.execute(email);

            res.status(200).json({ exists });
        } catch (error) {
            next(error);
        }
    }

    getUser: RequestHandler = async (req, res, next) => {
        try {
            const user = validateUser(req);

            const userData = await this.findUserUseCase.execute(user.id);

            res.status(200).json(userData);
        } catch (error) {
            next(error);
        }
    }

    signUp: RequestHandler = async (req, res, next) => {
        try {
            const {
                name,
                email,
                phoneNumber,
                password
            } = req.body as SignUpSchema;

            const output = await this.signUpUseCase.execute({
                name: name,
                email: email,
                password: password,
                phoneNumber: phoneNumber ?? null,
            });

            if (!output) {
                return res.status(400).json({
                    success: false,
                    message: "Sign up failed",
                });
            }

            res.status(201).json({
                success: true,
                message: "Signed up successfully",
                data: output,
            });
        } catch (error) {
            next(error);
        }
    }

    signin: RequestHandler = async (req, res, next) => {
        try {
            const { email, password } = req.body as SignInSchema;

            const output = await this.signInUseCase.execute({
                email,
                password
            });

            if (!output) {
                res.status(400).json({
                    success: false,
                    message: "Sign in failed",
                });
            }

            res.status(201).json({
                success: true,
                message: "Signed in successfully",
                data: output
            });
        } catch (error) {
            next(error);
        }
    }
}