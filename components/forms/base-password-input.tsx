import React, { useState } from 'react'
import { InputGroup } from 'react-bootstrap';
import { EyeFill } from 'react-bootstrap-icons';
import BaseInput, { BaseInputProps } from './base-input';

export default function BasePasswordInput(props: BaseInputProps) {
    const [showSSN, setShowSSN] = useState<boolean>(false)
    return (
        <BaseInput
            step={0.01}
            min={0}
            type={showSSN ? 'text' : 'password'}
            append={<InputGroup.Text onClick={() => setShowSSN(!showSSN)}><EyeFill  /></InputGroup.Text>}
            {...props}
        />
    )
}
