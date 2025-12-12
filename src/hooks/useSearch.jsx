"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = require("@/stores/dashboard");
const react_1 = require("react");
const useSearch = (searchTerm) => {
    const { filteredMenu } = (0, dashboard_1.useDashboardStore)();
    const [data, setData] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (searchTerm.length > 0) {
            // flat menu and if result have menu or subMenu then push it to the array
            const flatMenu = [];
            const flat = (menu) => {
                if (menu.menu) {
                    menu.menu.forEach((subMenu) => {
                        flat(subMenu);
                    });
                }
                else {
                    flatMenu.push(menu);
                }
            };
            filteredMenu.forEach((menu) => {
                flat(menu);
            });
            const results = flatMenu.filter((menu) => {
                return menu.title.toLowerCase().includes(searchTerm.toLowerCase());
            });
            setData(results);
        }
        else {
            setData([]);
        }
    }, [searchTerm]);
    return { data };
};
exports.default = useSearch;
