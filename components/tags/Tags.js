import Blog from '../../public/css/Blog.module.css'
export default function Tags() {
    return (
        <>
            <div className="col-12">
                <h5 className="mt-5 mb-4"><span  className='text-dark'>Tags</span></h5>
                <div className="card border-0">
                    <div className='row mb-3'>
                        <div className='col-5 p-0'>
                            <ul className="list-group list-group-flush">
                                <li className={Blog.tag}>
                                    <a href="">Register</a>
                                </li>
                            </ul>
                        </div>
                        <div className='col-5 p-0'>
                            <ul className="list-group list-group-flush">
                                <li className={Blog.tag}>
                                    <a href="">Log in</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='row mb-3'>
                        <div className='col-5 p-0'>
                            <ul className="list-group list-group-flush">
                                <li className={Blog.tag}>
                                    <a href="">Training</a>
                                </li>
                            </ul>
                        </div>
                        <div className='col-5 p-0'>
                            <ul className="list-group list-group-flush">
                                <li className={Blog.tag}>
                                    <a href="">Trucking laws</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}