export default function MinimumAge() {

    return (
        <>
            <div className="card">
                <div className="card-header" id="headingfourty">
                    <h4 className="clearfix mb-0">
                        <a className="btn-3 btn-link" data-toggle="collapse"
                            data-target="#collapsefourty" aria-expanded="true"
                            aria-controls="collapsefourty">Minimum Age<i
                                className="fa fa-angle-down"></i></a>
                    </h4>
                </div>
                <div id="collapsefourty" className="collapse show"
                    aria-labelledby="headingfourty" data-parent="#accordionExample">
                    <div className="card-body">
                        <div className="topping pt-2 ">
                            <input type="checkbox" id="eighteen" name="eighteen" value="Paneer" />18 (1)
                        </div>
                        <div className="topping pt-2 ">
                            <input type="checkbox" id="twentythree" name="topping" value="Paneer" />23 (28)
                        </div>
                        <div className="topping pt-2 ">
                            <input type="checkbox" id="twentyfour" name="topping" value="Paneer" />24 (1)
                        </div>'


                    </div>
                </div>
            </div>
        </>
    )
}