import { InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Clipboard } from 'react-bootstrap-icons';
import BaseInput, { BaseInputProps } from './base-input';

export interface BaseClickToCopyInputProps extends BaseInputProps {
	value: string
	tooltipText: string
}
export default function BaseClickToCopyInput({ tooltipText, value, className, label }: BaseClickToCopyInputProps) {
	const clickHandler = () => { navigator.clipboard.writeText(value) }
	return (
		<BaseInput
			prepend={
				<OverlayTrigger
					placement="top"
					delay={{ show: 50, hide: 400 }}
					overlay={<Tooltip>{tooltipText}</Tooltip>}
				>
					<InputGroup.Text role={"button"} className='bg-secondary'>
						<Clipboard className='text-white' onClick={clickHandler} />
					</InputGroup.Text>
				</OverlayTrigger>
			}
			label={label}
			value={value}
			readOnly
			className={className}
		/>
	)
}
