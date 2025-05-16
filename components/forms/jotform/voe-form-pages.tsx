import { AccidentHistory, EmployedByUs, IntroPage, SubmissionDetails } from './voe-forms';
import { VoeThankYouPage } from './thankyou-screen/voe-thank-you';

export const VoeFormPages = {
  0: IntroPage,
  1: EmployedByUs,
  2: AccidentHistory,
  3: SubmissionDetails,
  4: VoeThankYouPage,
};

export function VoeFormPageControl({ steps }: { steps: number }): JSX.Element {
  const CurrentPage = VoeFormPages[steps];
  return <CurrentPage />;
}
