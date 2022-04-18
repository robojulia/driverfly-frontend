import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { updateQueryStringParameter } from "../../logics/utils"

export default function Search() {

  const { state, method } = useContext(jobContext)
  const { filters } = state
  const { setFilters, applyFilters } = method

  const searchHandler = e => {
    if (e.key === 'Enter') {
      setFilters({
        ...filters,
        keywords: e.target.value
      }, applyFilters())
    }
  }

  return (
    <>
      <label className="heading-label my-4">Search Keywords </label>
      <input name="keywords" onKeyPress={searchHandler} type="text" className="form-control shadow-sm p-4" placeholder="e.g. flatbed" />
    </>
  )
}