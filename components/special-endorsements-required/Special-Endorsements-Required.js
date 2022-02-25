export default function SpecialEndorsementsRequired() {

    return (
        <>
            <div className="card">
                <div className="card-header" id="headingsixty">
                    <h4 className="clearfix mb-0">
                        <a className="btn-3 btn-link" data-toggle="collapse"
                            data-target="#collapsesixty" aria-expanded="true"
                            aria-controls="collapsesixty">Special Endorsements Required<i
                                className="fa fa-angle-down"></i></a>
                    </h4>
                </div>
                <div id="collapsesixty" className="collapse show"
                    aria-labelledby="headingsixty" data-parent="#accordionExample">
                    <div className="card-body">
                        <div className="topping pt-2 ">
                            <input type="checkbox" id="topping" name="topping" value="Paneer" />TWIC (4)
                        </div>
                        <div className="topping pt-2 ">
                            <input type="checkbox" id="topping" name="topping" value="Paneer" />(H) Hazardous Materials (HAZMAT) (2)
                        </div>
                        <div className="topping pt-2 ">
                            <input type="checkbox" id="topping" name="topping" value="Paneer" />(N) Tank Vehicle(Tanker) (1)
                        </div>
                        <div className="topping pt-2 ">
                            <input type="checkbox" id="topping" name="topping" value="Paneer" />(X) Tanker/HAZMAT Combo (2)
                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}