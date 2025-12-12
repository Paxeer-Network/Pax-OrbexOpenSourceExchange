"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Banner1_1 = __importDefault(require("./Banner1"));
const Banner2_1 = __importDefault(require("./Banner2"));
const Blog1_1 = __importDefault(require("./Blog1"));
const Blog2_1 = __importDefault(require("./Blog2"));
const Blog3_1 = __importDefault(require("./Blog3"));
const Blog4_1 = __importDefault(require("./Blog4"));
const Collection1_1 = __importDefault(require("./Collection1"));
const Collection2_1 = __importDefault(require("./Collection2"));
const Collection3_1 = __importDefault(require("./Collection3"));
const Content1_1 = __importDefault(require("./Content1"));
const Content2_1 = __importDefault(require("./Content2"));
const Cta1_1 = __importDefault(require("./Cta1"));
const Cta2_1 = __importDefault(require("./Cta2"));
const Cta3_1 = __importDefault(require("./Cta3"));
const Cta4_1 = __importDefault(require("./Cta4"));
const Faq1_1 = __importDefault(require("./Faq1"));
const Faq2_1 = __importDefault(require("./Faq2"));
const Faq3_1 = __importDefault(require("./Faq3"));
const Faq4_1 = __importDefault(require("./Faq4"));
const Feature1_1 = __importDefault(require("./Feature1"));
const Feature2_1 = __importDefault(require("./Feature2"));
const Feature3_1 = __importDefault(require("./Feature3"));
const Feature4_1 = __importDefault(require("./Feature4"));
const Feature5_1 = __importDefault(require("./Feature5"));
const Footer1_1 = __importDefault(require("./Footer1"));
const Footer2_1 = __importDefault(require("./Footer2"));
const Footer3_1 = __importDefault(require("./Footer3"));
const Footer4_1 = __importDefault(require("./Footer4"));
const Footer5_1 = __importDefault(require("./Footer5"));
const Footer6_1 = __importDefault(require("./Footer6"));
const Footer7_1 = __importDefault(require("./Footer7"));
const Footer8_1 = __importDefault(require("./Footer8"));
const Form1_1 = __importDefault(require("./Form1"));
const Form2_1 = __importDefault(require("./Form2"));
const Gallery1_1 = __importDefault(require("./Gallery1"));
const Gallery2_1 = __importDefault(require("./Gallery2"));
const Gallery3_1 = __importDefault(require("./Gallery3"));
const Hero1_1 = __importDefault(require("./Hero1"));
const Hero2_1 = __importDefault(require("./Hero2"));
const Hero3_1 = __importDefault(require("./Hero3"));
const Hero4_1 = __importDefault(require("./Hero4"));
const Hero5_1 = __importDefault(require("./Hero5"));
const Hero6_1 = __importDefault(require("./Hero6"));
const Hero7_1 = __importDefault(require("./Hero7"));
const Hero8_1 = __importDefault(require("./Hero8"));
const Newsletter1_1 = __importDefault(require("./Newsletter1"));
const Newsletter2_1 = __importDefault(require("./Newsletter2"));
const Newsletter3_1 = __importDefault(require("./Newsletter3"));
const Pricing1_1 = __importDefault(require("./Pricing1"));
const Pricing2_1 = __importDefault(require("./Pricing2"));
const Pricing3_1 = __importDefault(require("./Pricing3"));
const Review1_1 = __importDefault(require("./Review1"));
const Review2_1 = __importDefault(require("./Review2"));
const Review3_1 = __importDefault(require("./Review3"));
const Stats1_1 = __importDefault(require("./Stats1"));
const Stats2_1 = __importDefault(require("./Stats2"));
const Stats3_1 = __importDefault(require("./Stats3"));
const Team1_1 = __importDefault(require("./Team1"));
const Team2_1 = __importDefault(require("./Team2"));
const Team3_1 = __importDefault(require("./Team3"));
const Testimonial1_1 = __importDefault(require("./Testimonial1"));
const Testimonial2_1 = __importDefault(require("./Testimonial2"));
const Testimonial3_1 = __importDefault(require("./Testimonial3"));
const Trusted1_1 = __importDefault(require("./Trusted1"));
const Trusted2_1 = __importDefault(require("./Trusted2"));
const Trusted3_1 = __importDefault(require("./Trusted3"));
const Product1_1 = __importDefault(require("./Product1"));
const Product2_1 = __importDefault(require("./Product2"));
const Product3_1 = __importDefault(require("./Product3"));
const Product4_1 = __importDefault(require("./Product4"));
const Product5_1 = __importDefault(require("./Product5"));
const Heading1_1 = __importDefault(require("./Heading1"));
const Heading2_1 = __importDefault(require("./Heading2"));
const Heading3_1 = __importDefault(require("./Heading3"));
const NotFound1_1 = __importDefault(require("./NotFound1"));
const NotFound2_1 = __importDefault(require("./NotFound2"));
const NotFound3_1 = __importDefault(require("./NotFound3"));
const NotFound4_1 = __importDefault(require("./NotFound4"));
const NotFound5_1 = __importDefault(require("./NotFound5"));
const components = {
    Banner1: Banner1_1.default,
    Banner2: Banner2_1.default,
    Blog1: Blog1_1.default,
    Blog2: Blog2_1.default,
    Blog3: Blog3_1.default,
    Blog4: Blog4_1.default,
    Collection1: Collection1_1.default,
    Collection2: Collection2_1.default,
    Collection3: Collection3_1.default,
    Content1: Content1_1.default,
    Content2: Content2_1.default,
    Cta1: Cta1_1.default,
    Cta2: Cta2_1.default,
    Cta3: Cta3_1.default,
    Cta4: Cta4_1.default,
    Faq1: Faq1_1.default,
    Faq2: Faq2_1.default,
    Faq3: Faq3_1.default,
    Faq4: Faq4_1.default,
    Feature1: Feature1_1.default,
    Feature2: Feature2_1.default,
    Feature3: Feature3_1.default,
    Feature4: Feature4_1.default,
    Feature5: Feature5_1.default,
    Footer1: Footer1_1.default,
    Footer2: Footer2_1.default,
    Footer3: Footer3_1.default,
    Footer4: Footer4_1.default,
    Footer5: Footer5_1.default,
    Footer6: Footer6_1.default,
    Footer7: Footer7_1.default,
    Footer8: Footer8_1.default,
    Form1: Form1_1.default,
    Form2: Form2_1.default,
    Gallery1: Gallery1_1.default,
    Gallery2: Gallery2_1.default,
    Gallery3: Gallery3_1.default,
    Hero1: Hero1_1.default,
    Hero2: Hero2_1.default,
    Hero3: Hero3_1.default,
    Hero4: Hero4_1.default,
    Hero5: Hero5_1.default,
    Hero6: Hero6_1.default,
    Hero7: Hero7_1.default,
    Hero8: Hero8_1.default,
    Newsletter1: Newsletter1_1.default,
    Newsletter2: Newsletter2_1.default,
    Newsletter3: Newsletter3_1.default,
    Pricing1: Pricing1_1.default,
    Pricing2: Pricing2_1.default,
    Pricing3: Pricing3_1.default,
    Review1: Review1_1.default,
    Review2: Review2_1.default,
    Review3: Review3_1.default,
    Stats1: Stats1_1.default,
    Stats2: Stats2_1.default,
    Stats3: Stats3_1.default,
    Team1: Team1_1.default,
    Team2: Team2_1.default,
    Team3: Team3_1.default,
    Testimonial1: Testimonial1_1.default,
    Testimonial2: Testimonial2_1.default,
    Testimonial3: Testimonial3_1.default,
    Trusted1: Trusted1_1.default,
    Trusted2: Trusted2_1.default,
    Trusted3: Trusted3_1.default,
    Product1: Product1_1.default,
    Product2: Product2_1.default,
    Product3: Product3_1.default,
    Product4: Product4_1.default,
    Product5: Product5_1.default,
    Heading1: Heading1_1.default,
    Heading2: Heading2_1.default,
    Heading3: Heading3_1.default,
    PageNotFound1: NotFound1_1.default,
    PageNotFound2: NotFound2_1.default,
    PageNotFound3: NotFound3_1.default,
    PageNotFound4: NotFound4_1.default,
    PageNotFound5: NotFound5_1.default,
};
exports.default = components;
