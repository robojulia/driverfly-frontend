import React from 'react'
import { InputGroup } from 'react-bootstrap';
import { CurrencyDollar } from 'react-bootstrap-icons';
import BaseInput, { BaseInputProps } from './base-input';

export default function BaseMoneyInput(props: BaseInputProps) {
  return (
    <BaseInput
      step={0.01}
      min={0}
      type="number"
      prepend={<InputGroup.Text>$</InputGroup.Text>}
      {...props}
      />
  )
}
