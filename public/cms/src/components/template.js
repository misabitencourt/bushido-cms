import topnav from './topnav'
import menuService from '../service/menu'

export default child => createEls('div', 'app-wrp', document.body, [
    
    topnav(menuService.getMainMenu()),

    {tag: 'div', className: 'container', children: [
        {tag: 'div', className: 'p-3', bootstrap(el) {
            el.appendChild(child)
        }}
    ]}    
]);