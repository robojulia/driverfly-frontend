import React, { Component } from 'react'
import Select from 'react-select'

const options = [
  { value: 'alltype', label: 'All Type' },
  { value: 'solo', label: 'solo (27)' },
  { value: 'yeamdrivers', label: 'Team Drivers (27)' }
]

const MyComponent = () => (
  <Select options={options} />
)

export default MyComponent;
