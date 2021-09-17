
class MyArtClass {
  constructor(id, name, price, uri) {
    this.id = id
    this.name = name
    this.price = price || 0
    this.uri = uri
  }

  get type() {
    return "MyArt"
  }
}

export default MyArtClass

