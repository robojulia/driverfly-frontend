import React from 'react'
import { InputGroup } from 'react-bootstrap';
import BaseInput, { BaseInputProps } from './base-input';

export default function BaseHoursInput(props: BaseInputProps) {
  return (
    <BaseInput
      step={0.01}
      min={0}
      type="number"
      append={<InputGroup.Text>hrs</InputGroup.Text>}
      {...props}
      />
  )
}
