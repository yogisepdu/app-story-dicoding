import { getData } from "../data/api";

export default class HomeModel {
  async getData() {
    return await getData();
  }
}
