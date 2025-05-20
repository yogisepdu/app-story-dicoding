import AuthModel from "../model/auth-model.js";

export default class RegisterPresenter {
  constructor({ onSuccess, onError }) {
    this._onSuccess = onSuccess;
    this._onError = onError;
  }

  async register({ name, email, password }) {
    try {
      const message = await AuthModel.register({ name, email, password });
      this._onSuccess(message);
    } catch (error) {
      this._onError(error.message || "Pendaftaran gagal.");
    }
  }
}
