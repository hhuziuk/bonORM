"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Max = exports.Min = exports.ValidateEmail = exports.ValidatePhone = void 0;
function ValidatePhone(target, key, descriptor) {
    const originalSetter = descriptor.set;
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s. ]?[0-9]{3}[-\s. ]?[0-9]{4,6}$/gm;
    descriptor.set = function (value) {
        if (typeof value === 'string' && !regex.test(value)) {
            console.error('Validation failed: Invalid phone number format!');
        }
        originalSetter.call(this, value);
    };
}
exports.ValidatePhone = ValidatePhone;
function ValidateEmail(target, key, descriptor) {
    const originalSetter = descriptor.set;
    const regex = /^[a-zA-Z0-9]{1,30}@[a-zA-Z0-9.]{1,30}$/gm;
    descriptor.set = function (value) {
        if (typeof value === 'string' && !regex.test(value)) {
            console.error('Validation failed: Invalid Email format!');
        }
        originalSetter.call(this, value);
    };
}
exports.ValidateEmail = ValidateEmail;
function Min(min, message) {
    return function (target, key, descriptor) {
        const originalSetter = descriptor.set;
        descriptor.set = function (value) {
            if (typeof value === 'string' && value.length > min) {
                console.error(message);
            }
            originalSetter.call(this, value);
        };
    };
}
exports.Min = Min;
function Max(max, message) {
    return function (target, key, descriptor) {
        const originalSetter = descriptor.set;
        descriptor.set = function (value) {
            if (typeof value === 'string' && value.length > max) {
                console.error(message);
            }
            originalSetter.call(this, value);
        };
    };
}
exports.Max = Max;
