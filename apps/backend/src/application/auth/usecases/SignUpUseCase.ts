import { UserRepositoryInterface } from "@/domain/user/repositories/UserRepositoryInterface.js";
import { SignUpUseCaseOutput, SignUpUseCaseInterface, SignUpUseCaseInput } from "../interfaces/SignUpUseCaseInterface.js";
import { EmailAddress } from "@/domain/shared/value-objects/EmailAddress.js";
import { supabase } from "@/config/supabase.js";
import { User } from "@/domain/user/entities/User.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { UserRole } from "@/domain/shared/value-objects/UserRole.js";

export class SignUpUseCase implements SignUpUseCaseInterface {
    constructor(
        private readonly userRepository: UserRepositoryInterface,
    ) { }

    async execute(input: SignUpUseCaseInput): Promise<SignUpUseCaseOutput | null> {
        const emailAddress = EmailAddress.from(input.email);

        if (!input.password.trim()) {
            throw new Error("Password is required");
        }

        const { data, error } = await supabase.auth.signUp({
            email: emailAddress.toString(),
            password: input.password,
        });

        if (error) {
            throw new Error(error.message);
        }

        if (!data.user || !data.session) {
            return null
        }

        const user = User.create({
            id: UserId.create(data.user.id),
            email: emailAddress,
            name: input.name,
            phoneNumber: input.phoneNumber,
            role: UserRole.USER,
            avatarUrl: null,
        });

        await this.userRepository.add(user);

        return {
            user: {
                id: user.getId().toString(),
                name: user.getName(),
                email: user.getEmail().toString(),
                phoneNumber: user.getPhoneNumber(),
            },
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        };
    }
}