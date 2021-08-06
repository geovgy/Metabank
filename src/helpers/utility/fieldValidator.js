import { EMAIL_REGEX } from './regexes';

export const validateEmailAddress = (email) => {
  return EMAIL_REGEX.test(email);
};

export const validateString = (rule, value, callback) => {
  if (/[^a-zA-Z]/.test(value)) {
    callback('Must be a character!');
  }
  callback();
};

export const validateWholeNumber = (rule, value, callback) => {
  if (!/^[0-9+]+$/.test(value)) {
    callback('Must be a whole numbers!');
  }
  callback();
};

export const validateWholeOrDecimalNumber = (rule, value, callback) => {
  if (!/^[+-]?\d+(\.\d+)?$/.test(value)) {
    callback('Must be whole or decimal numbers!');
  }
  callback();
};