import { mapEnumToOptions } from '@abp/ng.core';

export enum Status {
  New = 0,
  Open = 1,
  Close = 2,
}

export const statusOptions = mapEnumToOptions(Status);
