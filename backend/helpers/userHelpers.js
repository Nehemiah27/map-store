export const alignNames = (firstName_, lastName_) => {
  const firstName = alignFirstName(firstName_),
    lastName = alignLastName(lastName_);
  let fullName = `${firstName} ${lastName}`;
  fullName = fullName.trim();
  return {
    firstName,
    lastName,
    fullName,
  };
};

const alignFirstName = (firstName) => {
  const firstNameArr = firstName.trim().split("");
  firstNameArr[0] = firstNameArr[0].toUpperCase();
  return firstNameArr.join("");
};

const alignLastName = (lastName) => {
  const lastNameArr = lastName.trim().split("");
  if (!lastNameArr.length) return lastName;
  lastNameArr[0] = lastNameArr[0].toUpperCase();
  return lastNameArr.join("");
};
