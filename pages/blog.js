import Link from 'next/link';
import Layout from "../components/layouts";
import Blog from '../public/css/Blog.module.css'
export default function Blogs() {
return (
<>
<div className="top-links-sec">
   <div className="container">
      <div className="top-links-inner d-flex align-items-center justify-content-between">
         <h2>Owner Operators</h2>
         <ul className="d-flex">
            <li><a href="index.html" className="nav-link text-dark px-0">Home <i className="fa fa-caret-right px-2" aria-hidden="true"></i></a></li>
            <li><a href="#" className="nav-link text-dark px-0">Blog</a></li>
         </ul>
      </div>
   </div>
</div>
<div className="container mb-5 p-lg-2 p-0">
   <div className="row mt-lg-3 m-3 ">
      <div className="col-lg-8 col-12">
         <div className="row">
            <div className="col-lg-4 col-md-4 p-0 mr-lg-4 mt-5 ">
               <img src="img/Freight1.jpg" className={Blog.postthumbnail} />
                <div className={Blog.custombtn}></div>  
                 <div className={Blog.cusbtn}>
                    <button className="form-control"className="bt btn-lg mt-2 ml-3 text-center text-white">Changes in Trucking</button>
                 </div>    
            </div>
            <div className="col-lg-7 col-md-7 col-12  mt-5">
               <div className={Blog.topinfo}>
                  <a href="">
                     <h4 className="font-weight-normal mb-2">What Is This New ELDT Program You Speak Of?</h4>
                  </a>
                  <a  className={Blog.time} href="#"><i className="flaticon-clock "></i>January 26, 2022</a>
                  <span className={Blog.comments}><i className="flaticon-chat"></i>0 Comments</span>
                  <p className={Blog.description}>Starting February 7, 2022, the Entry-Level Driver Training (ELDT) regulations will be changed, now requiring all aspiring CDL drivers to receive ...</p>
                  <a href=""className={Blog.readmore}>Read More</a>
               </div>
            </div>
             <div className="col-lg-4 col-md-4 p-0 mr-lg-4 mt-5 ">
               <img src="img/Freight1.jpg" className={Blog.postthumbnail} />
                <div className={Blog.custombtn}></div>  
                 <div className={Blog.cusbtn}>
                    <button className="form-control"className="bt btn-lg mt-2 ml-3 text-center text-white">Changes in Trucking</button>
                 </div>    
            </div>
            <div className="col-lg-7 col-md-7 col-12  mt-5">
               <div className={Blog.topinfo}>
                  <a href="">
                     <h4 className="font-weight-normal mb-2">What Is This New ELDT Program You Speak Of?</h4>
                  </a>
                  <a  className={Blog.time} href="#"><i className="flaticon-clock "></i>January 26, 2022</a>
                  <span className={Blog.comments}><i className="flaticon-chat"></i>0 Comments</span>
                  <p className={Blog.description}>Starting February 7, 2022, the Entry-Level Driver Training (ELDT) regulations will be changed, now requiring all aspiring CDL drivers to receive ...</p>
                  <a href=""className={Blog.readmore}>Read More</a>
               </div>
            </div>
        </div>
    </div>
   
      <div className="col-lg-4 col-12 mt-5 p-0">
        <div className="col-12">
            <div className="search-container"/>
               <div className="input-group box-shadows rounded-sm font-0 border">
                  <input id="search-input" type="search" className="form-control border-0" placeholder="Search"/>  
                     <button id="search-button" type="button" className="btn">
                     <i className="fa fa-search"></i>
                  </button>
               </div>
            </div>
            <div className="col-12">
               <h5 className="mt-5 mb-4"><span>Category</span></h5>
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
               <h5 className="mt-5 mb-4"><span>Category</span></h5>
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
               <h5 className="mt-5 mb-4"><span>Meta</span></h5>
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
            <div className="col-12">
               <h5 className="mt-5 mb-4"><span>Tags</span></h5>
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
        </div>
      
   </div>
</div>
</>
)
}
Blogs.getLayout = function getLayout(page){
return (
<Layout>
   {page}
</Layout>
)
}