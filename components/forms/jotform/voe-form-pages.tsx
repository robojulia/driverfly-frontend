import { ThankyouPage } from "./thankyou-screen";
import { AccidentHistory, EmployedByUs, IntroPage, SubmissionDetails } from "./voe-forms";

export const VoeFormPages = {
    0: IntroPage,
    1: EmployedByUs,
    2: AccidentHistory,
    3: SubmissionDetails,
    4: ThankyouPage
}

export function VoeFormPageControl({ steps }: { steps: number }): JSX.Element {
    const CurrentPage = VoeFormPages[steps];
    return <CurrentPage />;
}
