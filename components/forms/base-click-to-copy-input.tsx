import { useEffect, useState } from 'react';
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
	async function isClipboardContentEqual() {
		try {
			const clipboardContent = await navigator.clipboard.readText(); 
			setLinkCopied((prevState) => Boolean(clipboardContent === value) ? t("COPIED") : tooltipText )
		} catch (error) {
			return false;
		}
	}
	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(value);
			await isClipboardContentEqual();
		} catch (error) {
			console.error('Unable to copy text to clipboard', error);
		}
	};
	document.addEventListener('copy', isClipboardContentEqual);
	document.addEventListener('visibilitychange', async ()=> {
	if (!document.hidden) await isClipboardContentEqual();
	});

	
	return (
		<BaseInput
			prepend={
				<OverlayTrigger
					placement="top"
					delay={{ show: 50, hide: 400 }}
					overlay={
						<Tooltip>
							{linkCopied}
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
