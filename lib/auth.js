var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PayloadAuth {
    constructor(client, options) {
        this.client = client;
        this.options = Object.assign({ collectionSlug: 'users', tokenCookie: 'payload-token' }, options);
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, exp } = yield this.client.fetch(`${this.options.collectionSlug}/login`, {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                }),
            });
            localStorage.setItem(this.options.tokenCookie, JSON.stringify({ user, exp }));
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.fetch(`${this.options.collectionSlug}/logout`, { method: 'POST' });
            localStorage.removeItem(this.options.tokenCookie);
        });
    }
    isAuthenticated() {
        const token = localStorage.getItem(this.options.tokenCookie);
        if (token) {
            const { exp } = JSON.parse(token);
            return (exp * 1000) > Date.now();
        }
        return false;
    }
    getUser() {
        const token = localStorage.getItem(this.options.tokenCookie);
        if (token) {
            const { user } = JSON.parse(token);
            return user;
        }
        return false;
    }
}
export const useAuth = (client) => new PayloadAuth(client);
