import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Device: a
    .model({
      name: a.string().required(),
      imei: a.string().required(),
      status: a.enum(['ACTIVE', 'INACTIVE']),
    })
    .authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
