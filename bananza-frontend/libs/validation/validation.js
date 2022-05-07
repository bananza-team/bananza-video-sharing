
let validateLength = (minlen, maxlen, string) => {
    let len = string.length;
    return {
      status: len >= minlen && len <= maxlen,
      message: `Length must be between $(minlen) and $(maxlen)`,
    };
  };
  
  let validateMail = (string) => {
    return {
      status: /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/.test(string),
      message: "Doesn't look like an email",
    };
  };
  
  let validatePhone = (string) => {
    return {
      status: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(string),
      message: "Doesn't look like a phone number",
    };
  };
  
  let addValidation = (response, string, validator) =>{
    let validatorResponse = validator(string);
    response.status &&= validatorResponse.status;
    response.message.push(validatorResponse.message);
    return response;
  }
  
  export {validateLength, validateMail, validatePhone, addValidation}; 