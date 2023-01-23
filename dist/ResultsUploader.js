import { BlobServiceClient, } from "@azure/storage-blob";
class ResultsUploader {
    constructor(configuration) {
        this.configuration = configuration;
    }
    async upload(fileName, resultsJson) {
        const blobServiceClient = BlobServiceClient.fromConnectionString(this.configuration.connectionString);
        const containerClient = blobServiceClient.getContainerClient(this.configuration.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const uploadBlobResponse = await blockBlobClient.upload(resultsJson, resultsJson.length, {
            blobHTTPHeaders: {
                blobContentType: "application/json",
            },
        });
        const isSuccess = uploadBlobResponse._response.status === 201;
        console.log(`${new Date().toLocaleTimeString()} - ${fileName} uploaded, result: ${isSuccess}`);
        return isSuccess;
    }
}
export default ResultsUploader;
//# sourceMappingURL=ResultsUploader.js.map