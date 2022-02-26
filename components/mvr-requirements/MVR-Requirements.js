export default function MvrRequirement() {

    return (
        <>
            <div className="card">
                <div className="card-header" id="headingseventy">
                    <h4 className="clearfix mb-0">
                        <a className="btn-3 btn-link" data-toggle="collapse"
                            data-target="#collapsesedventy" aria-expanded="true"
                            aria-controls="collapsesedventy">MVR Requirements<i
                                className="fa fa-angle-down"></i></a>
                    </h4>
                </div>
                <div id="collapsesedventy" className="collapse show"
                    aria-labelledby="headingseventy" data-parent="#accordionExample">
                    <div className="card-body">
                        <div className="topping pt-2 ">
                            <input type="checkbox" id="clearmvr" name="topping" value="Paneer" />Clean MVR Only (19)
                        </div>
                        <div className="topping pt-2 ">
                            <input type="checkbox" id="moving" name="topping" value="Paneer" />Moving Violation Okay (2)
                        </div>
                        <div className="topping pt-2 ">
                            <input type="checkbox" id="fault" name="topping" value="Paneer" />Non "At Fault" Accident Okay (8)
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}