import topnav from './topnav'
import menuService from '../service/menu'

export default (child, currentMenuId = '') => {
    const menus = menuService.getMainMenu();
    const currentMenu = menus.find(m => m.id === currentMenuId);
    
    if (currentMenu) {
        currentMenu.active = true;
    }

    return createEls('div', 'app-wrp', document.body, [    
        topnav(menus),    
        {tag: 'div', className: 'container', children: [
            {tag: 'div', className: 'p-3', bootstrap(el) {
                el.appendChild(child)
            }}
        ]}    
    ])
}