import React from 'react'
import { InputGroup } from 'react-bootstrap';
import { Percent } from 'react-bootstrap-icons';
import BaseInput, { BaseInputProps } from './BaseInput';

export default function BasePercentInput(props: BaseInputProps) {
  return (
    <BaseInput
      step={0.01}
      min={0}
      type="number"
      append={<InputGroup.Text>%</InputGroup.Text>}
      {...props}
      />
  )
}
