import { ReviewDetails } from "./GetReviewDataQueryInterface.js";

export interface FindReviewByIdUseCaseInterface {
    execute(id: string): Promise<ReviewDetails>;
}