export interface CreateReviewCommentRequest {
    session_id: string;
    rating: number;
    comment: string | null;
}