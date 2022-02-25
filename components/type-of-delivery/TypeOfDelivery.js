export default function TypeOfDelivery() {
    return (
        <>
            <div className="card">
                <div className="card-header" id="headingSix">
                    <h4 className="clearfix mb-0">
                        <a className="btn-3 btn-link" data-toggle="collapse"
                            data-target="#collapseTypeofDelivery" aria-expanded="true"
                            aria-controls="collapseTypeofDelivery">Type of Delivery <i
                                className="fa fa-angle-down"></i></a>
                    </h4>
                </div>
                <div id="collapseTypeofDelivery" className="collapse show" aria-labelledby="headingSix"
                    data-parent="#accordionExample">
                    <div className="card-body">
                        <div className="App">
                            <div className="topping pt-2">
                                <input type="checkbox" id="lasthour" name="areas" value="Paneer" />Touch (1)
                            </div>
                            <div className="topping pt-2">
                                <input type="checkbox" id="hour" name="areas" value="Paneer" />No Touch (1)
                            </div>
                            <div className="topping pt-2">
                                <input type="checkbox" id="lasthour" name="areas" value="Paneer" />Drop-and-hook (6)
                            </div>
                            <div className="topping pt-2">
                                <input type="checkbox" id="hour" name="areas" value="Paneer" />Dedicated Lanes (1)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}