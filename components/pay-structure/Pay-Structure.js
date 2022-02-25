export default function PayStructure() {

    return (
        <>
            <div className="card">
                <div className="card-header" id="headingFour">
                    <h4 className="clearfix mb-0">
                        <a className="btn-3 btn-link" data-toggle="collapse"
                            data-target="#collapseFour" aria-expanded="true"
                            aria-controls="collapseFour">Pay Structure <i
                                className="fa fa-angle-down"></i></a>
                    </h4>
                </div>
                <div id="collapseFour" className="collapse show"
                    aria-labelledby="headingFour" data-parent="#accordionExample">
                    <div className="card-body">
                        <div className="App">
                            <div className="topping pt-2">
                                <input type="checkbox" id="topping" name="topping" value="Paneer" />Rate per mile (8)
                            </div>
                            <div className="topping pt-2">
                                <input type="checkbox" id="topping" name="topping" value="Paneer" />Percent per move (5)
                            </div>
                            <div className="topping pt-2">
                                <input type="checkbox" id="topping" name="topping" value="Paneer" />Hourly (3)
                            </div>
                            <div className="topping pt-2">
                                <input type="checkbox" id="topping" name="topping" value="Paneer" />Set Weekly (6)
                            </div>
                            <div className="topping pt-2">
                                <input type="checkbox" id="topping" name="topping" value="Paneer" />Salaried (2)
                            </div>
                            <div className="topping pt-2 ">
                                <input type="checkbox" id="topping" name="topping" value="Paneer" />Percent weight (1)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}