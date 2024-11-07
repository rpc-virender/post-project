import React, { Fragment, memo, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import { convertToPlainText, removeExtraLineBreaks } from '../images/constant';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline',],      
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }], 
        // ['blockquote'],
        //   ['link', 'image'],      
        // ['link'],                                                                 
        // ['clean']                                       
    ]
};
  
  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'align',
    // 'image','code-block','link', 'strike','blockquote', 
  ];

const TextPad = ({inputId, name, value, labelClassName, label, placeholder, onChange, required, className, maxLimit}) => {
    const inputRef = useRef(null);
    const regex = /<img\s+[^>]>|<a\s+[^>]>.?<\/a>|<form\s+[^>]>.?<\/form>|<input\s+[^>]>|<script\s+[^>]>.?<\/script>|<iframe\s+[^>]>.?<\/iframe>/gi;

    function containsRestrictedTags(pastedContent) {
        // const restrictedTagsRegex = /<(img|a|form|input|script|iframe)[^>]*>.*?<\/\1>|<(img|input|br|hr|meta|link)[^>]*\/?>/gi;
        const restrictedTagsRegex = regex;

        return restrictedTagsRegex.test(pastedContent);
    }

    useEffect(() => {
        const quill = inputRef && inputRef.current.getEditor ? inputRef.current.getEditor() : "";
        
        if (quill && maxLimit) {
            quill.root.addEventListener('paste', (e) => {
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                const currentTextLength = quill.getText().replace(/<[^>]*>/g, '').length;
                
                if (currentTextLength + pastedText.length > maxLimit) {
                    e.preventDefault(); // Block the paste event
                    alert(`You cannot paste text that exceeds the limit of ${maxLimit} characters.`);
                }
                
                if (containsRestrictedTags(pastedText)) {
                    alert("Pasted content contains restricted HTML tags!");
                    e.preventDefault();
                }
            });
        };
    
        return () => {
            if (quill) {
                quill.root.removeEventListener('paste', () => {});
            }
        };
    }, []);

    const handleClick = () => {
        if (inputRef && inputRef.current) inputRef.current.focus();
    };

    const onInputFocus = (e) => {
        if (containsRestrictedTags(value)) {
            alert("Pasted content contains restricted HTML tags!");
            e.preventDefault();
        }
        handleChange(removeExtraLineBreaks(value));
    };

    const handleChange = (text) => {
        if(convertToPlainText(text).length <= (maxLimit + 1) || maxLimit === undefined){
            let event = {target: {
                id: inputId,
                name: name,
                value: text
            }};
            onChange(event);
        };
    };

    return (
        <Fragment>
            {label && label !== "" &&
            <label className={labelClassName} htmlFor={inputId}>{label}<span className="requiredStar">{required == true && label != "" ? "*" : "" }</span></label>
            }
            <ReactQuill 
                ref={inputRef}
                key={inputId}
                id={inputId}
                name={name}
                value={value}
                onClick={handleClick}
                onChange={handleChange}
                placeholder={placeholder}
                modules={modules}
                formats={formats}
                className={className}
                onBlur={onInputFocus}
            />
        </Fragment>
    );
};

export default memo(TextPad);
