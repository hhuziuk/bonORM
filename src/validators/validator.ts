export function ValidatePhone(target, key, descriptor) {
    const originalSetter = descriptor.set;
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s. ]?[0-9]{3}[-\s. ]?[0-9]{4,6}$/gm;

    descriptor.set = function(value) {
        if (typeof value === 'string' && !regex.test(value)) {
            console.error('Validation failed: Invalid phone number format!');
        }

        originalSetter.call(this, value);
    };
}
export function ValidateEmail(target, key, descriptor) {
    const originalSetter = descriptor.set;
    const regex = /^[a-zA-Z0-9]{1,30}@[a-zA-Z0-9.]{1,30}$/gm;

    descriptor.set = function(value) {
        if (typeof value === 'string' && !regex.test(value)) {
            console.error('Validation failed: Invalid Email format!');
        }

        originalSetter.call(this, value);
    };
}

export function Min(min: number, message: string){
    return function(target, key, descriptor) {
        const originalSetter = descriptor.set;

        descriptor.set = function(value) {
            if (typeof value === 'string' && value.length > min) {
                console.error(message);
            }

            originalSetter.call(this, value);
        };
    };
}

export function Max(max: number, message: string){
    return function(target, key, descriptor) {
        const originalSetter = descriptor.set;

        descriptor.set = function(value) {
            if (typeof value === 'string' && value.length > max) {
                console.error(message);
            }

            originalSetter.call(this, value);
        };
    };
}