import AuthModel from "../model/auth-model.js";
import { subscribeUserToPush } from "../utils/notification-helper.js";
import { subscribePushToAPI } from "../data/api.js";

export default class LoginPresenter {
  constructor({ onSuccess, onError }) {
    this._onSuccess = onSuccess;
    this._onError = onError;
  }

  async login({ email, password }) {
    try {
      const loginResult = await AuthModel.login({ email, password });
      const token = loginResult.token;

      try {
        const success = await subscribeUserToPush(token);
        if (success) {
          console.log("Push notification subscribed!");
        }
      } catch (pushError) {
        console.warn(
          "Push notification subscription failed:",
          pushError.message
        );
      }

      this._onSuccess(loginResult);
    } catch (error) {
      this._onError("Login gagal: " + error.message);
    }
  }
}
