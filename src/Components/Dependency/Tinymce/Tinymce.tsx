import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinymceProps {
  content: string;
  handleEditorChange: (content: string, editor: any) => void;
  height?: number;
  name?: string;
  initialValue?: string;
  auto_focus?: boolean;
}

const Tinymce: React.FC<TinymceProps> = ({
  content,
  handleEditorChange,
  height = 300,
  name,
  initialValue,
  auto_focus = false,
}) => {
  return (
    <Editor
      textareaName={name}
      initialValue={initialValue}
      value={content}
      init={{
        height,
        auto_focus,
        browser_spellcheck: true,
        plugins: [
          "advlist autolink lists link charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | " +
          "bold italic backcolor forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist table numlist outdent indent | " +
          "removeformat | help",
      }}
      onEditorChange={handleEditorChange}
    />
  );
};


export default Tinymce;
