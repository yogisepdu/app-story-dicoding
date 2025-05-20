import StoryDetailModel from "../model/story-detail-model";

const StoryDetailPresenter = {
  async init({ id, render }) {
    const { story, error, message } = await StoryDetailModel.fetchStoryDetail(
      id
    );
    if (error) {
      render({ error: true, message });
    } else {
      render({ story });
    }
  },
};

export default StoryDetailPresenter;
