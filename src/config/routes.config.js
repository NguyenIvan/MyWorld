import Collection from '../pages/Collection.page'
import Gallery from '../pages/Gallery.page'
import Artists from '../pages/Artists.page'
import Home from '../pages/Home.page'

export const ROUTES = [
  { name: "Home", path: "/", component: Home, nav: true },
  { name: "Gallery", path: "/gallery", component: Gallery, nav: true },
  { name: "Collection", path: '/collection', component: Collection, nav: true },
  { name: "Artists", path: '/artists', component: Artists, nav: true },

]

export const NAV_ROUTES = ROUTES.filter(r => r.nav)