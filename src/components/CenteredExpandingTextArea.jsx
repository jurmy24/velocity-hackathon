import React, { useCallback, useRef, useEffect } from "react";

const CenteredExpandingTextarea = ({
  content,
  onChange,
  placeholder,
  readOnly,
  isSuggestion,
}) => {
  const textareaRef = useRef(null);

  const resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        0
      )}px`;
    }
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [content, resizeTextarea]);

  const handleChange = useCallback(
    (e) => {
      onChange(e);
      resizeTextarea();
    },
    [onChange, resizeTextarea]
  );

  return (
    <div className="flex items-center justify-center w-full min-h-[15px] rounded-md overflow-hidden transition-colors duration-200">
      <textarea
        ref={textareaRef}
        className={`
          w-full h-full p-2
          resize-none bg-transparent
          text-center outline-none
          transition-colors duration-200
          ${
            isSuggestion
              ? "text-gray-500 dark:text-gray-300"
              : "text-gray-800 dark:text-white"
          }
          ${readOnly ? "cursor-default" : ""}
          placeholder-gray-400 dark:placeholder-gray-500
          focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700
        `}
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{
          lineHeight: "1.5",
          verticalAlign: "middle",
        }}
      />
    </div>
  );
};

export default CenteredExpandingTextarea;
