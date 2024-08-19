const userRegex = {
  EMAIL_REGEX:
    /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]){1,}@([\w\-]+)((\.[a-zA-Z0-9_-]{2,})+)$/,
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#&%$*])[A-Za-z\d!@#&%$*]{8,}$/,
};
export default userRegex;
