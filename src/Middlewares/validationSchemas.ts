import type{ Request, Response, NextFunction } from "express";
import * as httpStatus from "../Utils/HttpStatusText.ts";
import validator from "validator";
import { AppError } from "../Utils/AppError.ts";

// Schemas for express-validator
export const createPostSchema = {
    post: {
        isString: {
            errorMessage: "post must be string!"
        },
        notEmpty: {
            errorMessage: "you need to write a post"
        },
        isLength: {
            options: { min: 5, max: 300 },
            errorMessage: "the length from 5-300 characters"
        }
    },
    isAnonymous: {
        isBoolean: {
            errorMessage: "isAnonymous must be true or false"
        }
    }
};
export const createCommentSchema = {
    post : {
        notEmpty : {
             errorMessage: "need the post id"
        }
    },
    content: {
        isString: {
            errorMessage: "post must be string!"
        },
        notEmpty: {
            errorMessage: "you need to write a post"
        },
        isLength: {
            options: { min: 5, max: 300 },
            errorMessage: "the length from 5-300 characters"
        }
    },
    isAnonymous: {
        isBoolean: {
            errorMessage: "isAnonymous must be true or false"
        }
    }
};

export const postQuerySchema = {
    writer: {
        notEmpty: {
            errorMessage: 'you need to enter a "first name"'
        },
        isString: {
            errorMessage: "writer must be string!"
        },
        isLength: {
            options: { min: 5, max: 32 },
            errorMessage: "you must enter a writer from 5 to 32 chars"
        }
    },
    limit: {
        optional: true,
        isInt: {
            options: { min: 1, max: 20 },
            errorMessage: "limit from 1 post to 20"
        }
    },
    page: {
        optional: true,
        isInt: {
            options: { min: 1, max: 20 },
            errorMessage: "start from 1"
        }
    }
};

