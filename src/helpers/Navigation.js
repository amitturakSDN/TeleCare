import * as RootNavigation from '@/navigation/RootNavigation';

const navigate = (screen) => {
    RootNavigation.navigate(screen)
}

/**
 * hideNavigation
 * This is used to hide the bottom navigation bar, particularily
 * during Zoom video sessions, to prevent the user from navigating
 * off the zoom session without leaving it first, so they can re-join
 * if necessary.
 * This could be used for other purposes
 * @param {navigation component} navigation 
 */
const hideNavigation = (navigation) => {
    // hide navigation at bottom of the page once the session is joined
    let parent = navigation.getParent("mainNav");
    let route = parent?.getState().routes[0];
    route.props = {"display": "none"};
    // navigation will hide on re-render.
}

/**
 * showNavigation
 * This is used to show the bottom navigation bar, particularily
 * during after Zoom video sessions, or during an error joining a 
 * video session,etc 
 * This could be used for other purposes and is the logical reverse
 * of hideNavigation
 * @param {navigation component} navigation 
 */
const showNavigation = (navigation) => {
    // get bottom nav, and remove display:none property to reveal it again
    let parent = navigation.getParent("mainNav");
    let route = parent?.getState().routes[0];
    route.props = null;
    // on re-render, navigation will redisplay.
}

export const NavigationHelper = { navigate, hideNavigation, showNavigation } 