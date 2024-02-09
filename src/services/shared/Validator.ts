import { error } from 'console';
import { SpaceEntry } from '../model/Model';

// Personalized data validation error
export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Value for ${missingField} expected!`);
  }
}

// Personalized validation function
export function validateAsSpaceEntry(arg: any) {
  if ((arg as SpaceEntry).id === undefined) throw new MissingFieldError('id');
  if ((arg as SpaceEntry).location === undefined)
    throw new MissingFieldError('location');
  if ((arg as SpaceEntry).name === undefined)
    throw new MissingFieldError('name');
}

// JSON validation for db data entry
export class JsonError extends Error {}