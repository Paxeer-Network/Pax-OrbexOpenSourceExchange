"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.middleware = void 0;
const server_1 = require("next/server");
const jose_1 = require("jose");
const gate_1 = require("./utils/gate");
const AUTH_PAGES = ["/login", "/register", "/forgot", "/reset"];
const tokenSecret = process.env.APP_ACCESS_TOKEN_SECRET;
const dev = process.env.NODE_ENV !== "production";
const frontendPort = process.env.NEXT_PUBLIC_FRONTEND_PORT || 3000;
const siteUrl = dev
    ? `http://localhost:${frontendPort}`
    : process.env.NEXT_PUBLIC_SITE_URL;
const isFrontendEnabled = process.env.NEXT_PUBLIC_FRONTEND === "true";
const defaultUserPath = process.env.NEXT_PUBLIC_DEFAULT_USER_PATH || "/user";
const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_STATUS === "true" || false;
if (!tokenSecret) {
    throw new Error("APP_ACCESS_TOKEN_SECRET is not set");
}
if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not set");
}
let rolesCache = null;
async function fetchRolesAndPermissions(request) {
    try {
        // Use localhost for server-side API calls
        const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || 4000;
        const apiUrl = `http://localhost:${backendPort}/api/auth/role`;
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        const response = await fetch(apiUrl, { headers });
        if (response.ok) {
            const data = await response.json();
            rolesCache = data.reduce((acc, role) => {
                acc[role.id] = {
                    name: role.name,
                    permissions: role.permissions.map((permission) => permission.name),
                };
                return acc;
            }, {});
        }
        else {
            console.error(`Failed to fetch roles and permissions: ${response.status} ${response.statusText}`);
            if (response.status === 500) {
                rolesCache = null; // Reset rolesCache to retry on the next call
            }
        }
    }
    catch (error) {
        console.error("Error fetching roles and permissions:", error);
        rolesCache = null; // Reset rolesCache to retry on the next call
    }
}
async function hasPermission(payload, path) {
    if (rolesCache && payload.sub && typeof payload.sub.role === "number") {
        const roleId = payload.sub.role;
        const role = rolesCache[roleId];
        if (role) {
            if (role.name === "Super Admin") {
                return true;
            }
            let requiredPermission = gate_1.gate[path];
            if (!requiredPermission && path.startsWith("/admin")) {
                requiredPermission = "Access Admin Dashboard";
            }
            if (requiredPermission &&
                role.permissions.length > 0 &&
                role.permissions.includes(requiredPermission)) {
                return true;
            }
        }
    }
    return false;
}
async function verifyToken(accessToken) {
    try {
        const result = await (0, jose_1.jwtVerify)(accessToken, new TextEncoder().encode(tokenSecret), {
            clockTolerance: 300, // Allow for 5 minutes of clock skew
        });
        return result;
    }
    catch (error) {
        if (error.code === "ERR_JWT_EXPIRED") {
            console.warn("Token expired:", error.message);
        }
        else {
            console.error("Error verifying token:", error.message);
        }
        return null;
    }
}
async function refreshToken(request) {
    var _a;
    try {
        // Use localhost for server-side API calls
        const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || 4000;
        const response = await fetch(`http://localhost:${backendPort}/api/auth/session`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                cookie: request.headers.get("cookie") || "",
            },
        });
        if (response.ok) {
            const cookies = response.headers.get("set-cookie") || response.headers.get("cookie");
            if (cookies) {
                const accessToken = ((_a = cookies.match(/accessToken=([^;]+);/)) === null || _a === void 0 ? void 0 : _a[1]) || null;
                return accessToken;
            }
            else {
                console.error("No 'set-cookie' header in response.");
            }
        }
        else {
            console.error("Failed to refresh token:", response.status, response.statusText);
        }
    }
    catch (error) {
        console.error("Error refreshing token:", error);
    }
    return null;
}
async function middleware(request) {
    var _a, _b;
    const { pathname } = request.nextUrl;
    // Fetch roles and permissions if not done yet
    if (!rolesCache || Object.keys(rolesCache).length === 0) {
        await fetchRolesAndPermissions(request);
    }
    if (!isFrontendEnabled && (pathname === "/" || pathname === "")) {
        const isLoggedIn = request.cookies.has("accessToken");
        const url = new URL(request.nextUrl);
        if (isLoggedIn) {
            url.pathname = defaultUserPath;
        }
        else {
            url.pathname = "/login";
        }
        return server_1.NextResponse.redirect(url.toString());
    }
    let accessToken = (_a = request.cookies.get("accessToken")) === null || _a === void 0 ? void 0 : _a.value;
    let payload = null;
    let isTokenValid = false;
    if (accessToken) {
        const verifiedToken = await verifyToken(accessToken);
        if (verifiedToken) {
            payload = verifiedToken.payload;
            isTokenValid = true;
        }
    }
    if (!isTokenValid) {
        const sessionId = (_b = request.cookies.get("sessionId")) === null || _b === void 0 ? void 0 : _b.value;
        if (sessionId) {
            accessToken = (await refreshToken(request));
            if (accessToken) {
                const verifiedToken = await verifyToken(accessToken);
                if (verifiedToken) {
                    payload = verifiedToken.payload;
                    isTokenValid = true;
                    // Set the new token in cookies
                    const response = server_1.NextResponse.next();
                    response.cookies.set("accessToken", accessToken, {
                        httpOnly: true,
                        secure: !dev,
                        sameSite: "lax",
                        path: "/",
                    });
                    return response;
                }
            }
        }
    }
    if (isMaintenance && pathname !== "/login") {
        if (!isTokenValid) {
            const url = new URL(request.nextUrl);
            url.pathname = "/maintenance";
            return server_1.NextResponse.redirect(url.toString());
        }
        else {
            if (!payload || !payload.sub || !payload.sub.role) {
                const url = new URL(request.nextUrl);
                url.pathname = "/maintenance";
                return server_1.NextResponse.redirect(url.toString());
            }
            const roleId = payload.sub.role;
            const userRole = rolesCache === null || rolesCache === void 0 ? void 0 : rolesCache[roleId];
            if (!userRole ||
                (userRole.name !== "Super Admin" &&
                    !userRole.permissions.includes("Access Admin Dashboard"))) {
                const url = new URL(request.nextUrl);
                url.pathname = "/maintenance";
                return server_1.NextResponse.redirect(url.toString());
            }
        }
    }
    // If the user is authenticated and tries to access auth pages, redirect to default path
    if (isTokenValid && AUTH_PAGES.includes(pathname)) {
        const returnUrl = request.nextUrl.searchParams.get("return") || defaultUserPath;
        const url = new URL(request.nextUrl);
        url.pathname = returnUrl;
        url.searchParams.delete("return");
        return server_1.NextResponse.redirect(url.toString());
    }
    // Redirect unauthenticated users trying to access restricted pages
    if (!isTokenValid &&
        (pathname.startsWith("/user") || pathname.startsWith("/admin"))) {
        const url = new URL(request.nextUrl);
        url.pathname = "/login";
        url.searchParams.set("return", pathname);
        return server_1.NextResponse.redirect(url.toString());
    }
    if (isTokenValid &&
        (pathname.startsWith("/admin") || pathname in gate_1.gate) &&
        !(await hasPermission(payload, pathname))) {
        const url = new URL(request.nextUrl);
        url.pathname = defaultUserPath;
        url.searchParams.delete("return");
        return server_1.NextResponse.redirect(url.toString());
    }
    return server_1.NextResponse.next();
}
exports.middleware = middleware;
exports.config = {
    matcher: [
        "/",
        "/admin/:path*",
        "/user/:path*",
        "/login",
        "/register",
        "/forgot",
        "/reset",
        "/uploads/:path*",
    ],
};
