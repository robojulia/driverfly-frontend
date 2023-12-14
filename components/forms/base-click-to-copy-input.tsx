import { Button, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Clipboard } from 'react-bootstrap-icons';
import BaseInput, { BaseInputProps } from './base-input';

export interface BaseClickToCopyInputProps extends BaseInputProps {
	value: string
	tooltipText: string
}
export default function BaseClickToCopyInput({ tooltipText, value, className, label }: BaseClickToCopyInputProps) {
	const copyToClipboard = () => navigator.clipboard.writeText(value)
	return (
		<BaseInput
			prepend={
				<OverlayTrigger
					placement="top"
					delay={{ show: 50, hide: 400 }}
					overlay={<Tooltip>{tooltipText}</Tooltip>}
				>
					<Button variant='secondary' className=' bg-secondary px-3' onClick={copyToClipboard}>
						<Clipboard className='text-white' />
					</Button>
				</OverlayTrigger>
			}
			label={label}
			value={value}
			readOnly
			className={className}
		/>
	)
}
