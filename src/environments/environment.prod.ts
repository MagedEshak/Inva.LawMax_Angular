import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44330/',
  redirectUri: baseUrl,
  clientId: 'LawMax_App',
  responseType: 'code',
  scope: 'offline_access LawMax',
  requireHttps: true,
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'LawMax',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44330',
      rootNamespace: 'Inva.LawMax',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
  remoteEnv: {
    url: '/getEnvConfig',
    mergeStrategy: 'deepmerge'
  }
} as Environment;
