import Head from 'next/head';
import Link from 'next/link';
import Layout from "../components/layouts";

export default function Contact() {
    return (
        <>
        <Head>
            <title>Contact - DriverFly</title>
        </Head>



<div class="top-links-sec">
    <div class="container">
        <div class="top-links-inner d-flex align-items-center justify-content-between">
            <h2>Contact</h2>
            <ul class="d-flex">
                <li><a href="index.html" class="nav-link text-dark px-0">Home <i class="fa fa-caret-right px-2" aria-hidden="true"></i></a></li>
                <li><a href="#" class="nav-link text-dark px-0">Contact</a></li>
            </ul>
        </div>
    </div>
</div>

<div class="top-outer bg-white py-5"></div>


<div class="contact-form">
    <div class="container">
        <div class="row contact-inner bg-white">
            <div class="col-sm-12 col-lg-5 pl-0">
                <article>
                    <div class="contact-infomation">
                        <h2>Contact Infomation</h2>
                        <p>Have Questions? Please submit your query to us and we will come to you as soon as possible.</p>
                        <ul class="address_list">
                            <li><a href="#" class="nav-link px-0"> Los Angeles, CA</a></li>
                            <li><a href="mailto:#" class="nav-link px-0">Email: info@driverfly.co</a></li>
                            <li><a href="#" class="nav-link px-0"> Call: (614) 259-7225</a></li>
                         </ul>
                    </div>
                </article>
            </div>
            <div class="col-sm-12 col-lg-7 contact-outer">
                <form action="" method="post">
                    <h3>We want to hear form you!</h3>
                    <div class="form-group">
                        <div class="row">
                            <div class="col"><input type="text" class="form-control shadow-sm" name="your_name" placeholder="Your Name" required="required" /></div>
                            <div class="col"> <input type="email" class="form-control shadow-sm" name="email" placeholder="Email Address" required="required" /></div>
                        </div>        	
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control shadow-sm" name="subject" placeholder="Subject" required="required" />
                    </div>
                    <div class="form-group">
                        <textarea name="message" id="message" cols="20" rows="6" class="form-control shadow-sm" placeholder="Message"></textarea>
                    </div>        
                    <div class="form-group">
                        <button type="submit" class="btn btn-danger float-right py-3 px-5 mb-4">Submit <i class="fa fa-long-arrow-right ml-2" aria-hidden="true"></i> </button>
                    </div>
                </form>
            </div>
        </div>
          <div class="row mt-5 pt-4 contact-icon">
              <div class="col-md-4">
                  <div class="contact-icon-inner">
                  <i class="fa fa-address-card-o" aria-hidden="true"></i>
                  </div>
                  <h3 class="title text-center  my-4"><Link href="/signup"><a className='text-black'>Want to join us?</a></Link></h3>
              </div>
              <div class="col-md-4">
                <div class="contact-icon-inner">
                    <i class="fa fa-newspaper-o" aria-hidden="true"></i>
                   

                 
                  </div>
                  <h3 class="title text-center  my-4"><Link href=""><a className='text-black'>Read our latest news</a></Link></h3>
                 
              </div>
              <div class="col-md-4">
                <div class="contact-icon-inner">
                    <i class="fa fa-question-circle-o" aria-hidden="true"></i>
                  </div>
                  <h3 class="title text-center  my-4"><Link href=""><a className='text-black'>Have questions?</a></Link></h3>
              </div>
          </div>
    </div>
</div>
</>
)
}
Contact.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}