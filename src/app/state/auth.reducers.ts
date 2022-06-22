import { createReducer, on } from "@ngrx/store";
import { User } from "../models/user";
import { AuthActionTypes} from "./auth.actions";


export interface IState {
  isAuthenticated: boolean;
  user: User | null;
  error: any;
}

export const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
};

export function reducer(state = initialState, action: any): IState {
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        user: {
          username: action.payload.username,
          password: action.payload.password
        },
        error: null
      };
    }

    case AuthActionTypes.LOGIN_ERROR: {
      return {
        ...state,
        error: 'Invalid User/Password'
      };
    }

    case AuthActionTypes.LOGOUT: {
      return initialState ;
    }

    default: {
      return state;
    }
  }
}


