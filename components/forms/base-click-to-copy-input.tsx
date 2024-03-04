import { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Clipboard } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';
import BaseInput, { BaseInputProps } from './base-input';

export interface BaseClickToCopyInputProps extends BaseInputProps {
	value: string;
	tooltipText: string;
}

export default function BaseClickToCopyInput({
	tooltipText,
	value,
	className,
	label,
}: BaseClickToCopyInputProps) {
	const [linkCopied, setLinkCopied] = useState<string>(tooltipText);
	const { t } = useTranslation();


	async function isClipboardContentEqual(value) {
		try {
			const clipboardContent = await navigator.clipboard.readText();
			return clipboardContent === value;
		} catch (error) {
			return false;
		}
	}
	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(value);

			const isClipboardContainsValue = await isClipboardContentEqual(value);
			isClipboardContainsValue ? setLinkCopied(t("COPIED")) : setLinkCopied(tooltipText);
		} catch (error) {
			console.error('Unable to copy text to clipboard', error);
		}
	};



	return (
		<BaseInput
			prepend={
				<OverlayTrigger
					placement="top"
					delay={{ show: 50, hide: 400 }}
					overlay={
						<Tooltip>
							{Boolean(linkCopied !== tooltipText) ? linkCopied : tooltipText}
						</Tooltip>
					}
				>
					<Button variant="secondary" className="bg-secondary px-3" onClick={copyToClipboard}>
						<Clipboard className="text-white" />
					</Button>
				</OverlayTrigger>
			}
			label={label}
			value={value}
			readOnly
			className={className}
		/>
	);
}
