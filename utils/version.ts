export interface BuildInfo {
  version: string;
  buildTime: string;
  environment: string;
}

export const getBuildInfo = (): BuildInfo => {
  return {
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'dev',
    buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  };
};
