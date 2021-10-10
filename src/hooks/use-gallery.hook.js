import { useEffect, useReducer } from 'react'
import GalleryData from '../utils/GalleryData.class'
// import MyArtClass from '../utils/MyArtClass'
import { defaultReducer } from '../reducer/defaultReducer'

export default function useGallery() { /* Stateful function  to get methods and properties of user */

  const [state, dispatch] = useReducer(defaultReducer, {
    loading: false,
    error: false,
    data: [] // data will be renamed 
  })

  const fetchGallery = async () => {
    dispatch({ type: 'PROCESSING' })
    try {
      // here  
      GalleryData.getAll()
        .then(res => {
          dispatch({ type: 'SUCCESS', payload: res.data });
        })
        .catch(e => {
          console.log(e);
          dispatch({ type: 'ERROR' });
        })

      // let myarts = Object.keys(res).map(key => {
      //   return new MyArtClass(key, res[key].name, res[key].price, res[key].uri) // TODO: should be wantPrice, remove bellow
      // })

    } catch (err) {
      console.log(err);
      dispatch({ type: 'ERROR' })
    }
  }
  
  useEffect(() => { 
 
    fetchGallery()
    //eslint-disable-next-line

  }, [])

  return {
    ...state,
    fetchGallery
  }

}
