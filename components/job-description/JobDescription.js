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

                <p>
                    <strong>Requirements:</strong>
                    {props.job.mvr_requirements}
                </p>
            </div>

        </>
    )
}