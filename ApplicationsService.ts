import axios, { AxiosResponse } from 'axios';

import { Applicant } from './DictionariesService';

import {VisaCategories} from "@/components/custom/manage-categories/ManageCategories.tsx";

export type FlagCodes = 'rus' | 'pol' | 'blr' | 'fra' | 'ind';

export type BadgeColors =
	| 'blue'
	| 'orange'
	| 'light-blue'
	| 'green'
	| 'red'
	| 'light-blue-2'
	| 'silver';

export enum StatusCodes {
	CREATED = 10,
	AT_WORK = 20,
	CONFIRMED = 25,
	COMPLETED = 30,
	CANCELED = 100,
}

export const BadgesForStatus: { [key in StatusCodes]: BadgeColors } = {
	[StatusCodes.CREATED]: 'blue',
	[StatusCodes.AT_WORK]: 'orange',
	[StatusCodes.CONFIRMED]: 'light-blue',
	[StatusCodes.COMPLETED]: 'green',
	[StatusCodes.CANCELED]: 'red',
};

export const Statuses: { [key in StatusCodes]: string } = {
	[StatusCodes.CREATED]: 'Создан',
	[StatusCodes.AT_WORK]: 'В процессе',
	[StatusCodes.CONFIRMED]: 'Подтверждение',
	[StatusCodes.COMPLETED]: 'Выполнен',
	[StatusCodes.CANCELED]: 'Отменен',
};

export interface Route {
	countryCode: FlagCodes;
	countryName: string;
	missionCode: FlagCodes;
	missionName: string;
	routeId: string;
}

export interface Applications {
	applications: Application[];
	totalCount: number;
}

export interface Application {
	title: string;
	route: Route;
	status: number;
	date: Date;
	applicants: Applicant[];
	id: string;
	ticketLink: string | null;
}
export interface TimeSlot {
	dateFrom: string;
	dateTo: string;
}

export interface Calendar {
	minDaysInterval: number;
	dateSlots: TimeSlot[];
}

export interface CreateApplicationModel {
	routeId: string;
	calendar: Calendar;
	applicants: Applicant[];
	visaCategories: VisaCategories[];
}

// bunu da men yaratdim
export interface AddPaymentModel {
	amount: number;
	email: string;
}

export interface UpdateApplicationModel {
	applicationId: string;
	calendar: Calendar;
	applicants: Applicant[];
	visaCategories: VisaCategories[];
}

export interface SelectedApplicationModel {
	applicants: Applicant[];
	calendar: Calendar;
	created: string;
	id: string;
	internalNumber: string;
	route: Route;
	status: number;
	ticketLink: string | null;
	visaCategories: {
		visaCategoryId: string;
		cities: string[];
	}[];
}

export interface SelectedApplicationResponse {
	code: number;
	errors: string[];
	result: SelectedApplicationModel;
	succeeded: boolean;
}

export const FetchApplications = async (
	limit: number,
	offset: number,
	status?: string,
	search?: string
): Promise<Applications> => {
	let url = `${import.meta.env.VITE_API_URL}/application`;
	url += `?limit=${limit}&offset=${offset}`;
	url += status ? `&status=${status}` : '';
	url += search ? `&name=${search}` : '';

	const data = await axios.get(url);

	return {
		applications: data.data.result.items.map(
			(item: {
				internalNumber: string;
				route: Route;
				status: number;
				created: string | number | Date;
				applicants: Applicant[];
				id: string;
				ticketLink: string | null;
			}) => ({
				title: item.internalNumber,
				route: item.route as Route,
				status: item.status,
				date: new Date(item.created),
				applicants: item.applicants.map((applicant) => ({
					firstName: applicant.firstName,
					lastName: applicant.lastName,
					nationalityId: applicant.nationalityId,
					genderId: applicant.genderId,
					passportId: applicant.passportId,
					dateOfBirthday: new Date(applicant.dateOfBirthday),
					expirePassportDate: new Date(applicant.expirePassportDate),
				})),
				id: item.id,
				ticketLink: item.ticketLink,
			})
		),
		totalCount: data.data.result.totalCount,
	};
};

export const FetchSelectedApplication = async (
	applicationId: string
): Promise<SelectedApplicationModel> => {
	const url = `${import.meta.env.VITE_API_URL}/Application/${applicationId}`;

	const data: SelectedApplicationResponse = (await axios.get(url)).data;

	return data.result;
};

export const CreateApplication = (body: CreateApplicationModel): Promise<AxiosResponse> => {
	const url = `${import.meta.env.VITE_API_URL}/Application`;

	return axios.post(url, body);
};


// Bunu men yaratdim
export const AddPayment = (body: AddPaymentModel): Promise<AxiosResponse> => {
	const url = `${import.meta.env.VITE_API_URL}/User/Payment`;

	return axios.post(url, body);
};

export const UpdateApplication = (body: UpdateApplicationModel): Promise<AxiosResponse> => {
	const url = `${import.meta.env.VITE_API_URL}/Application`;

	return axios.put(url, body);
};

export const RemoveApplication = (applicationId: string): Promise<AxiosResponse> => {
	const url = `${import.meta.env.VITE_API_URL}/Application/${applicationId}`;

	return axios.delete(url);
};

export const DownloadFileApplication = async (ticketLink: string): Promise<void> => {
	const link = document.createElement('a');
	link.setAttribute('href', ticketLink);
	link.setAttribute('download', ticketLink);
	link.setAttribute('target', '_blank');
	link.style.display = 'none';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
