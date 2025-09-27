// utils/getTitleFromMenu.js
import menuItems from 'menu-items';

const findTitleByUrl = (items, path) => {
  for (const item of items) {
    if (item.type === 'item' && item.url === path) {
      return item.title;
    }

    if (item.children) {
      const title = findTitleByUrl(item.children, path);
      if (title) return title;
    }
  }
  return null;
};

export default findTitleByUrl;
