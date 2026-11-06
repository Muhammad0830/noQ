import { CheckEmailExistsUseCaseInterface } from "@/application/auth/interfaces/CheckEmailExistsUseCaseInterface.js";
import { RequestHandler } from "express";
import { CheckEmailExistsSchema } from "../validators/auth/CheckEmailExistsSchema.js";
import { RequestWithUser } from "@/types.js";
import { FindUserUseCaseInterface } from "@/application/auth/interfaces/FindUserUseCaseInterface.js";

export class AuthController {
    constructor(
        private readonly checkEmailExistsUseCase: CheckEmailExistsUseCaseInterface,
        private readonly findUserUseCase: FindUserUseCaseInterface,
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
            const id = (req as RequestWithUser).user.id;

            const userData = await this.findUserUseCase.execute(id);

            res.status(200).json(userData);
        } catch (error) {
            next(error);
        }
    }
}