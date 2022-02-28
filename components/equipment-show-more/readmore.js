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
                    <input type="checkbox" id="courier" name="areas" value="Paneer" />Courier van (1)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="doubles" name="areas" value="Paneer" />Doubles Trailer (1)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="van" name="areas" value="Paneer" />Dry van (8)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="dumptruck" name="areas" value="Paneer" />Dump truck (1)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="heavyhaul" name="areas" value="Paneer" />Heavy haul (1)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="towing" name="areas" value="Paneer" />Heavy towing (1)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="hotshot" name="areas" value="Paneer" />Hotshot (1)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="intermodal" name="areas" value="Paneer" />Intermodal (1)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="logging" name="areas" value="Paneer" />Logging (1)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="reefer" name="areas" value="Paneer" />Reefer (5)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="servicetrucks" name="areas" value="Paneer" />Service trucks (1)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="tractoronly" name="areas" value="Paneer" />Tractor only (1)
                </div>
            </div>
            <div className="App">
                <div className="topping pt-2">
                    <input type="checkbox" id="" name="areas" value="Paneer" />Tractor trailer (20)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="" name="areas" value="Paneer" />Flatbed (6)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="" name="areas" value="Paneer" />Arizona (2)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="" name="areas" value="Paneer" />Auto hauling (1)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="" name="areas" value="Paneer" />Boxtruck (1)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="" name="areas" value="Paneer" />Bus (1)
                </div>
                <div className="topping pt-2">
                    <input type="checkbox" id="" name="areas" value="Paneer" />Concrete Mixer (1)
                </div>
        </div>

        </ReadMore>
      </h2>
    </div>
  );
};
  
export default Content;