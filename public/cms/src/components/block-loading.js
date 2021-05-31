window.rawFetch = window.fetch;

let loadingEl;

const loadingSvg = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgb(241, 242, 243); display: block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
<g transform="translate(20 20)">
<rect x="-15" y="-15" width="30" height="30" fill="#084f5a">
<animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.4s"></animateTransform>
</rect></g>
<g transform="translate(50 20)">
<rect x="-15" y="-15" width="30" height="30" fill="#38737f">
<animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.3s"></animateTransform>
</rect></g>
<g transform="translate(80 20)">
<rect x="-15" y="-15" width="30" height="30" fill="#6099a5">
<animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.2s"></animateTransform>
</rect></g>
<g transform="translate(20 50)">
<rect x="-15" y="-15" width="30" height="30" fill="#38737f">
<animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.3s"></animateTransform>
</rect></g>
<g transform="translate(50 50)">
<rect x="-15" y="-15" width="30" height="30" fill="#6099a5">
<animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.2s"></animateTransform>
</rect></g>
<g transform="translate(80 50)">
<rect x="-15" y="-15" width="30" height="30" fill="#88c3cf">
<animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.1s"></animateTransform>
</rect></g>
<g transform="translate(20 80)">
<rect x="-15" y="-15" width="30" height="30" fill="#6099a5">
<animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.2s"></animateTransform>
</rect></g>
<g transform="translate(50 80)">
<rect x="-15" y="-15" width="30" height="30" fill="#88c3cf">
<animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.1s"></animateTransform>
</rect></g>
<g transform="translate(80 80)">
<rect x="-15" y="-15" width="30" height="30" fill="#c2edf7">
<animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="0s"></animateTransform>
</rect></g>
</svg>`;

function hideLoading() {
    if (loadingEl && loadingEl.parentElement) {
        loadingEl.parentElement.removeChild(loadingEl);
    }
}

function showLoading() {
    loadingEl = document.createElement('div');
    loadingEl.style.position = 'fixed';
    loadingEl.style.top = loadingEl.style.left = '0';
    loadingEl.style.height = loadingEl.style.width = '100%';
    loadingEl.style.zIndex = '9999';
    loadingEl.style.display = 'flex';
    loadingEl.style.justifyContent = loadingEl.style.alignItems = 'center';
    loadingEl.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    loadingEl.innerHTML = loadingSvg;
    document.body.appendChild(loadingEl);
}

window.fetch = (p1, p2, p3) => {
    return (new Promise((resolve, reject) => {
        showLoading();
        window.rawFetch(p1, p2, p3).then(response => {
            hideLoading();
            resolve(response);
        }).catch(err => {
            hideLoading();
            reject(err);
        })
    }));
}