import { SET_SEARCH, UPDATE_SEARCH_TERM } from '../actions/types';
const initialState = {
    searchTerm: "", 
    searchTermUpdated: ""
};

export default function(state = initialState, action) {
    const { type, payload } = action
    switch(type) {
        case SET_SEARCH: 
            return {
                ...state,
                searchTerm: payload
            }
        case UPDATE_SEARCH_TERM:
            return {
                ...state,
                searchTermUpdated: payload
            }
        default:
            return state;
    }
}