# UploadStuff Server

This is a custom server for uploadthing. This allows you to upload files to your S3 bucket

## Installation

Clone the Repository

```bash
git clone https://github.com/fero1xd/uploadsutff-server.git
```

Install the dependencies

```bash
cd uploadsutff-server && yarn
```

Start in development

```bash
yarn start:dev
```

## Environment Variables

Create a .env file in the root of the project with the following

```bash
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
DATABASE_NAME=...
DATABASE_PORT=...

S3_ACCESS_TOKEN=...
S3_SECRET_TOKEN=...
S3_REGION=...
S3_BUCKET_NAME=...
```
