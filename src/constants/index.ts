export const API_ENDPOINTS = {
  // Auth API
  SIGN_IN: '/api/v1/auth/sign-in',
  SIGN_OUT: '/api/v1/auth/sign-out',
  GOOGLE_AUTH_URL: '/api/v1/auth/google/url',
  GOOGLE_CALLBACK: '/api/v1/auth/google/callback',
  FACEBOOK_AUTH_URL: '/api/v1/auth/facebook/url',
  FACEBOOK_CALLBACK: '/api/v1/auth/facebook/callback',

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
  GET_FINALIZING_SESSIONS: '/api/v1/sessions/finalizing',

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
  SEGMENT_AUDIO: 'segment_audio',
  INTERVIEWER_AUDIO_CHUNKING: 'interviewer_audio_chunking',
  USER_FULL_TRANSCRIPT: 'user_full_transcript',
  INTERVIEWER_RESPONSE: 'interviewer_response',
  CONVERSATION_STARTED: "conversation_started",
  CONVERSATION_STARTING: "conversation_starting",
  INTERVIEWER_TURN_START: "interviewer_turn_start",
  INTERVIEWER_TURN_END: "interviewer_turn_end",
  END_INTERVIEW_SESSION: "end_interview_session",
  SUMMARIZE_INTERVIEW_SESSION: "summarize_interview_session",
  INTERVIEW_SESSION_TIMED_OUT: "interview_session_timed_out",
  INACTIVITY_WARNING: "inactivity_warning",
  ACTIVITY_TIMER_RESET: "activity_timer_reset",
  INTERVIEW_SESSION_ALREADY_TIMED_OUT: "interview_session_already_timed_out",
  INTERVIEW_SESSION_ALREADY_COMPLETED: "interview_session_already_completed",
  INTERVIEW_COMPLETED: "interview_completed",
  USER_COMPLETE_SESSION: "user_complete_session",
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

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  X_ACCESS_TOKEN: 'X-Access-Token',
  X_ACCESS_TOKEN_LOWER: 'x-access-token',
} as const;

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
} as const;

export const ROUTES = {
  SIGN_IN: '/',
  RECORDINGS: '/recordings',
  INTERVIEW: '/interview',
} as const;

export const RATING = {
  MAX_STARS: 5,
  MIN_STARS: 1,
  DEFAULT_SIZE: 24,
  SMALL_SIZE: 20,
  LARGE_SIZE: 25,
} as const;

export const REVIEW = {
  MIN_DESCRIPTION_LENGTH: 50,
  DEFAULT_RATING: 0,
} as const;

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

export const COLORS = {
  GOLD: 'gold',
  GRAY: 'gray',
} as const;

export const EVENTS = {
  SHOW_SPINNER: 'show_spinner',
  HIDE_SPINNER: 'hide_spinner',
  SHOW_SIGN_OUT_POPUP: 'show_sign_out_popup',
  HIDE_SIGN_OUT_POPUP: 'hide_sign_out_popup',
} as const;

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

export const INTERVIEW_STAGES = [
  { 
    key: 'greeting', 
    label: 'Greeting', 
    description: 'Initial rapport building, ice-breaker questions, and making you comfortable. This is a warm-up phase to establish a friendly conversation.',
    isMandatory: true
  },
  { 
    key: 'introduction', 
    label: 'Introduction', 
    description: 'Tell me about yourself, your background, career journey, and what brings you to this role. A chance to present your professional story.',
    isMandatory: true
  },
  { 
    key: 'experience', 
    label: 'Experience', 
    description: 'Deep dive into your work history, key accomplishments, roles and responsibilities, and lessons learned from previous positions.',
    isMandatory: false
  },
  { 
    key: 'project', 
    label: 'Project', 
    description: 'Discussion about specific projects you\'ve worked on, your contributions, challenges faced, and outcomes achieved. Technical and non-technical details.',
    isMandatory: false
  },
  { 
    key: 'technical', 
    label: 'Technical', 
    description: 'Assessment of technical skills, problem-solving abilities, coding challenges, system design, algorithms, and domain-specific knowledge.',
    isMandatory: false
  },
  { 
    key: 'behavioral', 
    label: 'Behavioral', 
    description: 'Situational questions about teamwork, conflict resolution, leadership, time management, and how you handle various workplace scenarios.',
    isMandatory: false
  },
] as const;