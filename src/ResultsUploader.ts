import {
    BlobServiceClient,
    BlockBlobUploadResponse,
} from "@azure/storage-blob";
import { AzureBlobConfiguration } from "./type.js";

class ResultsUploader {
    configuration: AzureBlobConfiguration;

    constructor(configuration: AzureBlobConfiguration) {
        this.configuration = configuration;
    }

    async upload(fileName: string, resultsJson: string): Promise<boolean> {
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            this.configuration.connectionString
        );

        const containerClient = blobServiceClient.getContainerClient(
            this.configuration.containerName
        );

        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        const uploadBlobResponse: BlockBlobUploadResponse =
            await blockBlobClient.upload(resultsJson, resultsJson.length, {
                blobHTTPHeaders: {
                    blobContentType: "application/json",
                },
            });

        const isSuccess = uploadBlobResponse._response.status === 201;

        console.log(
            `${new Date().toLocaleTimeString()} - ${fileName} uploaded, result: ${isSuccess}`
        );

        return isSuccess;
    }
}

export default ResultsUploader;
