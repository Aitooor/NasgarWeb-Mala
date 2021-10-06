
export enum ErrorCode {
  None,

  // Account
  EAcInvalidArgs,
    // Login
    EAcIncorrect,
    EAcNoVerified
    // Sign up
    EAcExists,
}

export default ErrorCode;

export const errorDesc = {
  "None": "",
  // Account
  "EAcInvalidArgs": "Invalid arguments.",
  "EAcIncorrect": "Name or password is incorrect.",
  "EAcNoVerified": "Account is not verified.",
  "EAcExists": "That name already exists."
}
