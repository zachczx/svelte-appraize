interface RecordResults {
	[index: string]: {
		id: string;
		name: string;
		dept: string;
		grade: string;
		session: string;
		sequence: number;
		previous: boolean;
		remarks: string;
		timestamp: Date;
		talent: boolean;
		owner: string;
	}[];
}
