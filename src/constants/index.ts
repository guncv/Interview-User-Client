// API Constants
export const API_ENDPOINTS = {
  // Auth API
  SIGN_UP: '/api/v1/auth/sign-up',
  SIGN_IN: '/api/v1/auth/sign-in',
  VERIFY_EMAIL: '/api/v1/auth/verify-email',
  RESET_VERIFY_EMAIL: '/api/v1/auth/reset-verify-email',
  RESET_PASSWORD: '/api/v1/auth/reset-password',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  SIGN_OUT: '/api/v1/auth/sign-out',
  REFRESH_TOKEN: '/api/v1/auth/refresh-token',

  // Resume API
  LIST_RESUME: '/api/v1/resumes/list',
  GET_RESUME_BY_ID: '/api/v1/resumes',
  DOWNLOAD_RESUME_BY_RESUME_ID: '/api/v1/resumes/download',

  // Interview API
  CREATE_SESSION_WITH_NEW_RESUME: '/api/v1/sessions',
  CREATE_SESSION_WITH_EXISTING_RESUME: '/api/v1/sessions/existing',
  GET_CHAT_HISTORY_BY_SESSION_TOKEN: '/api/v1/sessions/chat-history',
  LIST_INTERVIEW_SESSIONS_CURSOR: '/api/v1/sessions/cursor',
  LIST_INTERVIEW_SESSIONS_PAGE: '/api/v1/sessions/jump',
  DELETE_INTERVIEW_SESSION_BY_ID: '/api/v1/sessions',
  GET_INTERVIEW_SESSION_BY_ID: '/api/v1/sessions',
  GET_CHAT_HISTORY_BY_SESSION_ID_WITH_EVALUATION: '/api/v1/sessions',

  // Evaluation API
  LIST_ALL_RUBRICS_AND_CRITERIA: '/api/v1/evaluation/rubrics',
  GET_PHRASE_EVALUATIONS_WITH_CRITERIA_BY_SESSION_ID: '/api/v1/evaluation/phrase-evaluations',

  // Issue Report API
  LIST_ISSUE_REPORTS: '/api/v1/issue-reports',
  CREATE_ISSUE_REPORT: '/api/v1/issue-reports',
  UPDATE_ISSUE_REPORT: '/api/v1/issue-reports',
  LIST_ISSUE_CATEGORIES: '/api/v1/issue-categories',

  // Review Comment API
  CREATE_REVIEW_COMMENT: '/api/v1/review-comments',
} as const;

export const CURSOR_TYPE = {
  PREV: 'prev',
  NEXT: 'next',
} as const;

export const WEBSOCKET_TYPES = {
  CONNECTION_ESTABLISHED: 'connection_established',
  SEGMENT_START: 'segment_start',
  SEGMENT_END: 'segment_end',
  INTERVIEWER_AUDIO_CHUNKING: 'interviewer_audio_chunking',
  USER_FULL_TRANSCRIPT: 'user_full_transcript',
  INTERVIWER_RESPONSE: 'interviewer_response',
  CONVERSATION_STARTED: "conversation_started",
  INTERVIEWER_TURN_START: "interviewer_turn_start",
  INTERVIEWER_TURN_END: "interviewer_turn_end",
  END_INTERVIEW_SESSION: "end_interview_session",
  SUMMARIZE_INTERVIEW_SESSION: "summarize_interview_session",
} as const;

export const ACTOR = {
  USER: 'user',
  INTERVIEWER: 'interviewer',
} as const;

export const CONVERSATION_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
} as const;

export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer',
  ROLE: 'X-Active-Role',
  WITH_CREDENTIALS: true,
} as const;

export const CONTENT_TYPES = {
  MULTIPART_FORM_DATA: 'multipart/form-data',
  APPLICATION_JSON: 'application/json',
} as const;

export const ROLE = {
  TRAINEE: 'trainee',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
} as const;

// Navigation Routes
export const ROUTES = {
  SIGN_IN: '/',
  VERIFY_EMAIL: '/verify-email',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  RESET_PASSWORD_SUCCESS: '/reset-password-success',
  RECORDINGS: '/recordings',
  INTERVIEW: '/interview',
} as const;

// Rating Constants
export const RATING = {
  MAX_STARS: 5,
  MIN_STARS: 1,
  DEFAULT_SIZE: 24,
  SMALL_SIZE: 20,
  LARGE_SIZE: 25,
} as const;

// Review Constants
export const REVIEW = {
  MIN_DESCRIPTION_LENGTH: 50,
  DEFAULT_RATING: 0,
} as const;

// UI Constants
export const UI = {
  BORDER_RADIUS: {
    SMALL: '4px',
    MEDIUM: '10px',
    LARGE: '12px',
  },
  GAP: {
    SMALL: '5px',
    MEDIUM: '10px',
    LARGE: '15px',
    XLARGE: '20px',
    XXLARGE: '30px',
  },
  PADDING: {
    SMALL: '10px',
    MEDIUM: '20px',
  },
  MARGIN: {
    SMALL: '5px',
    MEDIUM: '10px',
    LARGE: '20px',
  },
  WIDTH: {
    BUTTON: '150px',
    TEXTAREA: '60%',
  },
  HEIGHT: {
    BUTTON: '40px',
    PROGRESS_BAR: '8px',
  },
} as const;

// Colors
export const COLORS = {
  GOLD: 'gold',
  GRAY: 'gray',
} as const;

// Event Names
export const EVENTS = {
  SHOW_SPINNER: 'show_spinner',
  HIDE_SPINNER: 'hide_spinner',
  SHOW_SIGN_OUT_POPUP: 'show_sign_out_popup',
  HIDE_SIGN_OUT_POPUP: 'hide_sign_out_popup',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNEXPECTED_ERROR: 'Unexpected error',
} as const;

export const ERROR_CODES = {
  AUTH_INVALID_TOKEN: 'ONX0200',
  AUTH_EXPIRED_TOKEN: 'ONX0201',
  AUTH_INVALID_ACCESS_TOKEN: 'ONX0202',
  AUTH_EXPIRED_ACCESS_TOKEN: 'ONX0203',
  AUTH_INVALID_REFRESH_TOKEN: 'ONX0204',
  AUTH_EXPIRED_REFRESH_TOKEN: 'ONX0205',
} as const;

export const AUDIO_LEVEL = {
  MIN_AUDIO_LEVEL: 0.05,
  MIN_AUDIO_LEVEL_FOR_SHOW_USER_WAVE: 0.3,
} as const;