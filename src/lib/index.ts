// place files you want to imp

const URL = import.meta.env.VITE_URL;

/**
 * @param {string} url
 */
export function customRedirect(route: any) {
    window.location.href = URL + route;
}