import validateJs from 'validate.js';


type PropertyValidationErrors = {
    rule : string,
    options? : any[],
}[];
type MethodValidationErrors = {
    [field : string] : PropertyValidationErrors
};

validateJs.formatters.intiv = function(errors : any[]) {
    let result : MethodValidationErrors = {};
    errors.map((error) => {
        if (!result[error.attribute]) {
            result[error.attribute] = [];
        }

        result[error.attribute].push({
            rule: error.validator,
            options: error.options,
        });
    });
    return result;
};

validateJs.validators.type.types.numeric = function(value : any) {
    return value == Number(value);
};

export default validateJs;
