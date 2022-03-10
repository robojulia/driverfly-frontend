import React, { useState } from "react"
import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"


const ReadMore = ( { children } ) => {
  const text = children
  const [isReadMore, setIsReadMore] = useState( true )
  const toggleReadMore = () => {
    setIsReadMore( !isReadMore )
  }
  return (
    <p className="text">
      {isReadMore ? text.slice( 1 ) : text}
      <span onClick={toggleReadMore} className="read-or-hide">
        {isReadMore ? "Show More +" : " Show less -"}
      </span>
    </p>
  )
}

const Content = () => {
  const ctx = useContext( jobContext )
const router = useRouter()

function changeHandler ( e ) {
  if (e.target.checked) { 
    const a = updateQueryStringParameter( window.location.href, 'equipment_type[]', e.target.value )
    router.replace( a )
    ctx.applyFilters()
  }
}

  return (
    <div className="container p-0">
      <h2>
        <ReadMore>

          <div onChange={changeHandler} className="App">
            <div className="topping pt-2">
              <input type="checkbox" id="courier" name="areas" value="courier" />Courier van (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="doubles" name="areas" value="doubles" />Doubles Trailer (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="van" name="areas" value="van" />Dry van (8)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="dumptruck" name="areas" value="dumptruck" />Dump truck (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="heavyhaul" name="areas" value="heavyhaul" />Heavy haul (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="towing" name="areas" value="towing" />Heavy towing (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="hotshot" name="areas" value="hotshot" />Hotshot (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="intermodal" name="areas" value="intermodal" />Intermodal (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="logging" name="areas" value="logging" />Logging (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="reefer" name="areas" value="reefer" />Reefer (5)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="servicetrucks" name="areas" value="servicetrucks" />Service trucks (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="tractoronly" name="areas" value="tractoronly" />Tractor only (1)
            </div>
          </div>
          <div onChange={changeHandler} className="App">
            <div className="topping pt-2">
              <input type="checkbox" id="" name="areas" value="trailer" />Tractor trailer (20)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="" name="areas" value="flatbed" />Flatbed (6)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="" name="areas" value="arizona" />Arizona (2)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="" name="areas" value="auto-hauling" />Auto hauling (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="" name="areas" value="boxtruck" />Boxtruck (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="" name="areas" value="bus" />Bus (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="" name="areas" value="concrete-mixer" />Concrete Mixer (1)
            </div>
          </div>

        </ReadMore>
      </h2>
    </div>
  )
}

export default Content