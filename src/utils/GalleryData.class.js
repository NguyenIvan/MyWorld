import { http } from "./myworld.utils";

class GalleryDataClass {
  
  getAll() {
    return http.get("gallery/");
  }

  get(id) {
    return http.get(`gallery/${id}`);
  }

  create(data) {
    return http.post("gallery/", data);
  }

  delete(id) {
    return http.delete(`gallery/${id}`);
  }

}

const GalleryData = new GalleryDataClass();

export default GalleryData;
