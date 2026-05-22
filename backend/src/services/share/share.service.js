class ShareService {

    constructor({ shareRepository }) {
        this.shareRepository = shareRepository;
    }

    async getPublicAudit(publicId) {

        return await this.shareRepository.findPublicAudit(
            publicId
        );
    }
}

export default ShareService;