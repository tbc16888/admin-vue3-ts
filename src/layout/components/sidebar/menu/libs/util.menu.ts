// 创建 el-menu-item
export function elMenuItem (createElement, menu) {
  return createElement('el-menu-item', { props: { index: (menu.name || '')} }, [
    ...menu.icon ? [
      createElement('i', { attrs: { class: `iconfont ${menu.icon}` } })
    ] : [],
    createElement('span', { slot: 'title' }, menu.title || '未命名菜单')
  ])
}

// 创建 el-submenu
export function elSubmenu (createElement, menu) {
  return createElement('el-submenu', { props: { index: (menu.name ? menu.name:'') + ':' + menu.path } }, [
    ...menu.icon ? [
      createElement('i', { slot: 'title', attrs: { class: `iconfont ${menu.icon}` } })
    ] : [],
    createElement('span', { slot: 'title' }, menu.title || '未命名菜单'),
    ...menu.children.map((child) => (child.children === undefined ? elMenuItem : elSubmenu).call(this, createElement, child))
  ])
}
