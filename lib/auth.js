var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const useAuth = (client) => ({
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield client.fetch('users/login', {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                }),
            }).then(r => r.json());
            localStorage.setItem('payload-user', JSON.stringify(user));
        });
    },
    isAuthenticated() {
    }
});
