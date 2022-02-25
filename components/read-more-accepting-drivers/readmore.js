import React, { useState } from "react";


const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <p className="text">
            {isReadMore ? text.slice(1) : text}
            <span onClick={toggleReadMore} className="read-or-hide">
                {isReadMore ? "Show More +" : " Show less -"}
            </span>
        </p>
    );
};

const Content = () => {
    return (
        <div className="container p-0">
            <h2>
                <ReadMore>

                    <div className="App">
                        <div className="topping pt-2">
                            <input type="checkbox" id="lasthour" name="areas" value="Paneer" />Delaware (1)
                        </div>
                        <div className="topping pt-2">
                            <input type="checkbox" id="hour" name="areas" value="Paneer" />Georgia (2)
                        </div>
                        <div className="topping pt-2">
                            <input type="checkbox" id="lasthour" name="areas" value="Paneer" />Illinois (2)
                        </div>
                        <div className="topping pt-2">
                            <input type="checkbox" id="hour" name="areas" value="Paneer" />Indiana (4)
                        </div>
                       
                 
                    </div>

                    <div className="App">
                        <div className="topping pt-2">
                            <input type="checkbox" id="lasthour" name="areas" value="Paneer" />Anywhere in the US (5)
                        </div>
                        <div className="topping pt-2">
                            <input type="checkbox" id="hour" name="areas" value="Paneer" />Alabama (2)
                        </div>
                        <div className="topping pt-2">
                            <input type="checkbox" id="lasthour" name="areas" value="Paneer" />Arizona (2)
                        </div>
                        <div className="topping pt-2">
                            <input type="checkbox" id="hour" name="areas" value="Paneer" />California (8)
                        </div>
                        <div className="topping pt-2">
                            <input type="checkbox" id="lasthour" name="areas" value="Paneer" />Colorado (1)
                        </div>
                        <div className="topping pt-2">
                            <input type="checkbox" id="hour" name="areas" value="Paneer" />Connecticut (1)
                        </div>
                    </div>


                </ReadMore>
            </h2>
        </div>
    );
};

export default Content;