import * as types from '@babel/types';
import { STR_CONSTRUCTOR } from './constants';

export default function createConstructor() {
  return types.classMethod(
    STR_CONSTRUCTOR,
    types.identifier(STR_CONSTRUCTOR),
    [],
    types.blockStatement([])
  );
}
