export default function JobDescription(props) {

    return (
        <>
            <div className="job-deatails-inner">
                <h3>Job Description</h3>
                <figure>
                    <img src={props.job.truck_image} alt="Trulli" className="img-fluid" />
                    <figcaption className="my-3 text-center">{props.job.title}</figcaption>
                </figure>

                <p>Looking for OTR drivers for a company in Dallas, TX</p>
                <p>{props.job.description}</p>

                <p><strong>Requirements:</strong>
                    Willing to do some live unloads, some drop and hook
                    Willing to drive some dry van, some reefer (will provide reefer training if needed)
                    Must have at least 2 years of commercial driving experience
                    Must have Manual driving experience
                    Must have no felony charges
                    Ideally, must have clean record for the past 4 years
                    Must have class A CDL</p>
            </div>

        </>
    )
}