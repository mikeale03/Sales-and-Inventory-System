/* eslint-disable react/jsx-props-no-spreading */
import React, { ComponentPropsWithoutRef } from 'react';
import { FormGroup, FormLabel, FormControl } from 'react-bootstrap';

type Props = {
  label?: string;
  formGroupProps?: ComponentPropsWithoutRef<typeof FormGroup>;
  formLabelProps?: ComponentPropsWithoutRef<typeof FormLabel>;
};

const FormInput: React.FC<
  Props & ComponentPropsWithoutRef<typeof FormControl>
> = ({
  label,
  required,
  formGroupProps,
  formLabelProps,
  children,
  ...rest
}) => {
  return (
    <FormGroup {...formGroupProps}>
      <FormLabel {...formLabelProps}>
        {label} {required && <span className="text-danger">*</span>}
      </FormLabel>
      <FormControl required={required} {...rest}>{children}</FormControl>
    </FormGroup>
  );
};

export default FormInput;
