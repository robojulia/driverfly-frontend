import { EducationLevel } from '../../enums/users/education-level.enum';
import { JobEmploymentType } from '../../enums/jobs/job-employment-type.enum';
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import { JobEntity } from '../../models/job/job.entity';

/**
 * @typedef StructuredDataProps
 * @property {"JobPosting"} type
 * @property {object} data
 */

/**
 *
 * @param {StructuredDataProps} props
 * @returns
 */
export default function StructuredData(props) {
  const data = {
    '@context': 'https://schema.org',
    '@type': props.type,
    ...props.data,
  };

  return <script type="application/ld+json">{JSON.stringify(data, null, 2)}</script>;
}

/**
 *
 * @param {JobEntity} job
 */
StructuredData.JobPosting = (job, t) => {
  // https://developers.google.com/search/docs/advanced/structured-data/job-posting#technical-guidelines
  const data = {
    title: job.title,
    description: `<p>${job.description}</p>`,
    identifier: {
      '@type': 'PropertyValue',
      name: 'JobEntity',
      value: job?.id?.toString(),
    },
    datePosted: job.created_at,
    directApply: true,
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.min_weekly_pay,
        maxValue: job.max_weekly_pay,
        unitText: 'WEEK',
      },
    },
    applicantLocationRequirements: [
      {
        '@type': 'Country',
        name: 'USA',
      },
    ],
  };

  if (job.company) {
    data.hiringOrganization = {
      '@type': 'Organization',
      name: job.company.name,
      sameAs: job.company.website,
      logo: `${process.env.NEXT_PUBLIC_BASE_URL_API}/documents/company/${job.company.id}/photo`,
    };
  }

  if (job.location) {
    data.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: job.location.street,
        addressLocality: job.location.city,
        addressRegion: job.location.state,
        postalCode: job.location.zip_code,
        addressCountry: 'US',
      },
    };

    data.applicantLocationRequirements.push({
      '@type': 'GeoCircle',
      address: {
        '@type': 'PostalAddress',
        streetAddress: job.location.street,
        addressLocality: job.location.city,
        addressRegion: job.location.state,
        postalCode: job.location.zip_code,
        addressCountry: 'US',
      },
      // for now, just push in the address of the job location with a radius in meters
      // geoMidpoint: {
      //     "@type": "GeoCoordinates",
      //     latitude: job.location.latitude,
      //     longitude: job.location.longitude,
      // },
      geoRadius: job.max_applicant_radius * 1609.34,
    });
  }

  if (job.expiry_date) data.validThrough = job.expiry_date;

  /**
        FULL_TIME
        PART_TIME
        CONTRACTOR
        TEMPORARY
        INTERN
        VOLUNTEER
        PER_DIEM
        OTHER
    */

  switch (job.employment_type) {
    case JobEmploymentType.CONTRACT:
      data.employmentType = 'CONTRACTOR';
      break;
    case JobEmploymentType.ONE_TIME_GIG:
      data.employmentType = 'TEMPORARY';
      break;
    case JobEmploymentType.OWNER_OPERATOR:
      break;
    case JobEmploymentType.PART_TIME:
      data.employmentType = 'PART_TIME';
      break;
    case JobEmploymentType.SEASONAL:
      data.employmentType = 'TEMPORARY';
      break;
    case JobEmploymentType.W2:
      data.employmentType = 'FULL_TIME';
      break;
  }

  if (job.min_degree) {
    /*
high school
associate degree
bachelor degree
professional certificate
postgraduate degree
        */
    data.educationRequirements = [];

    const educationalRequirements = [];

    switch (job.min_degree) {
      case EducationLevel.DOCTORAL:
        educationalRequirements.push('postgraduate degree');
        break;
      case EducationLevel.ASSOCIATE:
        educationalRequirements.push('associate degree');
        break;
      case EducationLevel.BACHELOR:
        educationalRequirements.push('bachelor degree');
        break;
      case EducationLevel.MASTER:
        // todo: determine master education requirements type.
        break;
      case EducationLevel.HIGH_SCHOOL:
        educationalRequirements.push('high school');
        break;
    }

    educationalRequirements.forEach((v) => {
      data.educationRequirements.push({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: v,
      });
    });

    if (data.educationalRequirements?.length == 0) delete data.educationRequirements;
    else if (data.educationRequirements?.length == 1)
      data.educationRequirements = data.educationRequirements[0];
  }

  {
    data.experienceRequirements = [];

    if (job.min_years_experience) {
      data.experienceRequirements.push({
        '@type': 'OccupationalExperienceRequirements',
        monthsOfExperience: job.min_years_experience * 12,
      });
    }

    if (job.required_skills?.length > 0) {
      job.required_skills.forEach((e) => {
        data.experienceRequirements.push({
          '@type': 'OccupationalExperienceRequirements',
          monthsOfExperience: e.years * 12,
          name:
            e.type == JobEquipmentType.OTHER
              ? job.required_skills_other
              : t(`JobEquipmentType.${e.type}`),
          identifier: e.type,
        });
      });
    }

    if (data.experienceRequirements?.length == 0) delete data.experienceRequirements;
    else if (data.experienceRequirements?.length == 1)
      data.experienceRequirements = data.experienceRequirements[0];
  }

  return data;
};
