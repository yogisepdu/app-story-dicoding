import { getStoryDetail } from "../data/api";

const StoryDetailModel = {
  async fetchStoryDetail(id) {
    return await getStoryDetail(id);
  },
};

export default StoryDetailModel;
