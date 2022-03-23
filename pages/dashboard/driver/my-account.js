import { Container } from 'reactstrap';
import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import style from '../../../public/dashboard/styles/css/Driver/my-account.module.css';





export default function MyAccount() {

    return (
        <>
            <div className={style.account_container}>

                <div>
                    <div className='container-fluid'>
                        <form className="modal-body" >
                            <h2>Account Settings</h2>
                            <div className="row">
                                <div className="col-lg-6 col-12 mt-3">
                                    <label>Name</label>
                                    <input name="name" type="text" className="form-control" placeholder="Name" />
                                </div>
                                <div className="col-lg-6 col-12 mt-3">
                                    <label>Phone</label>
                                    <input name="phone" type="text" className="form-control" placeholder="Phone" />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-lg-6 col-12 mt-3">
                                    <label>Email</label>
                                    <input type="email" className="form-control" placeholder="E-mail" />
                                </div>
                                <div className="col-lg-6 col-12 mt-3">
                                    <label>Address</label>
                                    <input type="text" name="address" className="form-control" placeholder=" Address" />

                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-lg-6 col-12 mt-3">
                                    <label>Birthday</label>
                                    <input type="date" className="form-control" placeholder="Birthday" />
                                </div>
                                <div className="col-lg-6 col-12 mt-4 border-0 text-end">
                                    <button
                                        type="submit" className={`  ${style.update_btn}`} >

                                        Update
                                    </button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            <div className={style.info}>
                <div className='row'>
                    <div className="col-lg-6 col-12 mt-3">
                        <h2 className='my-4'>Communication Preference:</h2>
                        <span className={style.lable}>Preferred method:</span>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label">Call</label>
                            <input class="form-check-input" type="checkbox" value="Call" />
                        </div>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label" >Text</label>
                            <input class="form-check-input" type="checkbox" value="Text" />
                        </div>
                    </div>
                    <div className="col-lg-6 col-12 mt-4 border-0 text-lg-center">
                        <h2 className='my-4'>Points</h2>
                        <span>1300</span>
                        <span className={style.earn_btn}>Earn More</span>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-lg-6 col-12 mt-4 border-0">
                        <span className={style.lable}>Receive suggested job feeds? </span>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label">Yes</label>
                            <input class="form-check-input" type="checkbox" value="Yes" />
                        </div>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label" >No</label>
                            <input class="form-check-input" type="checkbox" value="No" />
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-12 mt-4 border-0">
                    <span className={style.lable}>Receive newsletters?</span>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">Yes</label>
                        <input class="form-check-input" type="checkbox" value="Yes" />
                    </div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label" >No</label>
                        <input class="form-check-input" type="checkbox" value="No" />
                    </div>
                </div>
            </div>


            <div className='row'>
                <div className="col-lg-6 col-12 mt-3">
                    <h2 className='my-4'>Sharing Preference:</h2>
                    <span className={style.lable}>Share my MVR:</span>
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Select MVR</option>
                        <option value="never">Never</option>
                        <option value="always">Always</option>
                        <option value="dependind">Depending on company</option>
                    </select>
                </div>
                <div className="col-lg-2 col-12"></div>
                <div className="col-lg-4 col-12 mt-4 border-0 ">
                    <h2 className='my-4'>Matching Preferences</h2>
                    <span className={style.lable}>Geography</span>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">OTR</label>
                        <input class="form-check-input" type="checkbox" value="OTR" />
                    </div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label" >Regional</label>
                        <input class="form-check-input" type="checkbox" value="Regional" />
                    </div>
                </div>
            </div>


            <div className='row'>
                <div className="col-lg-6 col-12 mt-3">
                    <span className={style.lable}>Share copy of my Driver’s License</span>
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Select Driver’s License</option>
                        <option value="never">Never</option>
                        <option value="always">Always</option>
                        <option value="dependind">Depending on company</option>
                    </select>
                </div>
                <div className="col-lg-2 col-12"></div>
                <div className="col-lg-4 col-12 mt-4 border-0 ">
                    <span className={style.lable}>Type:</span>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">w2</label>
                        <input class="form-check-input" type="checkbox" value="w2" />
                    </div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label" >1999:</label>
                        <input class="form-check-input" type="checkbox" value="1999" />
                    </div>
                </div>
            </div>


            <div className='row'>
                <div className="col-lg-6 col-12 mt-3">
                    <span className={style.lable}>Share copy of my Medical Card:</span>
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Select Driver’s License</option>
                        <option value="never">Never</option>
                        <option value="always">Always</option>
                        <option value="dependind">Depending on company</option>
                    </select>
                </div>
                <div className="col-lg-2 col-12"></div>
                <div className="col-lg-4 col-12 mt-4 border-0 ">
                    <span className={style.lable}>Min Pay Requirements*:</span>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">Min Pay Requirements*</label>
                        <input class="form-check-input" type="checkbox" value="Min Pay Requirements*" />
                    </div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">Pay Method:</label>
                        <input class="form-check-input" type="checkbox" value="Pay Method" />
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className="col-lg-6 col-12 mt-3">
                    <span className={style.lable}>Authorize companies to contact my past employers:</span>
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Select Driver’s License</option>
                        <option value="never">Never</option>
                        <option value="always">Always</option>
                        <option value="dependind">Depending on company</option>
                    </select>
                </div>
                <div className="col-lg-2 col-12"></div>
                <div className="col-lg-4 col-12 mt-4 border-0 ">
                    <span className={style.lable}>Min Pay Requirements*:</span>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">Required Benefits:</label>
                        <input class="form-check-input" type="checkbox" value="Required Benefits:
" />
                    </div>
                </div>
            </div>


        </>
    )
};


MyAccount.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
