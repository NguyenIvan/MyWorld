import { http } from "./myworld.utils";

class GalleryDataClass {
  
  getAll() {
    return http.get("/");
  }

  get(id) {
    return http.get(`/${id}`);
  }

  create(data) {
    return http.post("/", data);
  }

  delete(id) {
    return http.delete(`/${id}`);
  }

}

const GalleryData = new GalleryDataClass();

export default GalleryData;
