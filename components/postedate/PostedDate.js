export default function DatePosted() {
    return (
        <>
            <div className="card">
                <div className="card-header" id="headingSix">
                    <h4 className="clearfix mb-0">
                        <a className="btn-3 btn-link" data-toggle="collapse"
                            data-target="#collapseSix" aria-expanded="true"
                            aria-controls="collapseSix">Date Posted <i
                                className="fa fa-angle-down"></i></a>
                    </h4>
                </div>
                <div id="collapseSix" className="collapse show" aria-labelledby="headingSix"
                    data-parent="#accordionExample">
                    <div className="card-body">
                        <div className="App">
                            <div className="topping pt-2">
                                <input type="radio" id="lasthour" name="topping" value="Paneer" />Last Hour
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="hour" name="topping" value="Paneer" />Last 24 Hour
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="topping" name="topping" value="Paneer" />Last 7 days
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="topping" name="topping" value="Paneer" /> Last 14 days
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="topping" name="topping" value="Paneer" />Last 30 days
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="topping" name="topping" value="Paneer" />All
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}