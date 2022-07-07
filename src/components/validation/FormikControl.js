import React from "react";

import {
  Files,
  Textarea,
  Input,
  DateTimePicker,
  DateComponent,
  Selects,
  FormRadio,
  Checkbox,
} from ".";

const FormikControl = (props) => {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <Input {...rest} />;
    case "textarea":
      return <Textarea {...rest} />;

    case "select":
      return <Selects {...rest} />;
    case "checkbox":
      return <Checkbox {...rest} />;
    case "radio":
      return <FormRadio {...rest} />;
    case "time":
      return <DateTimePicker {...rest} />;
    case "file":
      return <Files {...rest} />;
    case "date":
      return <DateComponent {...rest} />;

    default:
      return null;
  }
};

export default FormikControl;
