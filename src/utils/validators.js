export const checkIsBlank = (val) =>
    val === null ||
    val === undefined ||
    (val instanceof Array && val.length === 0) ||
    (val instanceof Object && Object.keys(val).length === 0) ||
    (val instanceof Number && isNaN(val)) ||
    val === '';

export const checkIsAlphabetic = (val) => !/\d/.test(val);

export const checkIsEmail = (val) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(val);
};

export const checkMinLength = (val, minLen) => val.trim().length < minLen;

export const checkMinValue = (val, minVal) => Number(val) < minVal;
