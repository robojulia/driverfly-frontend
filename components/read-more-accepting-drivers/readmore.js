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
  const router = useRouter()
  const ctx = useContext( jobContext )
  function changeHandler ( e ) {
    if (e.target.checked) {
      const a = updateQueryStringParameter( window.location.href, 'drivers_from[]', e.target.value )
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
              <input type="checkbox" id="lasthour" name="areas" value="delaware" />Delaware (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="hour" name="areas" value="georgia" />Georgia (2)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="lasthour" name="areas" value="illinois" />Illinois (2)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="hour" name="areas" value="indiana" />Indiana (4)
            </div>


          </div>

          <div  onChange={changeHandler} className="App">
            <div className="topping pt-2">
              <input type="checkbox" id="anywhere" name="areas" value="anywhere" />Anywhere in the US (5)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="alabama" name="areas" value="alabama" />Alabama (2)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="arizona" name="areas" value="arizona" />Arizona (2)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="california" name="areas" value="california" />California (8)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="california" name="areas" value="Colorado" />Colorado (1)
            </div>
            <div className="topping pt-2">
              <input type="checkbox" id="connecticut" name="areas" value="connecticut" />Connecticut (1)
            </div>
          </div>


        </ReadMore>
      </h2>
    </div>
  )
}

export default Content