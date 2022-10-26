
function ViewFileButton({ className, data_name, label, onClick }) {
    return (
        <span
            data-name={data_name}
            onClick={onClick}
            role="button"
            className={className}>
            {label}
        </span>
    )
}

export default ViewFileButton