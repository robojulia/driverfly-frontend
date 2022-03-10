import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { updateQueryStringParameter } from "../../logics/utils"

export default function Search () {
  const ctx = useContext( jobContext )
  const router = useRouter()
  const searchHandler = e => {
    if ( e.key === 'Enter' ) {
      const a = updateQueryStringParameter( window.location.href, 'title', e.target.value )
      router.replace( a )
      ctx.applyFilters()
    }
  }


  return (
    <>
      <label className="heading-label my-4">Search Keywords </label>
      <input onKeyPress={searchHandler} type="text" className="form-control shadow-sm p-4" placeholder="e.g. web design" />
    </>
  )
}