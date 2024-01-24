const { config } = require("dotenv");
const { S3Client, ListObjectsCommand } = require("@aws-sdk/client-s3");
config();

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_ID,
  },
  region: process.env.S3_REGION,
});

const main = async (startDate, endDate) => {
  try {
    const command = new ListObjectsCommand({
      Bucket: process.env.S3_BUCKET_NAME,
    });

    let isTruncated = true;
    const objects = [];

    while (isTruncated) {
      const { Contents, IsTruncated } = await s3Client.send(command);
      for (const object of Contents) {
        const { LastModified } = object;
        if (LastModified >= startDate && LastModified <= endDate) {
          objects.push(object);
        }
      }
      isTruncated = IsTruncated;
    }

    console.log("Final list of objects:", objects);
  } catch (error) {
    console.error(error);
  }
};

main(
  new Date("2024-01-24T17:02:09.000Z"),
  new Date("2024-01-24T17:03:53.000Z")
);

// 2024-01-24T17:02:08.000Z
// 2024-01-24T17:03:54.000Z
