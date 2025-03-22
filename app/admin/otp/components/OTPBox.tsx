"use client";
import React, { useEffect, useRef, useState } from "react";

const otpCss = {
  width: "40px",
  height: "40px",
  margin: "5px",
  textAlign: "center",
  fontSize: "1.2em",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

interface OTPProps {
  length: number;
}

export default function OTP(props: OTPProps) {
  const [isSending, setIsSending] = useState(false);
  const { length } = props;

  const submitHandler = async (event) => {
    setIsSending(true);
    event.preventDefault();
    const otp = value.join("");
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      window.location.href = "/login";
    }
    const response = await fetch("/api/admin/otp", {
      method: "POST",
      body: JSON.stringify({ otp, accessToken }),
    });

    const result = await response.json();
    if (result.status === 400) {
      alert("Lỗi");
    } else if (result.status_code === 200) {
      localStorage.setItem("access_token", result.access_token);
      window.location.href = result.redirect
    }
    console.log(result);
    setIsSending(false);
  };
  const inputRef = useRef([]);
  const [value, setValue] = useState(new Array(length).fill(""));

  const onChangeHandler = ({ target: { value: inputValue } }, index) => {
    if (isNaN(inputValue)) return;

    const newValue = [...value];
    newValue[index] = inputValue.slice(-1);
    setValue(newValue);

    if (inputValue && index < length - 1) inputRef.current[index + 1].focus();

    const finalValue = newValue.join("");
  };

  const onClickHandler = (index) =>
    inputRef.current[index].setSelectionRange(1, 1);

  const onKeyDownHandler = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !value[index]) {
      inputRef.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (inputRef.current[0]) inputRef.current[0].focus();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-4 text-2xl">2FA</h3>
      <form className="flex flex-col items-center" onSubmit={submitHandler}>
        <div>
          {value.map((item, index) => (
            <input
              key={index}
              ref={(input) => (inputRef.current[index] = input)}
              value={item}
              style={otpCss}
              placeholder="0"
              onChange={(e) => onChangeHandler(e, index)}
              onClick={() => onClickHandler(index)}
              onKeyDown={(e) => onKeyDownHandler(e, index)}
            />
          ))}
        </div>
        <div>
          <button type="submit" className="btn btn-success">
            {isSending && <span className="loading loading-spinner"></span>}
            Xác nhận
          </button>
        </div>
      </form>
    </div>
  );
}
