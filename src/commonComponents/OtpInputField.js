import React, { useMemo, useState, useEffect } from "react";

const RE_DIGIT = new RegExp(/^\d+$/);

const OtpInputField = ({value, valueLength, onChange,styleForWrongOTP }) => {
    
    const valueItems = useMemo(() => {
		let valueArray;
		if (value !== undefined && value !== null) {
  		 valueArray = value.split('');
    } else {
          valueArray = [];
    }
        const items = [];
        for (let i = 0; i < valueLength; i++) {
          const char = valueArray[i];
          if (RE_DIGIT.test(char)) {
            items.push(char);
          } else {
            items.push('');
          }
        }
        return items;
    }, [value, valueLength]);
    
    const focusToNextInput = (target) => {
      const nextElementSibling = target.nextElementSibling;
      if (nextElementSibling) {
        nextElementSibling.focus();
      }
    };
    
    const focusToPrevInput = (target) => {
      const previousElementSibling = target.previousElementSibling;
      if (previousElementSibling) {
        previousElementSibling.focus();
      }
    };

    const inputOnChange = (e, idx) => {
      const target = e.target;
      let targetValue = target.value.trim();
      const isTargetValueDigit = RE_DIGIT.test(targetValue);
      if (!isTargetValueDigit && targetValue !== '') {
        return;
      }
      targetValue = isTargetValueDigit ? targetValue : ' ';
      const targetValueLength = targetValue.length;
      if (targetValueLength === 1) {
          const newValue = value.substring(0, idx) + targetValue + value.substring(idx + 1);
          onChange(newValue);
          if (!isTargetValueDigit) {
            return;
          }
          const nextElementSibling = target.nextElementSibling;
          if (nextElementSibling) {
            nextElementSibling.focus();
          }
          focusToNextInput(target);
      } else if (targetValueLength === valueLength) {
        onChange(targetValue);
        target.blur();
      }
    };

    const inputOnKeyDown = (e) => {
      const { key } = e;
      const target = e.target;
      if (key === 'ArrowRight' || key === 'ArrowDown') {
        e.preventDefault();
        return focusToNextInput(target);
      }
      if (key === 'ArrowLeft' || key === 'ArrowUp') {
        e.preventDefault();
        return focusToPrevInput(target);
      }
      const targetValue = target.value;
      // keep the selection range position
      // if the same digit was typed
      target.setSelectionRange(0, targetValue.length);
      if (e.key !== 'Backspace' || target.value !== '') {
        return;
      } 
      const previousElementSibling = target.previousElementSibling;  
      if (previousElementSibling) {
        previousElementSibling.focus();
      }
      if (e.key !== 'Backspace' || targetValue !== '') {
        return;
      }
      focusToPrevInput(target);
    };

    const inputOnFocus = (e) => {
      const { target } = e;
      target.setSelectionRange(0, target.value.length);
    };

    return(
        <div className="new-otp-group hor-order" >
            {valueItems.map((digit, idx) => (
                <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{1}"
                    maxLength={valueLength}
                    className="new-otp-input"
                    style={styleForWrongOTP}
                    value={digit}
                    onChange={(e) =>inputOnChange(e, idx)}
                    onKeyDown={inputOnKeyDown}
                    onFocus={inputOnFocus}
                />
            ))}
        </div>
    )
};

export default OtpInputField;