export default function EnumFilterByKey(props) {
    return (
        <>
            {props.withAll &&
                <div className="topping ">
                    <input
                        onChange={props.handleChange}
                        type="radio"
                        name={props.name}
                        value="" /> All
                </div>
            }
            {Object.keys(props.enumArray).map((key) => {
                return (
                    <>
                        <div className="topping pt-2">
                            <input
                                onChange={props.handleChange}
                                type="radio"
                                name={props.name}
                                value={props.enumArray[key]} /> {props.enumArray[key]}
                        </div>
                    </>
                )
            })}
        </>
    )
}