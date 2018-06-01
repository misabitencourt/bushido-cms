let currentUser;

export default function getCurrentUser() {
    if (! currentUser) {
        currentUser = JSON.parse(sessionStorage.user);
    }

    return currentUser;
}