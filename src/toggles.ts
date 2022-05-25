type ToggleProps = {
    enableAuth: boolean;
    homeTabLayout: "shifting" | "swipeable";
};


export const toggles: ToggleProps = {
    // Auth
    enableAuth: true,  // Login page shows up as first step if enableAuth: true

    // Home Layout
    homeTabLayout: "shifting"   // Controls display type for home stack bottom tab navigator
}