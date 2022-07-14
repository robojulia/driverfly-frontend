import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from "next/router"
import "../../../../../utils/yup";
import { UserForm } from "../../../../../components/forms/company/UserForm";
import ChildPageLayout from "../../../../../components/layouts/ChildPageLayout";

export default function User() {
    const router = useRouter();

    let { id } = router.query;

    const backPath = "/dashboard/company/settings/users";

    if (isNaN(parseInt(id))) id = null; // create mode

    const goBack = () => {
        setTimeout(
            () => {
                router.push(backPath);

            },
            3000);
    }

  return (
    <>
        <ChildPageLayout
            title={id ? "EDIT_USER" : "CREATE_USER"}
            backPath={backPath}
        >
          <UserForm
            id={id}
            onSaveComplete={goBack}
            onLoadError={goBack}
          />
        </ChildPageLayout>
    </>
  )
};

User.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}
