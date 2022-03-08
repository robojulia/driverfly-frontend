import { updateQueryStringParameter } from "../../logics/utils"
import {useRouter} from "next/router"


export default function Search () {
  const router = useRouter()
  const searchHandler = e => {
    if ( e.key === 'Enter' ) {
      const a = updateQueryStringParameter( window.location.href, 'title', e.target.value )
      router.replace( a )
    }
  }


  return (
    <>
      <label className="heading-label my-4">Search Keywords </label>
      <input onKeyPress={searchHandler} type="text" className="form-control shadow-sm p-4" placeholder="e.g. web design" />
    </>
  )
}