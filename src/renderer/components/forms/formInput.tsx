/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  FormGroup,
  FormLabel,
  FormControl,
  FormControlProps,
} from 'react-bootstrap';

type Props = {
  label: string;
  required: boolean;
};

const FormInput: React.FC<Props & FormControlProps> = ({
  label,
  required,
  children,
  ...rest
}) => {
  return (
    <FormGroup>
      <FormLabel>
        {label} {required && <span className="text-danger">*</span>}
      </FormLabel>
      <FormControl {...rest}>{children}</FormControl>
    </FormGroup>
  );
};

export default FormInput;
