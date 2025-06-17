interface CDLFormat {
  mask: string;
  placeholder: string;
  description: string;
}

export const CDL_FORMATS: { [key: string]: CDLFormat } = {
  // Common formats by state
  CA: {
    mask: 'a99999999',
    placeholder: 'A12345678',
    description: '1 letter followed by 8 numbers',
  },
  TX: {
    mask: '99999999',
    placeholder: '12345678',
    description: '8 numbers',
  },
  FL: {
    mask: 'a999999999999',
    placeholder: 'A123456789012',
    description: '1 letter followed by 12 numbers',
  },
  NY: {
    mask: 'a99999999999999',
    placeholder: 'A123456789012345',
    description: '1 letter followed by 14 numbers',
  },
  WI: {
    mask: 'a9999999999999',
    placeholder: 'A1234567890123',
    description: '1 letter followed by 13 numbers',
  },
  NH: {
    mask: 'aa99999999',
    placeholder: 'AB12345678',
    description: '2 letters followed by 8 numbers',
  },
  WA: {
    mask: 'aaa*********',
    placeholder: 'DOEMJ501P1',
    description: '12-character alphanumeric format',
  },
  // Default format for states without specific patterns
  DEFAULT: {
    mask: '************************',
    placeholder: 'Enter CDL Number',
    description: 'CDL Number',
  },
};

export const getCDLFormat = (state: string): CDLFormat => {
  return CDL_FORMATS[state] || CDL_FORMATS.DEFAULT;
};

// Mask guide:
// 9 - numeric
// a - alpha
// * - alphanumeric
