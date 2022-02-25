export default function Schedule() {

    return (
        <>
            <div className="card">
                <div className="card-header" id="headingSix">
                    <h4 className="clearfix mb-0">
                        <a className="btn-3 btn-link" data-toggle="collapse"
                            data-target="#collapseSchedule" aria-expanded="true"
                            aria-controls="collapseSchedule">Schedule <i
                                className="fa fa-angle-down"></i></a>
                    </h4>
                </div>
                <div id="collapseSchedule" className="collapse show" aria-labelledby="headingSix"
                    data-parent="#accordionExample">
                    <div className="card-body">
                        <div className="App">
                            <div className="topping pt-2">
                                <input type="radio" id="lasthour" name="areas" value="Paneer" />Multiple weeks on the road (6)
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="hour" name="areas" value="Paneer" />Most weekends off (2)
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="lasthour" name="areas" value="Paneer" />Weekends off (7)
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="hour" name="areas" value="Paneer" />Other (12)
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}