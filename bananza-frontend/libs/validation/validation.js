let validateLength = (minlen, maxlen, data) => {
  let len = data[1].length;
  return {
    status: len >= minlen && len <= maxlen,
    messages: [
      "Length of " + data[0] + " must be between " + minlen + " and " + maxlen,
    ],
  };
};

let validateMail = (data) => {
  return {
    status: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data[1]),
    messages: ["The email address doesn't look valid"],
  };
};

let validatePhone = (data) => {
  return {
    status: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(data[1]),
    messages: ["That doesn't look like a phone number"],
  };
};

let addValidation = (response, data, validator) => {
  let validatorResponse = validator(data);
  response.status &&= validatorResponse.status;
  if (!validatorResponse.status)
    response.messages = response.messages.concat(validatorResponse.messages);
  return response;
};

export { validateLength, validateMail, validatePhone, addValidation };