import axios from 'axios';
import Keycloak from 'keycloak-js';

import { User } from '@/store/contexts/UserContext';

const keycloakInstance = new Keycloak('/keycloak.json');

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
export const Login = (onAuthenticatedCallback: (arg0: User) => void): Promise<void> =>
	keycloakInstance
		.init({
			onLoad: 'check-sso',
			checkLoginIframe: false,
			checkLoginIframeInterval: 300,
			silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
			pkceMethod: 'S256',
		})
		.then((authenticated) => {
			if (authenticated) {
				const tokenData = keycloakInstance.tokenParsed!;
				const user: User = {
					email: tokenData.email,
					firstname: tokenData.firstName ?? 'Незнакомец',
					lastname: tokenData.lastName ?? 'Неизвестный',
					roles: tokenData.roles,
				};

				onAuthenticatedCallback(user);

				axios.interceptors.request.use((config) => {
					config.headers.Authorization = `Bearer ${keycloakInstance.token}`;

					return config;
				});
			} else {
				keycloakInstance.login();
			}
		})
		.catch((e) => {
			throw e;
		});

export const Logout = (): Promise<void> => keycloakInstance.logout();

const KeyCloakService = {
	CallLogin: Login,
	CallLogout: Logout,
	keycloakInstance,
};

export default KeyCloakService;
