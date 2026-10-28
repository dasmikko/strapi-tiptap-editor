import React from 'react';
import { Box, Field, Textarea as DSTextarea, TextInput as DSTextInput, Toggle } from '@strapi/design-system';

// Small wrappers that restore the label/hint props the v4 design system inputs had

export const ToggleInput = ({ label, hint, name, onLabel, offLabel, checked, onChange, disabled }) => (
  <Field.Root name={name} hint={hint}>
    <Field.Label>{label}</Field.Label>
    <Toggle
      onLabel={onLabel}
      offLabel={offLabel}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <Field.Hint/>
  </Field.Root>
);

export const TextInput = ({ label, hint, name, ...props }) => (
  <Field.Root name={name} hint={hint}>
    <Field.Label>{label}</Field.Label>
    <DSTextInput name={name} {...props}/>
    <Field.Hint/>
  </Field.Root>
);

export const Textarea = ({ label, hint, name, ...props }) => (
  <Field.Root name={name} hint={hint}>
    <Field.Label>{label}</Field.Label>
    <DSTextarea name={name} {...props}/>
    <Field.Hint/>
  </Field.Root>
);

export const GridLayout = ({ children }) => (
  <Box
    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
  >
    {children}
  </Box>
);
