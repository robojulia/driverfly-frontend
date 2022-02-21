export default function JobApply() {
    return (
    <>
       
        <div className="modal fade p-0" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header border-0">
                    <h5 className="modal-title font-weight-normal" id="exampleModalLabel">Apply for this job</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                <form>
                    <div className="row">
                        <div className="col-lg-6 col-12">
                            <label>*Fullname</label>
                            <input type="text" className="form-control" placeholder="Full Name" />
                        </div>
                        <div className="col-lg-6 col-12">
                            <label>*Phone</label>
                            <input type="number" className="form-control" placeholder="Phone" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-3">
                            <label>*Email</label>
                            <input type="emain" className="form-control" placeholder="E-mail" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-3">
                            <label>* Qualifications</label>
                            <textarea className="form-control" id="validationTextarea" placeholder="Qualifications" required></textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-12 mt-3">
                            <label>Upload your CV</label>
                            <input type="file" className="form-control mt-lg-4 mt-0" />
                        </div>
                        <div className="col-lg-6 col-12 mt-3">
                            <label>Upload your Commercial Driver’s License</label>
                            <input type="file" className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-12 mt-3">
                            <label>Upload your Medical card</label>
                            <input type="file" className="form-control mt-lg-4 mt-0"  />
                        </div>
                        <div className="col-lg-6 col-12 mt-3">
                            <label>* Years of CDL driving experience</label>
                                <select className="form-select" aria-label="Default select example">
                                    <option selected>Select CDL Driving Experience</option>
                                    <option value="1">1-5 Months</option>
                                    <option value="2">6-11 Months</option>
                                    <option value="3">1 Year</option>
                                    <option value="1">2 Years</option>
                                    <option value="2">3 Years</option>
                                    <option value="3">4 Years</option>
                                    <option value="1">5+ Years</option>
                                </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-12 mt-3">
                            <label>* Number of moving violations in the last 3 years</label>
                            <select className="form-select" aria-label="Default select example">
                                <option selected>Select One</option>
                                <option value="1">0</option>
                                <option value="2">1</option>
                                <option value="3">2</option>
                                <option value="1">3</option>
                                <option value="2">4</option>
                                <option value="3">5</option>
                                <option value="1">6</option>
                                <option value="2">7</option>
                                <option value="3">8</option>
                                <option value="2">9</option>
                                <option value="3">10+</option>
                            </select>
                        </div>
                        <div className="col-lg-6 col-12 mt-3">
                            <label>* Can you pass a drug & alcohol test</label>
                            <div className="form-check form-check-inline mt-2">
                                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                                <label className="form-check-label" for="inlineCheckbox1">Yes</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox"  value="option2" />
                                <label className="form-check-label" for="inlineCheckbox2">No</label>
                            </div>
                        </div>
                    </div>
                    <div className="row my-lg-4">
                        <div className="col-12 mt-3">
                            <label>Create a DriverFly account?</label>
                            <div className="form-check ">
                                <input className="form-check-input" type="checkbox"  value="option2" />
                                <label className="form-check-label" htmlfor="inlineCheckbox2">Yes</label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className=" col-12">
                            <p>By clicking the submit button below, I hereby agree to and accept the <br /> <a href="#"> terms and conditions</a></p>
                        </div>
                    </div>
            </form>
            </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary w-100 p-lg-3 p-5">Submit</button>
                </div>
            </div>
        </div>
        </div>
</>
    )
}