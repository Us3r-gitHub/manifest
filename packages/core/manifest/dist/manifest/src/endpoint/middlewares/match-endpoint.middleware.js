"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchEndpointMiddleware = void 0;
const common_1 = require("@nestjs/common");
const endpoint_service_1 = require("../endpoint.service");
const constants_1 = require("../../constants");
const manifest_service_1 = require("../../manifest/services/manifest.service");
let MatchEndpointMiddleware = class MatchEndpointMiddleware {
    constructor(endpointService, manifestService) {
        this.endpointService = endpointService;
        this.manifestService = manifestService;
    }
    use(req, res, next) {
        const { tenantId } = req.params;
        const { endpoint, params } = this.endpointService.matchRoutePath({
            path: req.path
                .replace(`/${constants_1.API_PATH}`, '')
                .replace(`/${tenantId}`, '')
                .replace(`/${constants_1.ENDPOINTS_PATH}`, ''),
            method: req.method,
            endpoints: this.manifestService.getAppManifest().endpoints
        });
        req['endpoint'] = endpoint;
        req['dynamicParams'] = params;
        next();
    }
};
exports.MatchEndpointMiddleware = MatchEndpointMiddleware;
exports.MatchEndpointMiddleware = MatchEndpointMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [endpoint_service_1.EndpointService,
        manifest_service_1.ManifestService])
], MatchEndpointMiddleware);
