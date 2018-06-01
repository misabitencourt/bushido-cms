import menus from '../common/menus';

export default (el, children) => createEls('div', 'app-wrp', el, [
    
    // TODO menu
    {tag: 'nav', className: 'navbar navbar-dark bg-dark', children: [
        {tag: 'div', className: 'collapse navbar-collapse', children: [
            {tag: 'ul', className: 'navbar-nav mr-auto', children: menus.map(menu => {
                return {tag: 'li', className: 'nav-item', children: [
                    {tag: 'a', className: 'nav-link', attrs: {href: menu.href}, textContent: menu.name}
                ], bootstrap: el => el.dataset.menu = menu.id}
            })}
        ]}
    ]},


    {tag: 'div', className: 'container mt-3', children: children}

]);



/*

<div class="collapse navbar-collapse" id="navbarText">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Features</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Pricing</a>
      </li>
    </ul>
    <span class="navbar-text">
      Navbar text with an inline element
    </span>
  </div>

*/