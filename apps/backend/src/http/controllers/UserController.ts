import { UpdateUserUseCaseInterface } from "@/application/user/interfaces/UpdateUserUseCaseInterface.js";
import { RequestHandler } from "express";
import { validateUser } from "../utils/ValidateUser.js";
import { UpdateUserSchema } from "../validators/user/UpdateUserSchema.js";
import { UpdateUserAvatarUseCaseInterface } from "@/application/user/interfaces/UpdateUserAvatarUseCaseInterface.js";
import { GetBySearchUseCaseInterface } from "@/application/user/interfaces/GetBySearchUseCaseInterface.js";
import { GetBySearchSchema } from "../validators/user/GetBySearchSchema.js";

export class UserController {
    constructor(
        private readonly updateUserUseCase: UpdateUserUseCaseInterface,
        private readonly updateUserAvatarUseCase: UpdateUserAvatarUseCaseInterface,
        private readonly getBySearchUseCase: GetBySearchUseCaseInterface,
    ) { }

    getBySearch: RequestHandler = async (req, res, next) => {
        try {
            const { search } = res.locals.validatedQuery as GetBySearchSchema;

            const output = await this.getBySearchUseCase.execute(search);

            res.status(200).json({
                data: output.userList,
            });
        } catch (error) {
            next(error);
        }
    }

    updateDetails: RequestHandler = async (req, res, next) => {
        try {
            const user = validateUser(req);

            const { id, name, phoneNumber } = req.body as UpdateUserSchema;

            if (id !== user.id) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                });
            }

            await this.updateUserUseCase.execute({
                id: id,
                name: name,
                phoneNumber: phoneNumber ?? null
            });

            res.status(201).json({
                success: true,
                message: "User updated successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    updateAvatar: RequestHandler = async (req, res, next) => {
        try {
            const user = validateUser(req);
            const file = req.file;

            const { id } = req.body;

            if (id !== user.id) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                });
            }

            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: "File is required",
                });
            }

            const avatarUrl = await this.updateUserAvatarUseCase.execute({
                id,
                file,
            });

            res.status(201).json({
                success: true,
                message: "User Avatar updated successfully",
                data: avatarUrl,
            });
        } catch (error) {
            next(error);
        }
    }
}