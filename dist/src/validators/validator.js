"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateEmail = exports.ValidatePhone = void 0;
function ValidatePhone(value) {
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s. ]?[0-9]{3}[-\s. ]?[0-9]{4,6}$/gm;
    if (!regex.test(value)) {
        console.error('Validation failed: Invalid phone number format!');
    }
}
exports.ValidatePhone = ValidatePhone;
function ValidateEmail(value) {
    const regex = /^[a-zA-Z0-9]{1,30}@[a-zA-Z0-9.]{1,30}$/gm;
    if (!regex.test(value)) {
        console.error('Validation failed: Invalid Email format!');
    }
}
exports.ValidateEmail = ValidateEmail;
