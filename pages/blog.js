import Link from 'next/link';
import Layout from "../components/layouts";
import Blog from '../public/css/Blog.module.css'
import BlogSidebar from '../components/blog-sidebar/Blog-Sidebar';
import Breadcrumbs from 'nextjs-breadcrumbs';
export default function Blogs() {
return (
<>
<div className="top-links-sec">
   <div className="container">
      <div className="top-links-inner d-flex align-items-center justify-content-between">
         <h2>Owner Operators</h2>
       < Breadcrumbs />
      </div>
   </div>
</div>
<div className="container my-5 p-lg-2 p-0">
   <div className="row mt-lg-3  ">
      <div className="col-lg-8 col-12">
         <div className="row">
            <div className="col-lg-4 col-md-4 p-0 mr-lg-4 ">
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
                  <a href=""className={Blog.readmore}>Read More <i className="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></a>
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
                  <a href=""className={Blog.readmore}>Read More <i className="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></a>
               </div>
            </div>
        </div>
    </div>
   
    < BlogSidebar />
      
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