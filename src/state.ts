import { Action, action, createStore } from "easy-peasy";

type Milestone = {
    goal: number;
    desc: string;
}

export type StoreModel = {
    // state
    donations: number;
    milestones: Milestone[];

    // actions
    addDonation: Action<StoreModel, number>;
    setMilestones: Action<StoreModel, Milestone[]>;
}

const model: StoreModel = {
    donations: 0,
    milestones: [],
    addDonation: action((state, payload) => {
        state.donations += payload;
    }),

    setMilestones: action((state, payload) => {
        state.milestones = payload;
    })
}

const store = createStore<StoreModel>(model)

// Set up hot reloading
// https://easy-peasy.vercel.app/docs/recipes/hot-reloading.html
if (import.meta.env.NODE_ENV === "development") {
    if (module.hot) {
      module.hot.accept("./model", () => {
        store.reconfigure(model);
      });
    }
}

export default store;