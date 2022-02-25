export default function FullParty() {
    return (
        <>
            <div className="card">
                <div className="card-header" id="headingSix">
                    <h4 className="clearfix mb-0">
                        <a className="btn-3 btn-link" data-toggle="collapse"
                            data-target="#collapseFullPart" aria-expanded="true"
                            aria-controls="collapseFullPart">Full-time/Part-time <i
                                className="fa fa-angle-down"></i></a>
                    </h4>
                </div>
                <div id="collapseFullPart" className="collapse show" aria-labelledby="headingSix"
                    data-parent="#accordionExample">
                    <div className="card-body">
                        <div className="App">
                            <div className="topping pt-2">
                                <input type="radio" id="lasthour" name="areas" value="Paneer" />Part-time (1)
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="hour" name="areas" value="Paneer" />Full-time (29)
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}