/**
 * Script to delete specific job listings
 *
 * This script will search for and delete the following jobs:
 * 1. OTR - CDL A by khuramk@Codeupscale in Modi ea in ipsum a t, AR
 * 2. OTR Driver needed by G Trucking in Spain, AL
 */

import JobApi from '../pages/api/job';
import { JobEntity } from '../models/job/job.entity';

async function deleteSpecificJobs() {
  const jobApi = new JobApi();

  try {
    console.log('Fetching all jobs...');

    // Fetch all jobs
    const allJobs = await jobApi.list({ is_paginated: false }) as JobEntity[];

    console.log(`Found ${allJobs.length} total jobs`);

    // Find jobs to delete
    const jobsToDelete: JobEntity[] = [];

    for (const job of allJobs) {
      // Check for first job: OTR - CDL A by khuramk@Codeupscale
      if (
        job.title?.includes('OTR') &&
        job.title?.includes('CDL A') &&
        job.company?.name?.includes('khuramk@Codeupscale')
      ) {
        jobsToDelete.push(job);
        console.log(`Found job to delete: ID ${job.id} - ${job.title} by ${job.company?.name}`);
      }

      // Check for second job: OTR Driver needed by G Trucking in Spain, AL
      if (
        job.title?.includes('OTR Driver needed') &&
        job.company?.name?.includes('G Trucking') &&
        (job.location?.city?.includes('Spain') || job.location?.state?.includes('AL'))
      ) {
        jobsToDelete.push(job);
        console.log(`Found job to delete: ID ${job.id} - ${job.title} by ${job.company?.name}`);
      }
    }

    if (jobsToDelete.length === 0) {
      console.log('No matching jobs found to delete.');
      return;
    }

    console.log(`\nFound ${jobsToDelete.length} job(s) to delete:`);
    jobsToDelete.forEach(job => {
      console.log(`  - ID: ${job.id}`);
      console.log(`    Title: ${job.title}`);
      console.log(`    Company: ${job.company?.name}`);
      console.log(`    Location: ${job.location?.city}, ${job.location?.state}`);
      console.log('');
    });

    // Delete the jobs
    console.log('Deleting jobs...');
    for (const job of jobsToDelete) {
      try {
        await jobApi.remove(job.id);
        console.log(`✓ Successfully deleted job ID ${job.id} - ${job.title}`);
      } catch (error) {
        console.error(`✗ Failed to delete job ID ${job.id}:`, error.message);
      }
    }

    console.log('\nDeletion process complete!');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
deleteSpecificJobs();
