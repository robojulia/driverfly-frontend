export default function Salary() {
    return (
        <>
            <div className="card">
                <div className="card-header" id="headingFive">
                    <h4 className="clearfix mb-0">
                        <a className="btn-3 btn-link" data-toggle="collapse"
                            data-target="#collapseFive" aria-expanded="true"
                            aria-controls="collapseFive">Salary <i
                                className="fa fa-angle-down"></i></a>
                    </h4>
                </div>
                <div id="collapseFive" className="collapse show"
                    aria-labelledby="headingFive" data-parent="#accordionExample">
                    <div className="card-body">
                        <div className="App">
                            <div className="topping pt-2">
                                <input type="radio" id="monthly" name="salry" value="Paneer" />Monthly
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="weekly" name="salry" value="Paneer" />Weekly
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="daily" name="salry" value="Paneer" />Daily
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="hourly" name="salry" value="Paneer" />Hourly
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="yearly" name="salry" value="Paneer" />Yearly
                            </div>
                        </div>

                        <div className="rangeslider mt-3 p-0">
                            <input className="min" name="range_1" type="range" min="1"
                                max="95000" value="18" />
                            <input className="max" name="range_1" type="range" min="1"
                                max="95000" value="95000" />
                            <span className="range_min light left">$18 </span>
                            <span className="range_max light right">95000 </span>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}