import Blog from '../../public/css/Blog.module.css'
import Tags from '../tags/Tags'
export default function BlogSidebr() {
    return (
        <>
            <div className="col-lg-4 col-12 p-0 mt-lg-0 mt-5">
                <div className="col-12">
                    <div className="search-container" />
                    <div className="input-group box-shadows rounded-sm font-0 border">
                        <input id="search-input " type="search" className="form-control border-0 py-4" placeholder="Search" />
                        <button id="search-button" type="button" className="btn">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>
                <div className="col-12">
                    <h5 className="mt-5 mb-4"><span className='text-dark'>Category</span></h5>
                    <div className={Blog.sidebarwigt}>
                        <div className="card border-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <a href="">Changes in Trucking (1)</a>
                                </li>
                                <li className="list-group-item">
                                    <a href="">Tips and Tricks (1)</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <h5 className="mt-5 mb-4"><span  className='text-dark'>Recent Posts</span></h5>
                    <div className={Blog.sidebarwigt}>
                        <div className="row mb-4">
                            <div className="col-3 mr-2 ml-3 p-0">
                                <img src="img/Freight1.jpg" />
                            </div>
                            <div className="col-7">
                                <ul className="list-group list-group-flush">
                                    <li className="p-0">
                                        <a href="">What Is This New ELDT Program</a>
                                    </li>
                                    <li className={Blog.date}>
                                        <a href="">January 26, 2022</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-3 mr-2  ml-3 p-0">
                                <img src="img/Freight1.jpg" />
                            </div>
                            <div className="col-7">
                                <ul className="list-group list-group-flush">
                                    <li className="p-0">
                                        <a href="">What Is This New ELDT Program</a>
                                    </li>
                                    <li className={Blog.date}>
                                        <a href="">January 26, 2022</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <h5 className="mt-5 mb-4"><span  className='text-dark'>Meta</span></h5>
                    <div className={Blog.sidebarwigt}>
                        <div className="card border-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <a href="">Register</a>
                                </li>
                                <li className="list-group-item">
                                    <a href="">Log in</a>
                                </li>
                                <li className="list-group-item">
                                    <a href="">Entries feed</a>
                                </li>
                                <li className="list-group-item">
                                    <a href="">Entries feed</a>
                                </li>
                                <li className="list-group-item">
                                    <a href="">WordPress.org</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
        
                <Tags />
            </div>
        </>
    )

}