export const addUserSchema = {
    "name.first": {
        trim: true,
        notEmpty: { 
            errorMessage: "First name is required" 
        },
        isString: { 
            errorMessage: "First name must be a string" 
        },
        isLength: { 
            options: { min: 2, max: 50 }, 
            errorMessage: "First name must be between 2 and 50 characters" 
        },
        matches: {
            options: /^[a-zA-Z\s'-]+$/,
            errorMessage: "First name can only contain letters, spaces, hyphens, and apostrophes"
        }
    },
    "name.last": {
        trim: true,
        notEmpty: { 
            errorMessage: "Last name is required" 
        },
        isString: { 
            errorMessage: "Last name must be a string" 
        },
        isLength: { 
            options: { min: 2, max: 50 }, 
            errorMessage: "Last name must be between 2 and 50 characters" 
        },
        matches: {
            options: /^[a-zA-Z\s'-]+$/,
            errorMessage: "Last name can only contain letters, spaces, hyphens, and apostrophes"
        }
    },
    userName: {
        trim: true,
        notEmpty: { 
            errorMessage: "Username is required" 
        },
        isString: { 
            errorMessage: "Username must be a string" 
        },
        isLength: { 
            options: { min: 3, max: 30 }, 
            errorMessage: "Username must be between 3 and 30 characters" 
        },
        matches: {
            options: /^[a-zA-Z0-9_]+$/,
            errorMessage: "Username can only contain letters, numbers, and underscores"
        },
        custom: {
            options: (value: string) => {
                if (!value || typeof value !== 'string') {
                    throw new Error("Username is required");
                }
                if (value.startsWith('_') || value.endsWith('_')) {
                    throw new Error("Username cannot start or end with an underscore");
                }
                return true;
            }
        }
    },
    dateOfBirth: {
        notEmpty: { 
            errorMessage: "Date of birth is required" 
        },
        isDate: { 
            options: { format: "DD-MM-YYYY", strictMode: true }, 
            errorMessage: "Date must be in DD-MM-YYYY format (e.g., 25-12-1990)" 
        },
        custom: {
            options: (value: string) => {
                if (!value || typeof value !== 'string') {
                    throw new Error("Date of birth is required");
                }
                const parts = value.split("-");
                if (parts.length !== 3) {
                    throw new Error("Date must be in DD-MM-YYYY format");
                }
                const [day, month, year] = parts;
                if (!day || !month || !year) {
                    throw new Error("Invalid date format");
                }
                const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
                const today = new Date();
                
                // Check if date is valid
                if (isNaN(date.getTime())) {
                    throw new Error("Invalid date");
                }
                
                const age = today.getFullYear() - date.getFullYear();
                const monthDiff = today.getMonth() - date.getMonth();
                
                if (date > today) {
                    throw new Error("Date of birth cannot be in the future");
                }
                if (age < 13 || (age === 13 && monthDiff < 0)) {
                    throw new Error("You must be at least 13 years old");
                }
                if (age > 120) {
                    throw new Error("Please enter a valid date of birth");
                }
                return true;
            }
        }
    },
    gender: {
        isBoolean: { 
            errorMessage: "Gender must be a boolean value (true for female, false for male)" 
        },
        notEmpty: { 
            errorMessage: "Gender is required" 
        }
    },
    phoneNumber: {
        trim: true,
        notEmpty: { 
            errorMessage: "Phone number is required" 
        },
        isString: { 
            errorMessage: "Phone number must be a string" 
        },
        isLength: { 
            options: { min: 10, max: 20 }, 
            errorMessage: "Phone number must be between 10 and 20 characters" 
        },
        custom: {
            options: (value: string) => {
                if (!value || typeof value !== 'string') {
                    throw new Error("Phone number is required");
                }
                // Remove common phone number formatting characters for validation
                const cleaned = value.replace(/[\s\-\(\)\+]/g, '');
                if (!validator.isMobilePhone(cleaned, 'any', { strictMode: false })) {
                    throw new Error("Please enter a valid phone number");
                }
                return true;
            }
        }
    },
    email: {
        trim: true,
        notEmpty: { 
            errorMessage: "Email is required" 
        },
        isEmail: { 
            errorMessage: "Please enter a valid email address" 
        },
        isLength: { 
            options: { max: 254 }, 
            errorMessage: "Email address is too long (maximum 254 characters)" 
        },
        custom: {
            options: (value: string) => {
                if (!value || typeof value !== 'string') {
                    throw new Error("Email is required");
                }
                if (!validator.isEmail(value)) {
                    throw new Error("Please enter a valid email address");
                }
                // Check for disposable email domains (optional - you can add more)
                const disposableDomains = ['tempmail.com', 'throwaway.email'];
                const emailParts = value.split('@');
                if (emailParts.length === 2) {
                    const domain = emailParts[1]?.toLowerCase();
                    if (domain && disposableDomains.includes(domain)) {
                        throw new Error("Disposable email addresses are not allowed");
                    }
                }
                return true;
            }
        }
    },
    password: {
        notEmpty: { 
            errorMessage: "Password is required" 
        },
        isString: { 
            errorMessage: "Password must be a string" 
        },
        isLength: { 
            options: { min: 8, max: 128 }, 
            errorMessage: "Password must be between 8 and 128 characters" 
        },
        matches: {
            options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            errorMessage: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        },
        custom: {
            options: (value: string) => {
                if (!value || typeof value !== 'string') {
                    throw new Error("Password is required");
                }
                // Check for common weak passwords
                const commonPasswords = ['password', '12345678', 'qwerty', 'abc123'];
                if (commonPasswords.some(pwd => value.toLowerCase().includes(pwd.toLowerCase()))) {
                    throw new Error("Password is too common. Please choose a stronger password");
                }
                // Check for repeated characters
                if (/(.)\1{3,}/.test(value)) {
                    throw new Error("Password cannot contain more than 3 repeated characters in a row");
                }
                return true;
            }
        }
    }
};

export const loginUserSchema = {
    email: {
        isEmail: { errorMessage: "you need to enter Email format !" },
        notEmpty: { errorMessage: "you need to enter an Email !" },
        isLength: { options: { min: 5, max: 32 }, errorMessage: "email must be from 5 to 32 chars" }
    },
    password: {
        isString: { errorMessage: "password must be string!" },
        notEmpty: { errorMessage: "you need to enter a password !" },
        isLength: { options: { min: 5, max: 32 }, errorMessage: "password must be from 5 to 32 chars" }
    }
};

export const verifyEmailSchema = {
    email: {
        notEmpty: { errorMessage: "Email is required" },
        isEmail: { errorMessage: "Please enter a valid email address" }
    }
};

export const confirmEmailSchema = {
    token: {
        notEmpty: { errorMessage: "Verification token is required" },
        isString: { errorMessage: "Token must be a string" }
    }
};
