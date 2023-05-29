import { Button } from "react-bootstrap"
import { CloudArrowDown, Eye, Pen, Trash } from "react-bootstrap-icons"
import { DocumentEntity } from "../../../models/documents/document.entity";
import { TranslateInterface } from "../../../hooks/use-translation";

type ButtonProps = {
    document?: DocumentEntity;
    type?: string;
    t?: TranslateInterface;
    onClick?: (...args: any) => any;
    className?: string;
}

/**
 * This is a functional component that renders a button to add or update a document based on the
 * provided props.
 * @param  - The `AddDocumentButton` component takes in two props:
 */
export const AddDocumentButton = ({ document, type, t, onClick, className }: ButtonProps) => (
    <>
        <Button
            className={className ?? "mr-2 w-100"}
            onClick={() => { onClick(type, document?.id) }}
        >{document ? <Pen /> : t('ADD')}</Button>
    </>
)

/* This is a functional component in TypeScript React that renders a delete button for a
document. It takes a prop `document` which is an object containing information about the document.
If the `document` prop is truthy, it renders an anchor tag with a trash icon that, when clicked,
calls the `handleDeleteDocument` function with the `document.type` as an argument. The button is
styled using Bootstrap classes. */
export const DeleteDocumentButton = ({ document, onClick, className }: ButtonProps) => (
    <>
        {document
            && <button
                className={className ?? "btn btn-danger  p-0 pt-1 mr-2 w-100"}
                onClick={() => onClick(document.type)}
            ><Trash /></button>
        }
    </>
)

/* This is a functional component in TypeScript React that renders a button with a cloud
arrow down icon. It takes a prop called "document" and checks if it exists. If it does, it renders
the button with an onClick event that calls a function called "handleDownloadDocument" with the
document's ID as an argument. If the "document" prop does not exist, it does not render anything. */
export const DownloadDocumentButton = ({ document, onClick, className }: ButtonProps) => (
    <>
        {document
            && <button
                onClick={() => onClick(document.id)}
                className={className ?? "btn theme-primary2-btn p-0 pt-1 mr-2"}
            ><CloudArrowDown /></button>
        }
    </>
)

/* This code is a functional component in TypeScript React that renders a button with an Eye icon.
It takes a prop called `document` and checks if it exists. If it does, it renders an anchor tag with
the Eye icon and a click event listener that calls the `handleViewDocument` function with the
`document.id` as an argument. The button has a class name and some styles applied to it. */
export const ViewDocumentButton = ({ document, onClick, className }: ButtonProps) => (
    <>
        {document
            && <button
                className={className ?? "btn btn-success p-0 pt-1 mr-2 w-100"}
                onClick={() => onClick(document.id)}
            ><Eye /></button>
        }
    </>
)



