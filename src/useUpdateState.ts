import { useState, useCallback, SetStateAction, Dispatch } from 'react';
import useRefCallback from './useRefCallback';
import useUpdatedRef from './useUpdatedRef';

export type StateGetter<E, S> = (wrappedOrValue: E) => S;

export type UpdateState<E> = (wrappedOrValue: E) => void;

export function getValue<S>(wrappedOrValue: { value: S } | S): S {
  if (typeof wrappedOrValue === 'object' && 'value' in wrappedOrValue) return wrappedOrValue.value;
  // Do not throw error because `S` may be an `object` type or any simple type.
  return wrappedOrValue;
}

export default function useUpdateState<S, E = { value: S } | S>(
  initialState: S | (() => S),
  stateGetter: StateGetter<E, S> = getValue as StateGetter<E, S>
): [getState: () => S, setState: Dispatch<SetStateAction<S>>, updateState: UpdateState<E>] {
  const [state, setState] = useState(initialState);
  const stateRef = useUpdatedRef(state);

  const updateState = useRefCallback<UpdateState<E>>((event) => setState(stateGetter(event)));

  const getState = useCallback(() => stateRef.current, [stateRef]);

  return [getState, setState, updateState];
}
