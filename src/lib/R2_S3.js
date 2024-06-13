import { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_S3_URL } from '$env/static/private';
import { S3Client } from '@aws-sdk/client-s3';

const R2_S3 = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_S3_URL}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
});

export { R2_S3 };
