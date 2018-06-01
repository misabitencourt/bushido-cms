import template from './template';

export default appEl => {
    const wrpEl = document.createElement('div');

    createEls('div', 'home-page', wrpEl, [
        {tag: 'h1', textContent: 'Bem vindo'},
        {tag: 'p', textContent: 'Através deste sistema você poderá modificar as informações que serão exibidas no website.'},
        {tag: 'p', textContent: 'Utilize a ferramenta com prudência.'}
    ]);

    appEl.appendChild(template(wrpEl, 'home'));
}