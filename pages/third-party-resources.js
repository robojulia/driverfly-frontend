import Link from 'next/link';
import Breadcrumbs from 'nextjs-breadcrumbs';
import Layout from "../components/layouts";
import ThirdParty from '../public/css/ThirdParty.module.css'
export default function ThirdPartys() {
return (
<>
   <div className="top-links-sec">
      <div className="container">
         <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>Third Party Resources</h2>
             < Breadcrumbs />
         </div>
      </div>
   </div>
   <div className="container my-5 ">
      <div className="row m-lg-0 m-3">
         <div className="col col-lg-3 col-sm-6 col-md-6 col-12 my-5">
               <h2>CDL Schools</h2>
            </div>
            <div className="col col-lg-3 col-sm-6 col-md-6 col-12 my-5">
               <h2>Trucks & Auto Parts</h2>
            </div>
               <div className="col col-lg-3 col-sm-6 col-md-6 col-12 my-5">
            <h2> Insurance Providers</h2>
            </div>
            <div className="col-lg-3 col-sm-6 col-md-6 col-12 my-5">
               <h2>Factoring Services</h2>
            </div>
      </div>
      <div className="row m-lg-0 m-3">
         <div className="col col-lg-3 col-sm-6 col-md-6 col-12 my-5">
               <h2>Dispatch Centers</h2>
            </div>
            <div className="col col-lg-3 col-sm-6 col-md-6 col-12 my-5">
               <h2>ELD / Software Providers</h2>
            </div>
               <div className="col col-lg-3 col-sm-6 col-md-6 col-12 my-5">
            <h2> Compliance Services</h2>
            </div>
            <div className="col-lg-3 col-sm-6 col-md-6 col-12 my-5">
               <h2>Towing / Auto Maintenances</h2>
            </div>
      </div>
      <div className="row m-lg-0 m-3">
         <div className="col-lg-3 col-sm-6 col-md-6 col-12 my-3">
            <h2>Employee Arbitration Services</h2>
         </div>
         <div className="col col-lg-9 col-sm-9 col-md-6 col-12 my-5">
         <style jsx>{`
         p {
            font-size:18px;
         }
         `}</style>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
         </div>
      </div>
   </div>
</>
)
}
ThirdPartys.getLayout = function getLayout(page){
return (
<Layout>
   {page}
</Layout>
)
}