import React from "react";

import PasswordRequirementWrapper from "./PasswordRequirementStyle.jsx";
import PasswordRequirementMeassage from "./PasswordRequirementStyle.jsx";

const PasswordRequirement = (props) => {
  let message = "";

  const [isValid, setIsValid] = useState(false);

  const { type, inputValue, isMatch } = props;

  if (type === "uppercaseAndLowercaseLetter") {
    message = "영어 대소문자";
  } else if (type === "number") {
    message = "숫자";
  } else if (type === "specialCharacter") {
    message = "특수문자";
  } else if (type === "length") {
    message = "7-30자 이내";
  } else if (type === "confirmPassword") {
    message = "비밀번호 일치";
  }

  useEffect(() => {
    const validate = () => {
      if (type === "uppercaseAndLowercaseLetter") {
        return /[A-Za-z]/.test(inputValue);
      } else if (type === "number") {
        return /\d/.test(inputValue);
      } else if (type === "specialCharacter") {
        return /[!@#$%^&*(),.?":{}|<>]/.test(inputValue);
      } else if (type === "length") {
        return inputValue.length >= 7 && inputValue.length <= 30;
      } else if (type === "confirmPassword") {
        return isMatch;
      }

      return false;
    };

    setIsValid(validate());
  }, [type, inputValue, isMatch]);

  return (
    <PasswordRequirementWrapper>
      <PasswordRequirementMeassage color={isValid ? true : false}>
        {message}
      </PasswordRequirementMeassage>
    </PasswordRequirementWrapper>
  );
};

export default PasswordRequirement;
