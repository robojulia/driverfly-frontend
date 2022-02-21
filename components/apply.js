export default function JobApply() {
    return (
    <>
       
        <div class="modal fade p-0" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title font-weight-normal" id="exampleModalLabel">Apply for this job</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                <form>
                    <div class="row">
                        <div class="col-lg-6 col-12">
                            <label>*Fullname</label>
                            <input type="text" class="form-control" placeholder="Full Name" />
                        </div>
                        <div class="col-lg-6 col-12">
                            <label>*Phone</label>
                            <input type="number" class="form-control" placeholder="Phone" />
                        </div>
                    </div>
                    <div className="row">
                        <div class="col-12 mt-3">
                            <label>*Email</label>
                            <input type="emain" class="form-control" placeholder="E-mail" />
                        </div>
                    </div>
                    <div className="row">
                        <div class="col-12 mt-3">
                            <label>* Qualifications</label>
                            <textarea class="form-control" id="validationTextarea" placeholder="Qualifications" required></textarea>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 col-12 mt-3">
                            <label>Upload your CV</label>
                            <input type="file" class="form-control mt-lg-4 mt-0" />
                        </div>
                        <div class="col-lg-6 col-12 mt-3">
                            <label>Upload your Commercial Driver’s License</label>
                            <input type="file" class="form-control" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 col-12 mt-3">
                            <label>Upload your Medical card</label>
                            <input type="file" class="form-control mt-lg-4 mt-0"  />
                        </div>
                        <div class="col-lg-6 col-12 mt-3">
                            <label>* Years of CDL driving experience</label>
                                <select class="form-select" aria-label="Default select example">
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
                    <div class="row">
                        <div class="col-lg-6 col-12 mt-3">
                            <label>* Number of moving violations in the last 3 years</label>
                            <select class="form-select" aria-label="Default select example">
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
                        <div class="col-lg-6 col-12 mt-3">
                            <label>* Can you pass a drug & alcohol test</label>
                            <div class="form-check form-check-inline mt-2">
                                <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                                <label class="form-check-label" for="inlineCheckbox1">Yes</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2" />
                                <label class="form-check-label" for="inlineCheckbox2">No</label>
                            </div>
                        </div>
                    </div>
                    <div class="row my-lg-4">
                        <div class="col-12 mt-3">
                            <label>Create a DriverFly account?</label>
                            <div class="form-check ">
                                <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2" />
                                <label class="form-check-label" for="inlineCheckbox2">Yes</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class=" col-12">
                            <p>By clicking the submit button below, I hereby agree to and accept the <br /> <a href="#"> terms and conditions</a></p>
                        </div>
                    </div>
            </form>
            </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary w-100 p-lg-3 p-5">Submit</button>
                </div>
            </div>
        </div>
        </div>
</>
    )
}