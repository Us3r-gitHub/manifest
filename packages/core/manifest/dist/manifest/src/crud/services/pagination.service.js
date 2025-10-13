"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationService = void 0;
const common_1 = require("@nestjs/common");
let PaginationService = class PaginationService {
    async paginate({ query, resultsPerPage, currentPage }) {
        const offset = (currentPage - 1) * resultsPerPage;
        const total = await query.getCount();
        const results = await query
            .skip(offset)
            .take(resultsPerPage === -1 ? total : resultsPerPage)
            .getMany();
        return {
            data: results.map(({ createdAt, ...rest }) => rest),
            currentPage,
            lastPage: Math.ceil(total / resultsPerPage),
            from: offset + 1,
            to: offset + resultsPerPage,
            total,
            perPage: resultsPerPage
        };
    }
};
exports.PaginationService = PaginationService;
exports.PaginationService = PaginationService = __decorate([
    (0, common_1.Injectable)()
], PaginationService);
