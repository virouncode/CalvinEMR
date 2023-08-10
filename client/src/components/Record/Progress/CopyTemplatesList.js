import React from "react";

const CopyTemplatesList = ({
  templates,
  copyTemplateSelectedId,
  handleSelectCopyTemplate,
}) => {
  return (
    <select value={copyTemplateSelectedId} onChange={handleSelectCopyTemplate}>
      <option style={{ backgroundColor: "#cccccc" }} disabled value="-1">
        an existing template
      </option>
      {templates.map((template) => (
        <option key={template.id} value={template.id}>
          {template.name}
        </option>
      ))}
    </select>
  );
};

export default CopyTemplatesList;
