
class MyArtClass {
  constructor(id, name, price) {
    this.id = id
    this.name = name
    this.price = price || 0
  }

  get type() {
    return "MyArt"
  }
}

export default MyArtClass

