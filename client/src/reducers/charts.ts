import { ChartActions, ActionTypes } from "./../actions/types";
export interface BudgetStats {
	_id: {
		month: number;
		year: number;
	};
	income: number;
	expense: number;
	balance: number;
}

export interface BudgetCategoryData {
	_id: {
		month: number;
		year: number;
		category: number;
	};
	income: number;
	expense: number;
}

export interface BudgetDates {
	_id: {
		year: number;
	};
	months: number[];
}

export interface ChartStoreState {
	barGraph: BudgetStats[];
	pieGraph: BudgetCategoryData[];
	dates: BudgetDates[];
}

export const initialState: ChartStoreState = {
	barGraph: [],
	pieGraph: [],
	dates: []
};

export const chartReducer = (state = initialState, action: ChartActions) => {
	switch (action.type) {
		case ActionTypes.getDates:
			return { ...state, dates: action.payload };
		case ActionTypes.getStats:
			return { ...state, barGraph: action.payload };
		case ActionTypes.getCategoryData:
			return { ...state, pieGraph: action.payload };
		case ActionTypes.logoutUser:
			return initialState;

		default:
			return state;
	}
};
