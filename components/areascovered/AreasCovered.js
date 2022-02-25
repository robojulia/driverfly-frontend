export default function AreasCovered() {
    return (
        <>
            <div className="card">
                <div className="card-header" id="headingNine">
                    <h4 className="clearfix mb-0">
                        <a className="btn-3 btn-link" data-toggle="collapse"
                            data-target="#collapseNine" aria-expanded="true"
                            aria-controls="collapseNine">Areas Covered<i
                                className="fa fa-angle-down"></i></a>
                    </h4>
                </div>
                <div id="collapseNine" className="collapse show"
                    aria-labelledby="headingNine" data-parent="#accordionExample">
                    <div className="card-body">
                        <div className="App">
                            <div className="topping pt-2">
                                <input type="checkbox" id="lasthour" name="areas" value="Paneer" /> Local(5)
                            </div>
                            <div className="topping pt-2">
                                <input type="checkbox" id="hour" name="areas" value="Paneer" /> Regional(7)
                            </div>
                            <div className="topping pt-2">
                                <input type="checkbox" id="topping" name="areas" value="Paneer" /> OTR (12)
                            </div>
                            <div className="topping pt-2">
                                <input type="checkbox" id="topping" name="areas" value="Paneer" />  CrossBorder (1)
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}