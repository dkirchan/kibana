/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { z } from 'zod';

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator `yarn openapi:generate`.
 */

import { BaseActionSchema } from '../model/schema/common.gen';

export type FileUploadActionRequestBody = z.infer<typeof FileUploadActionRequestBody>;
export const FileUploadActionRequestBody = BaseActionSchema.and(
  z.object({
    parameters: z.object({
      overwrite: z.boolean().optional().default(false),
    }),
    file: z.string(),
  })
);
