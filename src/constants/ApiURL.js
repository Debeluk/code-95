const isProd = false;

export const BACKEND_URL = isProd ? import.meta.env.VITE_BACKEND_URL : 'https://code-95-backend-buyxux5ycq-lm.a.run.app';

const API = '/api';

const V1 = '/v1';

const AUTH = '/auth';

const USER = '/user';

const COURSE = '/course';

export const LOGIN = `${BACKEND_URL}${API}${V1}${AUTH}/login`;
export const REFRESH = `${BACKEND_URL}${API}${V1}${AUTH}/refresh`;
export const CREATE_GET_USER = `${BACKEND_URL}${API}${V1}/user`; //GET TO GET ALL USERS, POST TO CREATE USER
export const GET_CURRENT_USER = `${BACKEND_URL}${API}${V1}${USER}/current`; //USER INFO CURRENT
export const USER_USE = `${BACKEND_URL}${API}${V1}${USER}/{user_id}`; //GET TO GET USER INFO BY ID, PUT TO UPDATE USER BY ID, DELETE TO DELETE USER BY ID
export const CREATE_COURSE = `${BACKEND_URL}${API}${V1}${COURSE}`;
export const DELETE_COURSE = `${BACKEND_URL}${API}${V1}${COURSE}/{course_id}`;
export const GET_COURSE = `${BACKEND_URL}${API}${V1}${COURSE}/available`;
export const GET_TICKET_QUESTIONS = (course_id, ticket_id) =>
  `${BACKEND_URL}${API}${V1}${COURSE}/${course_id}/ticket/${ticket_id}`; //GET 'TOTAL / 10' QUESTIONS BASED ON TICKET NUMBER OF COURSE
export const GET_RANDOM_TICKET_QUESTIONS = (course_id) =>
  `${BACKEND_URL}${API}${V1}${COURSE}/${course_id}/random`; //GET 'TOTAL / 10' QUESTIONS BASED ON TICKET NUMBER OF COURSE
export const GET_RANDOM = `${BACKEND_URL}${API}${V1}${COURSE}/{course_id}/random`; //GET 25 RANDOM QUESTIONS FROM ONE COURSE
export const WEB_SOCKET = `${BACKEND_URL.replace('http', 'ws')}${API}${V1}${AUTH}/ws`;

export const WEB_SOCKET_CONNECTION = (accessToken, refreshToken) =>
  `${WEB_SOCKET}?token=${accessToken}&refresh_token=${refreshToken}`;
