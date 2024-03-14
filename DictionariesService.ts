import axios from 'axios';

export interface Applicant {
	nationalityId: string;
	genderId: string;
	firstName: string;
	lastName: string;
	nationalId: string;
	passportId: string;
	dateOfBirthday: Date;
	expirePassportDate: Date;
	visaToken: null;
}

export interface MissionData {
	routeId: string;
	missionCode: string;
	missionName: string;
}

export interface RouteData {
	countryCode: string;
	countryName: string;
	missions: MissionData[];
}

export interface GenderData {
	id: string;
	genderCode: string;
	genderName: string;
}

export interface NationalityData {
	id: string;
	name: string;
	isoCode: string;
}

export interface VisaCategoryType {
	visaTypeId: string;
	visaName: string;
}

export interface VisaCategoryCity {
	cityId: string;
	cityName: string;
	visaTypes: VisaCategoryType[];
}

export interface VisaCategory {
	visaCategoryId: string;
	name: string;
	cities: VisaCategoryCity[];
}

export const FetchRoutes = (): Promise<RouteData[]> =>
	axios
		.get(`${import.meta.env.VITE_API_URL}/Dictionary/Routes`)
		.then((data) => data.data.result.items);

export const FetchGenders = (): Promise<GenderData[]> =>
	axios
		.get(`${import.meta.env.VITE_API_URL}/Dictionary/Genders`)
		.then((data) => data.data.result.items);

export const FetchNationalities = (): Promise<NationalityData[]> =>
	axios
		.get(`${import.meta.env.VITE_API_URL}/Dictionary/Nationalities`)
		.then((data) => data.data.result.items as NationalityData[])
		.then((items) => items.sort((a, b) => (a.name > b.name ? 1 : -1)));

export const FetchVisaCategories = (routeId: string): Promise<VisaCategory[]> =>
	axios
		.get(`${import.meta.env.VITE_API_URL}/Dictionary/VisaCategories?routeId=${routeId}`)
		.then((data) => data.data.result.items as VisaCategory[])
		.then((items) => items.sort((a, b) => (a.name > b.name ? 1 : -1)));
