import {
  AuthenticationProgramStateCommon,
  ErrorState,
  StackState
} from '../../state';
import { Operation } from '../../virtual-machine';

import {
  combineOperations,
  pushToStack,
  useTwoStackItems
} from './combinators';
import { opVerify } from './flow-control';
import { OpcodesCommon } from './opcodes';
import { booleanToScriptNumber } from './types';

const areEqual = (a: Uint8Array, b: Uint8Array) => {
  // tslint:disable-next-line:no-if-statement
  if (a.length !== b.length) {
    return false;
  }
  // tslint:disable-next-line:no-let
  for (let i = 0; i < a.length; i++) {
    // tslint:disable-next-line:no-if-statement
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

export const opEqual = <
  State extends StackState & ErrorState<Errors>,
  Errors
>(): Operation<State> => (state: State) =>
  useTwoStackItems(state, (nextState, element1, element2) =>
    pushToStack(nextState, booleanToScriptNumber(areEqual(element1, element2)))
  );

export const opEqualVerify = <
  State extends StackState & ErrorState<Errors>,
  Errors
>(): Operation<State> =>
  combineOperations(opEqual<State, Errors>(), opVerify<State, Errors>());

export const bitwiseOperations = <
  Opcodes,
  State extends AuthenticationProgramStateCommon<Opcodes, Errors>,
  Errors
>() => ({
  [OpcodesCommon.OP_EQUAL]: opEqual<State, Errors>(),
  [OpcodesCommon.OP_EQUALVERIFY]: opEqualVerify<State, Errors>()
});