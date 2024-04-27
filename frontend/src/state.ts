import { Action, action, createStore } from "easy-peasy";

export type Milestone = {
    id?: number;
    goal: number;
    desc: string;
}

export type StoreModel = {
    // state
    donations: number;
    milestones: Milestone[];

    // actions
    addDonation: Action<StoreModel, number>;
    setDonation: Action<StoreModel, number>;
    setMilestones: Action<StoreModel, Milestone[]>;
}

const milestones = [
    {
        goal: 20,
        desc: "Something something"
    },
    {
        goal: 30,
        desc: "WHAT"
    },
    {
        goal: 50,
        desc: "burn the garden"
    }
]

const model: StoreModel = {
    donations: 0,
    milestones: milestones,
    addDonation: action((state, payload) => {
        state.donations += payload;
    }),
    setDonation: action((state, payload) => {
        state.donations = payload;
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