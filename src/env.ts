export const config = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    API_TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
    COURSES: '/courses',
    USERS: '/users',
    REVIEWS: '/reviews',
    AUTH: '/auth',
    GET_COURSE_LIST: '/courses',
    GET_COURSE_BY_ID: '/courses',
    GET_COURSE_SECTION_AND_CONTENT: '/courses',
    CHECK_USER_REVIEW: '/reviews/check',
    CREATE_REVIEW: '/reviews',
    GET_COURSE_REVIEW_OVERVIEW: '/reviews/overview',
};
