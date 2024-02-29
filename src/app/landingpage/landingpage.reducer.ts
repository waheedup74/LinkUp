import * as LandActions from "./landingpage.actions";

const initialState = {
    groupsData: [
        { 'groupName': 'firebite', 'groupDesc': '... nothing ...', 'createdAt': new Date() },
        { 'groupName': 'dreamgames', 'groupDesc': '... nothing ...', 'createdAt': new Date() },
        { 'groupName': 'talksns', 'groupDesc': '... nothing ...', 'createdAt': new Date() },
        { 'groupName': 'bitefiregames', 'groupDesc': '... nothing ...', 'createdAt': new Date() },
        { 'groupName': 'games', 'groupDesc': '... nothing ...', 'createdAt': new Date() },
        { 'groupName': 'arcade games', 'groupDesc': '... nothing ...', 'createdAt': new Date() },
        { 'groupName': 'websites', 'groupDesc': '... nothing ...', 'createdAt': new Date() },
        { 'groupName': 'top websites', 'groupDesc': '... nothing ...', 'createdAt': new Date() },
        { 'groupName': 'android games', 'groupDesc': '... nothing ...', 'createdAt': new Date() },
        { 'groupName': 'web technologies', 'groupDesc': '... nothing ...', 'createdAt': new Date() },
    ]
};

export function landingpageReducer(state = initialState, action: LandActions.groupActions) {

    switch(action.type){
        case LandActions.ADD_GROUP:
            return {
                ...state, groupsData: [...state.groupsData, action.payload]
            };
    }
}