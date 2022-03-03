import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBRangeInput, MDBRow } from "mdbreact";

const SliderPage = () => {

    return (
      <MDBRow style={{ flexDirection: "column" }} className="my-5">
        <MDBRangeInput
          min={0}
          max={100}
          value={50}
          formClassName="w-25"
        />
        <MDBRangeInput
          min={0}
          max={100}
          value={50}
          formClassName="w-50"
        />
        <MDBRangeInput
          min={0}
          max={100}
          value={50}
          formClassName="w-75"
        />
        <MDBRangeInput
          min={0}
          max={100}
          value={50}
          formClassName="w-100"
        />
      </MDBRow>
    );
}

export default SliderPage;