import React from 'react'
import { InputGroup } from 'react-bootstrap';
import BaseInput, { BaseInputProps } from './BaseInput';

export default function BaseMilesInput(props: BaseInputProps) {
  return (
    <BaseInput
      step={0.01}
      min={0}
      type="number"
      append={<InputGroup.Text>mi</InputGroup.Text>}
      {...props}
      />
  )
}
