import React, { useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import styles from "./write/writePage.module.css";

const CustomQuillEditor = ({ value, onChange, placeholder }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    // Ensure the Quill editor is correctly initialized
    if (quillRef.current) {
      quillRef.current.getEditor();
      // Perform any necessary operations on the editor instance
    }
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      className={styles.textArea}
      theme="bubble"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default CustomQuillEditor;
