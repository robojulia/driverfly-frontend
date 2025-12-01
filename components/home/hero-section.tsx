import { useTranslation } from '../../hooks/use-translation';
import HeroSearch from './hero-search';
import TrendingWords from '../trending-words/trending';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="hero-sec">
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-12">
            <div className="hero-inner">
              <h1>{t('FIND_THE_JOB_THAT_FITS_YOUR_LIFE')}</h1>
              <h3>{t('CHOOSE_FROM_THOUSANDS_OF_CDL')}</h3>
              <h3>{t('GET_HIRED_FAST')}</h3>
            </div>
            <HeroSearch />
            <TrendingWords />
          </div>
        </div>
      </div>
    </section>
  );
}
