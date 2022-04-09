import React from 'react'

function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
function BaseFile ( { required, className, label, handleBlur, accept, uploadPlaceholder = "Upload", viewPlaceholder = "View", deletePlaceholder = "Delete", value, onChange, onView, onDelete, readOnly, name, touched, error } ) {
  const id = generateUUID();
  return (
    <div className={className}>
      {label && <label>{label}{required ? "*" : ""}:</label>}
      <br />
      <label htmlFor={id}>
        <span className='btn btn-yellow'>+ {uploadPlaceholder}</span>
      </label>
      <input
          id={id}
          onBlur={handleBlur}
          type="file"
          accept={accept}
          onChange={onChange}
          readOnly={readOnly}
          name={name}
          style={{ display: "none" }}
        />
      {
        value && onView &&
        <button className="btn btn-yellow" style={{ marginLeft: "1px" }} name={name} onClick={onView}>{viewPlaceholder}</button>
      }
      {
        value && onDelete &&
        <button className="btn btn-yellow" style={{ marginLeft: "1px" }} name={name} onClick={onDelete}>x {deletePlaceholder}</button>
      }
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseFile