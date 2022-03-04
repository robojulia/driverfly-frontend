export default function JonInformation({ job }) {

  return (
    <>
      <div className="sidebar">
        <h3>Job Information</h3>
        <div className="sidebar-inner">
          <ul className="list">
            <li>
              <div className="icon">
                <i className="fa fa-usd" aria-hidden="true"></i>
              </div>
              <div className="details">
                <div className="text">Offered Salary</div>
                <div className="value">$<span className="price-text">{job.min_weekely_pay}</span> - $<span className="price-text">{job.max_weekely_pay}</span> per week</div>
              </div>
            </li>
            <li>
              <div className="icon">
                <i className="fa fa-map-marker" aria-hidden="true"></i>
              </div>
              <div className="details">
                <div className="text">Areas Covered</div>
                <div className="value"> {job.areas_covered}</div>
              </div>
            </li>
            <li>
              <div className="icon">    </div>
              <div className="details">
                <div className="text">Full-time/Part-time</div>
                <div className="value">{job.job_type}</div>
              </div>
            </li>
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">Employment Type</div>
                <div className="value">{job.employment_type}</div>
              </div>
            </li>
            <li>
              <div className="icon">
                <i className="fa fa-user-o" aria-hidden="true"></i>
              </div>
              <div className="details">
                <div className="text">Type of Delivery</div>
                <div className="value"> {job.delivery_type}</div>
              </div>
            </li>
            <li>
              <div className="icon">
                <i className="fa fa-user-o" aria-hidden="true"></i>
              </div>
              <div className="details">
                <div className="text">Accepting Drivers From...</div>
                <div className="value"> {job.drivers_from}</div>
              </div>
            </li>
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">Equipment Type</div>
                <div className="value"> {job.equipment_type}</div>
              </div>
            </li>
            <li>
              <div className="icon">
                <i className="fa fa-user-o" aria-hidden="true"></i>
              </div>
              <div className="details">
                <div className="text">Schedule</div>
                <div className="value">{job.schedule}</div>
              </div>
            </li>
            <li>
              <div className="icon">
                <i className="fa fa-user-o" aria-hidden="true"></i>
              </div>
              <div className="details">
                <div className="text">Pay Structure</div>
                <div className="value"> {job.pay_structure}</div>
              </div>
            </li>
            <li>
              <div className="icon">
                <i className="fa fa-user-o" aria-hidden="true"></i>
              </div>
              <div className="details">
                <div className="text">Minimum Age</div>
                <div className="value">{job.min_age}</div>
              </div>
            </li>

            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">MVR Requirements</div>
                <div className="value"> {job.mvr_requirements}</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="job-detail-statistic">
          <div className="statistic-item flex-middle">
            <div className="icon text-theme">
              <i className="fa fa-file-archive-o" aria-hidden="true"></i>
            </div>
            <span className="text"><span className="number">2 weeks</span> ago</span>
          </div>

          <div className="statistic-item flex-middle">
            <div className="icon text-theme">
              <i className="fa fa-file-archive-o" aria-hidden="true"></i>
            </div>
            <span className="text"><span className="number">143</span> Views</span>
          </div>

          <div className="statistic-item flex-middle">
            <div className="icon text-theme">
              <i className="fa fa-file-archive-o" aria-hidden="true"></i>
            </div>
            <span className="text"><span className="number">2</span> Applicants</span>
          </div>
        </div>
        <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModal"> Apply Now <i className="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></button>
        <div className="socials-apply clearfix">
          <div className="title">OR apply with</div>
          <div className="inner">
            <div className="facebook-apply-btn-wrapper">
              <a className="facebook-apply-btn" href="#" data-job_id="5363"><i className="fa fa-facebook"></i> Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}