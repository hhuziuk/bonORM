export function ValidatePhone(value: string) {
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s. ]?[0-9]{3}[-\s. ]?[0-9]{4,6}$/gm;
    if (!regex.test(value)) {
        console.error('Validation failed: Invalid phone number format!');
    }
}
export function ValidateEmail(value: string) {
    const regex = /^[a-zA-Z0-9]{1,30}@[a-zA-Z0-9.]{1,30}$/gm;
    if (!regex.test(value)) {
        console.error('Validation failed: Invalid Email format!');
    }
}
