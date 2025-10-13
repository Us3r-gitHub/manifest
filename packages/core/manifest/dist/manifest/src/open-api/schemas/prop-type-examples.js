"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propTypeExamples = void 0;
const src_1 = require("../../../../types/src");
exports.propTypeExamples = {
    [src_1.PropType.String]: 'This is a simple string example.',
    [src_1.PropType.Text]: 'This is a longer text example that might span multiple lines and contain more detailed information.',
    [src_1.PropType.RichText]: '<p>This is <strong>rich text</strong> with <em>HTML formatting</em> and <a href="https://example.com">links</a>.</p>',
    [src_1.PropType.Number]: 42,
    [src_1.PropType.Link]: 'https://example.com',
    [src_1.PropType.Money]: 99.99,
    [src_1.PropType.Date]: '2024-01-15',
    [src_1.PropType.Timestamp]: '2024-01-15T10:30:00Z',
    [src_1.PropType.Email]: 'user@example.com',
    [src_1.PropType.Boolean]: true,
    [src_1.PropType.Password]: '********',
    [src_1.PropType.Choice]: null,
    [src_1.PropType.Location]: {
        lat: 45.1666,
        lng: 5.7167
    },
    [src_1.PropType.File]: 'https://example.com/uploads/documents/report.pdf',
    [src_1.PropType.Image]: null,
    [src_1.PropType.Nested]: null
};
