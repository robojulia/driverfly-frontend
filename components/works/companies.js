export default function Companies() {
    return (
    <>
         <h3>Companies</h3>
        <div className="row">
        <div className="col-md-4">
            <div className="card">
                <i className="fa fa-pencil" aria-hidden="true"></i>
                <div className="card-body px-0">
                    <h5 className="card-title">Post A Job</h5>
                    <p className="card-text">Post a job. We'll quickly match you with the right drivers.</p>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="card">
                <i className="fa fa-file-audio-o" aria-hidden="true"></i>
                <div className="card-body px-0">
                    <h5 className="card-title">Search Drivers</h5>
                    <p className="card-text">Browse profiles, reviews, and proposals then interview top driver candidates.</p>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="card">
                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                <div className="card-body px-0">
                    <h5 className="card-title">Hire</h5>
                    <p className="card-text">Extend an offer letter and conduct background checks/onboarding in accordance with the FMCSA.</p>
                </div>
            </div>
        </div>
        </div>
    </>
)
}