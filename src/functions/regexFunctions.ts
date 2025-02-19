// Check if input is a valid email
export const isValidEmail = (email) => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

// Check if password has :
//  - At least 8 characters
//  - An uppercase character
//  - A lowercase character
//  - A number
//  - An special character
export const isValidPassword = (password) => {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
    password
  );
};

// Check if Text editor is empty.
export const isEditorEmpty = (value) => {
  return value === undefined || value === null
    ? false
    : String(value)
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;
};

// Ensures a username contains only lowercase letters (a-z), digits (0-9), underscores (_), or dots (.)
export const isValidUsername = (username) => {
  return /^[a-z0-9_\.]+$/.test(username);
};
