import {
    SignInUseCaseInput,
    SignInUseCaseInterface,
    SignInUseCaseOutput
} from "../interfaces/SignInUseCaseInterface.js";
import { UserRepositoryInterface } from
    "@/domain/user/repositories/UserRepositoryInterface.js";
import { EmailAddress } from "@/domain/shared/value-objects/EmailAddress.js";
import { supabase } from "@/config/supabase.js";

export class SignInUseCase implements SignInUseCaseInterface {
    constructor(
        private readonly userRepository: UserRepositoryInterface,
    ) { }

    async execute(input: SignInUseCaseInput): Promise<SignInUseCaseOutput | null> {
        const emailAddress = EmailAddress.from(input.email);

        if (!input.password.trim()) {
            throw new Error("Password is required");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: emailAddress.toString(),
            password: input.password,
        });

        if (error) {
            throw new Error(error.message)
        }

        if (!data.user || !data.session) {
            return null
        }

        const user = await this.userRepository.findByEmail(emailAddress);

        return {
            user: {
                id: user.getId().toString(),
                name: user.getName(),
                email: user.getEmail().toString(),
                phoneNumber: user.getPhoneNumber(),
            },
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        }
    }
}